/*
 Cozy Loop — Express Server
 Serves the static site and provides a minimal admin API
 for adding products and uploading images.

 Security:
 - Basic Auth on admin endpoints (credentials from .env)
 - Rate limiting on admin API (15 req/min)
 - X-Requested-With header required on POST (CSRF protection)
 - admin.html gated behind Basic Auth
 - Input sanitization on all product fields
 - Helmet for security headers

 Usage:
 1. npm install
 2. Create a .env file and set ADMIN_USER, ADMIN_PASS, PORT
 3. npm start
*/

const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const multer = require('multer');
const helmet = require('helmet');
const crypto = require('crypto');
require('dotenv').config();

const APP_ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const PRODUCTS_JSON = path.join(APP_ROOT, 'products.json');
const UPLOAD_DIR = path.join(APP_ROOT, 'images', 'uploads');

// Ensure upload dir exists
if (!fsSync.existsSync(UPLOAD_DIR)) fsSync.mkdirSync(UPLOAD_DIR, { recursive: true });

// Ensure products.json exists
if (!fsSync.existsSync(PRODUCTS_JSON)) fsSync.writeFileSync(PRODUCTS_JSON, '[]', 'utf8');

const app = express();

// ─── Security Headers ───────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrcAttr: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"]
    }
  }
}));
app.disable('x-powered-by');

// ─── Rate Limiter (in-memory, no dependency) ────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 15;           // 15 requests per window

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return next();
  }
  const entry = rateLimitMap.get(ip);
  if (now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return next();
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
  }
  return next();
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.start > RATE_LIMIT_WINDOW * 2) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

// ─── Input Sanitizer ─────────────────────────────────────────────
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')     // strip HTML angle brackets
    .replace(/&/g, '&amp;')   // encode ampersands
    .trim()
    .slice(0, 500);           // max length
}

// ─── Basic Auth Middleware ──────────────────────────────────────
function checkBasicAuth(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const creds = Buffer.from(auth.split(' ')[1], 'base64').toString();
  const [user, ...rest] = creds.split(':');
  const pass = rest.join(':'); // handle passwords with colons
  if (
    user === process.env.ADMIN_USER &&
    pass === process.env.ADMIN_PASS &&
    process.env.ADMIN_USER &&
    process.env.ADMIN_PASS
  ) {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden' });
}

// ─── CSRF-like Header Check ────────────────────────────────────
function requireXHR(req, res, next) {
  if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return res.status(403).json({ error: 'Missing X-Requested-With header' });
  }
  return next();
}

// ─── Gate admin.html behind auth ────────────────────────────────
app.get('/admin.html', (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).send('Authorization required');
  }
  const creds = Buffer.from(auth.split(' ')[1], 'base64').toString();
  const [user, ...rest] = creds.split(':');
  const pass = rest.join(':');
  if (
    user === process.env.ADMIN_USER &&
    pass === process.env.ADMIN_PASS &&
    process.env.ADMIN_USER &&
    process.env.ADMIN_PASS
  ) {
    return res.sendFile(path.join(APP_ROOT, 'admin.html'));
  }
  res.set('WWW-Authenticate', 'Basic realm="Admin"');
  return res.status(401).send('Invalid credentials');
});

// Exclude sensitive backend and configuration files from being served statically
app.use((req, res, next) => {
  const blocked = [
    '/server.js',
    '/package.json',
    '/package-lock.json',
    '/.gitignore',
    '/products.json',
    '/README.md',
    '/patch_html_v2.py'
  ];
  if (blocked.includes(req.path.toLowerCase())) {
    return res.status(403).send('Forbidden');
  }
  next();
});

// ─── Static Files ───────────────────────────────────────────────
app.use(express.static(APP_ROOT, {
  extensions: ['html', 'htm'],
  index: 'index.html',
  // Exclude admin.html from static serving (handled above)
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('admin.html')) {
      res.status(403);
    }
  }
}));

app.use(express.json());

// ─── Multer Upload Config ───────────────────────────────────────
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(12).toString('hex') + ext;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  }
});

// ─── API Routes ─────────────────────────────────────────────────

// GET products (public)
app.get('/api/products', async (req, res) => {
  try {
    const data = await fs.readFile(PRODUCTS_JSON, 'utf8');
    const arr = JSON.parse(data);
    return res.json(arr);
  } catch (e) {
    return res.json([]);
  }
});

// POST add a product (protected: auth + rate limit + CSRF header)
app.post('/api/products', rateLimit, requireXHR, checkBasicAuth, upload.single('image'), async (req, res) => {
  try {
    const id = sanitize(req.body.id);
    const name = sanitize(req.body.name);
    const category = sanitize(req.body.category);
    const price = req.body.price;
    const desc = sanitize(req.body.desc);
    const size = sanitize(req.body.size);
    const materials = sanitize(req.body.materials);
    const sub = req.body.sub ? sanitize(req.body.sub) : undefined;

    if (!id || !name || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields: id, name, category, price' });
    }

    const idSafe = id.toLowerCase().replace(/[^a-z0-9\-]/g, '-');
    const priceNum = parseFloat(price);
    if (Number.isNaN(priceNum) || priceNum < 0 || priceNum > 99999) {
      return res.status(400).json({ error: 'price must be a valid number between 0 and 99999' });
    }

    const imageName = req.file ? `uploads/${req.file.filename}` : null;

    let products = [];
    try {
      const raw = await fs.readFile(PRODUCTS_JSON, 'utf8');
      products = JSON.parse(raw);
    } catch (e) { products = []; }

    if (products.find(p => p.id === idSafe)) {
      return res.status(400).json({ error: 'Product id already exists' });
    }

    const newProduct = {
      id: idSafe,
      category,
      name,
      img: imageName ? imageName : (req.body.img ? sanitize(req.body.img) : 'logo'),
      price: priceNum,
      desc: desc || '',
      size: size || '',
      materials: materials || ''
    };
    if (sub) newProduct.sub = sub;

    products.push(newProduct);
    await fs.writeFile(PRODUCTS_JSON, JSON.stringify(products, null, 2), 'utf8');

    console.log(`[ADMIN] Product added: ${idSafe} by ${req.headers['authorization'] ? 'authenticated' : 'unknown'}`);
    return res.status(201).json(newProduct);
  } catch (err) {
    console.error('[ERROR] POST /api/products:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// Lightweight endpoint for frontend fetch (/products.json)
app.get('/products.json', async (req, res) => {
  try {
    const raw = await fs.readFile(PRODUCTS_JSON, 'utf8');
    res.set('Content-Type', 'application/json');
    return res.send(raw);
  } catch (e) {
    return res.json([]);
  }
});

// ─── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Cozy Loop server running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html (Basic Auth required)`);
});
