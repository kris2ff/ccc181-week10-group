// CampusConnect API (Express). No database: demo users live in a list below.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

if (!JWT_SECRET || !CLIENT_ORIGIN) {
  console.error('Missing JWT_SECRET or CLIENT_ORIGIN. Copy .env.example to .env first.');
  process.exit(1);
}

// Demo users. Passwords are stored HASHED, never as plain text.
const users = [
  {
    id: 1,
    name: 'Demo Student',
    email: 'student@campusconnect.test',
    passwordHash: bcrypt.hashSync('Campus26', 10),
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Never include the password hash in a response.
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

const app = express();

// cors and json come BEFORE the routes.
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// ---- GET /api/v1/health ---------------------------------------------
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ---- POST /api/v1/sessions (log in) ---------------------------------
app.post('/api/v1/sessions', (req, res) => {
  const { email, password } = req.body ?? {};

  // 1. Validate the body.
  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    password.length === 0 ||
    !EMAIL_PATTERN.test(email.trim())
  ) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // 2. Find the user (email in lowercase).
  const user = users.find((u) => u.email === email.trim().toLowerCase());

  // 3 + 4. Unknown email OR wrong password: same 401 message.
  // (compare against a dummy hash for unknown emails so timing does not reveal them)
  const hash = user ? user.passwordHash : users[0].passwordHash;
  const passwordOk = bcrypt.compareSync(password, hash);
  if (!user || !passwordOk) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // 5. Success: token that expires in 1 hour.
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1h' });
  return res.status(200).json({ token, user: publicUser(user) });
});

// ---- Middleware: requires Authorization: Bearer <token> --------------
function requireAuth(req, res, next) {
  const header = req.get('Authorization') || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Not logged in.' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Not logged in.' });
    }
    req.user = user;
    return next();
  } catch {
    // wrong, tampered or expired token
    return res.status(401).json({ error: 'Not logged in.' });
  }
}

// ---- GET /api/v1/users/me --------------------------------------------
app.get('/api/v1/users/me', requireAuth, (req, res) => {
  res.status(200).json(publicUser(req.user));
});

// ---- 404 for unknown addresses ---------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// ---- Error handler (400 for broken JSON, otherwise 500, no stack) ----
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  console.error(err.message);
  return res.status(500).json({ error: 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
