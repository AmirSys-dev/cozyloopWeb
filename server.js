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
const { createClient } = require('@supabase/supabase-js');

const APP_ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(APP_ROOT, 'images', 'uploads');

// Ensure upload dir exists
if (!fsSync.existsSync(UPLOAD_DIR)) fsSync.mkdirSync(UPLOAD_DIR, { recursive: true });

// Initialize Supabase Client
const hasSupabaseUrl = process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project');
const hasSupabaseKey = process.env.SUPABASE_KEY && !process.env.SUPABASE_KEY.includes('your-service-role');

if (!hasSupabaseUrl || !hasSupabaseKey) {
  console.warn('\n======================================================');
  console.warn('WARNING: Supabase URL and Key are not properly configured.');
  console.warn('Backend database endpoints will fail until configured in .env.');
  console.warn('======================================================\n');
}

const supabase = (hasSupabaseUrl && hasSupabaseKey)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null;

// Middleware to check if Supabase is available
function checkSupabase(req, res, next) {
  if (!supabase) {
    return res.status(503).json({ error: 'Database service is currently unconfigured or unavailable.' });
  }
  next();
}

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
    '/orders.json',
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
app.get('/api/products', checkSupabase, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) throw error;
    return res.json(data || []);
  } catch (e) {
    console.error('[ERROR] GET /api/products:', e);
    return res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// POST add a product (protected: auth + rate limit + CSRF header)
app.post('/api/products', rateLimit, requireXHR, checkBasicAuth, checkSupabase, upload.single('image'), async (req, res) => {
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

    // Check duplicate in Supabase
    const { data: existing, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', idSafe)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existing) {
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

    const { data: insertedProduct, error: insertError } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single();

    if (insertError) throw insertError;

    console.log(`[ADMIN] Product added: ${idSafe} by ${req.headers['authorization'] ? 'authenticated' : 'unknown'}`);
    return res.status(201).json(insertedProduct);
  } catch (err) {
    console.error('[ERROR] POST /api/products:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// Lightweight endpoint for frontend fetch (/products.json)
app.get('/products.json', checkSupabase, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) throw error;
    res.set('Content-Type', 'application/json');
    return res.json(data || []);
  } catch (e) {
    console.error('[ERROR] GET /products.json:', e);
    return res.json([]);
  }
});

// ─── Orders API Routes ──────────────────────────────────────────

// Helper to map database snake_case columns back to camelCase for the frontend client
function mapOrderFromDb(order) {
  if (!order) return null;
  const mapped = { ...order };
  if (order.shipping_cost !== undefined) {
    mapped.shippingCost = parseFloat(order.shipping_cost);
    delete mapped.shipping_cost;
  }
  return mapped;
}

// POST create order (public)
app.post('/api/orders', rateLimit, checkSupabase, async (req, res) => {
  try {
    const { customer, items, subtotal, shippingCost, total, region, notes } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.postcode || !customer.city) {
      return res.status(400).json({ error: 'Missing required customer details' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Generate unique Order ID: CL-2026-XXXXXX
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `CL-2026-${randomNum}`;

    const dateStr = new Date().toLocaleString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const initialHistory = [
      {
        status: 'Pending',
        location: 'Order received. Preparing crochet items.',
        timestamp: new Date().toISOString()
      }
    ];

    const newOrder = {
      id: orderId,
      date: dateStr,
      customer: {
        name: sanitize(customer.name),
        phone: sanitize(customer.phone),
        address: sanitize(customer.address),
        postcode: sanitize(customer.postcode),
        city: sanitize(customer.city),
        state: sanitize(customer.state || 'Peninsular Malaysia')
      },
      items: items.map(item => ({
        id: sanitize(item.id),
        name: sanitize(item.name),
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
        options: {
          attach: sanitize(item.options?.attach || 'None'),
          notes: sanitize(item.options?.notes || '')
        },
        customDetails: sanitize(item.customDetails || '')
      })),
      subtotal: parseFloat(subtotal) || 0,
      shippingCost: parseFloat(shippingCost) || 0,
      total: parseFloat(total) || 0,
      region: sanitize(region || 'West'),
      notes: sanitize(notes || ''),
      status: 'Pending',
      location: 'Order received. Preparing crochet items.',
      history: initialHistory
    };

    // Map shippingCost -> shipping_cost for database insert
    const orderDbPayload = {
      ...newOrder,
      shipping_cost: newOrder.shippingCost
    };
    delete orderDbPayload.shippingCost;

    const { data: insertedOrder, error: insertError } = await supabase
      .from('orders')
      .insert([orderDbPayload])
      .select()
      .single();

    if (insertError) throw insertError;

    console.log(`[ORDER] Order created: ${orderId} for ${newOrder.customer.name}`);
    return res.status(201).json(mapOrderFromDb(insertedOrder));
  } catch (err) {
    console.error('[ERROR] POST /api/orders:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// GET track order (public lookup)
app.get('/api/orders/track/:id', checkSupabase, async (req, res) => {
  try {
    const orderId = req.params.id.toUpperCase();
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (error) throw error;
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json(mapOrderFromDb(order));
  } catch (err) {
    console.error('[ERROR] GET /api/orders/track:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// GET all orders (admin only)
app.get('/api/orders', rateLimit, checkBasicAuth, checkSupabase, async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json((orders || []).map(mapOrderFromDb));
  } catch (err) {
    console.error('[ERROR] GET /api/orders:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// PUT update order status/location (admin only)
app.put('/api/orders/:id', rateLimit, requireXHR, checkBasicAuth, checkSupabase, async (req, res) => {
  try {
    const orderId = req.params.id.toUpperCase();
    const { status, location } = req.body;

    if (!status || !location) {
      return res.status(400).json({ error: 'Missing status or location update message' });
    }

    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedHistory = [...(order.history || [])];
    updatedHistory.push({
      status: sanitize(status),
      location: sanitize(location),
      timestamp: new Date().toISOString()
    });

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status: sanitize(status),
        location: sanitize(location),
        history: updatedHistory
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log(`[ADMIN] Order updated: ${orderId} status set to ${updatedOrder.status}`);
    return res.json(mapOrderFromDb(updatedOrder));
  } catch (err) {
    console.error('[ERROR] PUT /api/orders:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// DELETE delete order (admin only)
app.delete('/api/orders/:id', rateLimit, requireXHR, checkBasicAuth, checkSupabase, async (req, res) => {
  try {
    const orderId = req.params.id.toUpperCase();
    const { data, error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log(`[ADMIN] Order deleted: ${orderId}`);
    return res.json({ success: true, message: `Order ${orderId} deleted successfully` });
  } catch (err) {
    console.error('[ERROR] DELETE /api/orders:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// ─── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Cozy Loop server running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html (Basic Auth required)`);
});
