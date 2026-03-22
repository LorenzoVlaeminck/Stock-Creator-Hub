import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import crypto from 'crypto';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For Apple form_post

// Initialize SQLite Database
const db = new Database('app.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    provider TEXT,
    provider_id TEXT
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const hashPassword = (password: string) => crypto.createHash('sha256').update(password).digest('hex');
const generateId = () => crypto.randomUUID();
const generateToken = () => crypto.randomBytes(32).toString('hex');

// --- Local Authentication ---
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  try {
    const id = generateId();
    const stmt = db.prepare('INSERT INTO users (id, email, password, name, provider) VALUES (?, ?, ?, ?, ?)');
    stmt.run(id, email, hashPassword(password), name, 'local');
    
    const token = generateToken();
    db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, id);
    
    res.json({ token, user: { id, email, name } });
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Server error during registration' });
    }
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, hashPassword(password)) as any;
  
  if (user) {
    const token = generateToken();
    db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, user.id);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  const session = db.prepare('SELECT user_id FROM sessions WHERE token = ?').get(token) as any;
  
  if (!session) return res.status(401).json({ error: 'Invalid or expired token' });
  
  const user = db.prepare('SELECT id, email, name, provider FROM users WHERE id = ?').get(session.user_id) as any;
  res.json({ user });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  }
  res.json({ success: true });
});

// --- OAuth Authentication ---
const getRedirectUri = (req: express.Request, provider: string) => {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/api/auth/callback/${provider}`;
};

app.get('/api/auth/url/:provider', (req, res) => {
  const provider = req.params.provider;
  const redirectUri = getRedirectUri(req, provider);
  let url = '';

  if (provider === 'google') {
    url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
  } else if (provider === 'github') {
    url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
  } else if (provider === 'microsoft') {
    url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.MICROSOFT_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=User.Read`;
  } else if (provider === 'apple') {
    url = `https://appleid.apple.com/auth/authorize?client_id=${process.env.APPLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=name email&response_mode=form_post`;
  } else {
    return res.status(400).json({ error: 'Unknown provider' });
  }

  res.json({ url });
});

const handleOAuthCallback = async (req: express.Request, res: express.Response, provider: string) => {
  const code = req.query.code || req.body.code;
  if (!code) return res.status(400).send('No authorization code provided');

  try {
    const redirectUri = getRedirectUri(req, provider);
    let email = '';
    let name = '';
    let providerId = '';

    // Exchange code for token and fetch profile
    if (provider === 'google') {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenData.error_description || 'Google token error');
      
      const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const profileData = await profileRes.json();
      email = profileData.email;
      name = profileData.name;
      providerId = profileData.id;
    } else if (provider === 'github') {
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || tokenData.error) throw new Error(tokenData.error_description || 'GitHub token error');

      const profileRes = await fetch('https://api.github.com/user', {
        headers: { 
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'Stock-Creator-Hub'
        }
      });
      const profileData = await profileRes.json();
      
      let userEmail = profileData.email;
      if (!userEmail) {
        const emailRes = await fetch('https://api.github.com/user/emails', {
          headers: { 
            Authorization: `Bearer ${tokenData.access_token}`,
            'User-Agent': 'Stock-Creator-Hub'
          }
        });
        const emails = await emailRes.json();
        const primaryEmail = emails.find((e: any) => e.primary);
        userEmail = primaryEmail ? primaryEmail.email : emails[0].email;
      }
      
      email = userEmail;
      name = profileData.name || profileData.login;
      providerId = profileData.id.toString();
    } else if (provider === 'microsoft') {
      const tokenRes = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.MICROSOFT_CLIENT_ID || '',
          client_secret: process.env.MICROSOFT_CLIENT_SECRET || '',
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenData.error_description || 'Microsoft token error');

      const profileRes = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const profileData = await profileRes.json();
      email = profileData.userPrincipalName || profileData.mail;
      name = profileData.displayName;
      providerId = profileData.id;
    } else if (provider === 'apple') {
      const tokenRes = await fetch('https://appleid.apple.com/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.APPLE_CLIENT_ID || '',
          client_secret: process.env.APPLE_CLIENT_SECRET || '',
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenData.error || 'Apple token error');

      const idTokenParts = tokenData.id_token.split('.');
      const payload = JSON.parse(Buffer.from(idTokenParts[1], 'base64').toString());
      
      email = payload.email;
      providerId = payload.sub;
      
      if (req.body.user) {
        const appleUser = JSON.parse(req.body.user);
        name = `${appleUser.name.firstName} ${appleUser.name.lastName}`.trim();
      } else {
        name = 'Apple User';
      }
    }

    // Upsert user in database
    let user = db.prepare('SELECT * FROM users WHERE provider = ? AND provider_id = ?').get(provider, providerId) as any;
    if (!user) {
      // Check if email exists to avoid UNIQUE constraint error
      const existingEmail = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (existingEmail) {
        throw new Error('An account with this email already exists.');
      }
      
      const id = generateId();
      db.prepare('INSERT INTO users (id, email, name, provider, provider_id) VALUES (?, ?, ?, ?, ?)').run(id, email, name, provider, providerId);
      user = { id, email, name };
    }

    // Create session
    const token = generateToken();
    db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, user.id);

    // Return HTML to post message to the opener window
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', token: '${token}' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error('OAuth Error:', error);
    res.status(500).send(`
      <html>
        <body>
          <h3>Authentication failed</h3>
          <p>${error.message}</p>
          <p>Note: OAuth requires valid Client IDs and Secrets configured in the environment variables.</p>
          <button onclick="window.close()">Close</button>
        </body>
      </html>
    `);
  }
};

app.get('/api/auth/callback/:provider', (req, res) => handleOAuthCallback(req, res, req.params.provider));
app.post('/api/auth/callback/:provider', (req, res) => handleOAuthCallback(req, res, req.params.provider)); // For Apple form_post

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
