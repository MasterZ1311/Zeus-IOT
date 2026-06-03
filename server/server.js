require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');
const PDFDocument = require('pdfkit');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'ZEUS_THUNDERBOLT_SECURE_KEY_2026_99X';

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter for public endpoints
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});

// Ensure uploads folder exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve static uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// Serve static frontend files from parent directory
const FRONTEND_DIR = path.join(__dirname, '..');
app.use(express.static(FRONTEND_DIR));

// Configure multer for file uploads
let storage;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  // Use Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'zeus_iot_reports',
      allowed_formats: ['jpg', 'png', 'pdf', 'docx', 'txt']
    }
  });
  console.log("Cloudinary storage enabled.");
} else {
  // Fallback to local disk storage
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  console.log("Local disk storage enabled.");
}

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// Middleware: Authenticate JWT Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

// Ensure default admin user and seed data
async function seedDatabase() {
  try {
    const hashedPassword = bcrypt.hashSync('V*T@Z#U$', 10);
    const adminUser = await prisma.user.findUnique({ where: { username: 'admin' } });
    if (!adminUser) {
      await prisma.user.create({
        data: { username: 'admin', password: hashedPassword }
      });
      console.log("Default admin seeded successfully.");
    } else {
      await prisma.user.update({
        where: { username: 'admin' },
        data: { password: hashedPassword }
      });
      console.log("Admin password updated to V*T@Z#U$");
    }

    // Clear all existing pre-done projects as requested by the user
    await prisma.project.deleteMany({});
    console.log("Existing projects cleared.");
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}

// Call seed at startup
seedDatabase();

// --- Zod Validation Schemas ---
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  cat: z.string().min(1, 'Category is required'),
  status: z.string().min(1, 'Status is required'),
  nodesOnline: z.coerce.number().int().nonnegative().optional().default(0),
  nodesTotal: z.coerce.number().int().positive().optional().default(1),
  icon: z.string().min(1, 'Icon is required')
});

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact_no: z.string().min(1, 'Contact number is required'),
  institution: z.string().optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  description: z.string().optional(),
  perf_expectation: z.string().optional()
});

const reportSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact_no: z.string().min(1, 'Contact number is required'),
  institution: z.string().optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  description: z.string().optional(),
  format: z.string().min(1, 'Format is required'),
  way_to_make: z.string().min(1, 'Way to make is required'),
  performance_tier: z.string().min(1, 'Performance tier is required')
});

const learningSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact_no: z.string().min(1, 'Contact number is required'),
  institution: z.string().optional(),
  preferred_date: z.string().min(1, 'Preferred date is required'),
  topics: z.string().min(1, 'Topics are required')
});

const WHATSAPP_NUMBER = '919080809088';

// --- WhatsApp Message Generators ---

function buildLearningWhatsAppURL(data) {
  const msg = [
    `🎓 *1-ON-1 LEARNING SESSION REQUEST*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Name:* ${data.name}`,
    `📞 *WhatsApp:* ${data.contact_no}`,
    `🏛️ *Institution:* ${data.institution || 'Not specified'}`,
    `📅 *Preferred Date:* ${data.preferred_date}`,
    `🧠 *Topics to Learn:*\n${data.topics}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 _Submitted via Zeus IOT website_`
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// --- WhatsApp Message Generators ---

function buildProjectWhatsAppURL(data) {
  const tier = (data.perf_expectation || 'CUSTOM').toUpperCase();
  const isLearning = tier === 'CUSTOM'; // CUSTOM tier includes 1-on-1 session
  const typeLabel = tier === 'PROFESSIONAL'
    ? '🚀 PROFESSIONAL PROJECT REQUEST'
    : tier === 'BASIC'
    ? '🔧 BASIC PROJECT REQUEST'
    : '⚡ CUSTOM PROJECT + LEARNING REQUEST';

  const msg = [
    `${typeLabel}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Name:* ${data.name}`,
    `📞 *WhatsApp:* ${data.contact_no}`,
    `🏛️ *Institution:* ${data.institution || 'Not specified'}`,
    `📅 *Deadline:* ${data.deadline}`,
    `⚡ *Tier:* ${tier}`,
    `📋 *Description:*\n${data.description || 'Not provided'}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 _Submitted via Zeus IOT website_`
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function buildReportWhatsAppURL(data) {
  const tier = (data.performance_tier || 'CUSTOM').toUpperCase();
  const msg = [
    `📄 *ACADEMIC REPORT REQUEST*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Name:* ${data.name}`,
    `📞 *WhatsApp:* ${data.contact_no}`,
    `🏛️ *Institution:* ${data.institution || 'Not specified'}`,
    `📅 *Deadline:* ${data.deadline}`,
    `🎯 *Tier:* ${tier}`,
    `📐 *Report Format:* ${data.format}`,
    `✍️ *Citation Style:* ${data.way_to_make}`,
    `📋 *Description:*\n${data.description || 'Not provided'}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 _Submitted via Zeus IOT website_`
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}


// --- 1. Authentication Endpoints ---

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, username: user.username });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    console.error(error);
    res.status(500).json({ error: 'Server database error.' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, username: req.user.username });
});

// --- 2. Projects CRUD Endpoints (Write is protected, Read is public) ---

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database fetch error.' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const data = projectSchema.parse(req.body);
    const id = Date.now().toString();

    const project = await prisma.project.create({
      data: { ...data, id }
    });
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to insert project.' });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const data = projectSchema.parse(req.body);

    const project = await prisma.project.update({
      where: { id },
      data
    });
    res.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

// --- Admin: Get all messages (contact + learning submissions) ---
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const [contacts, reports, learnings] = await Promise.all([
      prisma.contact.findMany({ orderBy: { created_at: 'desc' }, take: 50 }),
      prisma.report.findMany({ orderBy: { created_at: 'desc' }, take: 50 }),
      prisma.learning.findMany({ orderBy: { created_at: 'desc' }, take: 50 }),
    ]);

    const messages = [
      ...contacts.map(c => ({ ...c, type: 'Contact Request' })),
      ...reports.map(r => ({ ...r, type: 'Report Request' })),
      ...learnings.map(l => ({ ...l, type: 'Learning Session' })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// --- 3. Public Ingestion Endpoints ---

app.post('/api/contact', publicLimiter, async (req, res) => {
  try {
    const data = contactSchema.parse(req.body);
    
    const contact = await prisma.contact.create({
      data: {
        ...data,
        institution: data.institution || '',
        description: data.description || '',
        perf_expectation: data.perf_expectation || 'CUSTOM'
      }
    });
    const whatsapp_url = buildProjectWhatsAppURL({
      ...data,
      perf_expectation: data.perf_expectation || 'CUSTOM'
    });
    res.status(201).json({ success: true, id: contact.id, message: 'Contact request recorded.', whatsapp_url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to save contact request.' });
  }
});

app.post('/api/report', publicLimiter, upload.single('supporting_doc'), async (req, res) => {
  try {
    const data = reportSchema.parse(req.body);
    const file_path = req.file ? `/uploads/${req.file.filename}` : null;

    const report = await prisma.report.create({
      data: {
        ...data,
        institution: data.institution || '',
        description: data.description || '',
        file_path
      }
    });
    const whatsapp_url = buildReportWhatsAppURL(data);
    res.status(201).json({ success: true, id: report.id, message: 'Report request recorded.', file_path, whatsapp_url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to save report request.' });
  }
});

app.post('/api/learning', publicLimiter, async (req, res) => {
  try {
    const data = learningSchema.parse(req.body);
    const learning = await prisma.learning.create({
      data: {
        ...data,
        institution: data.institution || ''
      }
    });
    const whatsapp_url = buildLearningWhatsAppURL(data);
    res.status(201).json({ success: true, id: learning.id, message: 'Learning request recorded.', whatsapp_url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to save learning request.' });
  }
});

app.post('/api/generate-invoice', publicLimiter, (req, res) => {
  try {
    const { name, complexity, hardware, total } = req.body;
    
    const doc = new PDFDocument({ margin: 50 });
    
    // Setup response headers to download the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Zeus-Estimate-${Date.now()}.pdf`);
    
    doc.pipe(res);
    
    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('ZEUS IOT', { align: 'right' });
    doc.fontSize(10).font('Helvetica').text('Automated Project Estimate', { align: 'right' });
    doc.moveDown(2);
    
    // Title
    doc.fontSize(24).font('Helvetica-Bold').text('ESTIMATE INVOICE', { align: 'left' });
    doc.moveDown();
    
    // Client Details
    doc.fontSize(12).font('Helvetica-Bold').text('Client Details:');
    doc.font('Helvetica').text(`Name: ${name || 'Prospective Client'}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown(2);
    
    // Project Details Table
    doc.font('Helvetica-Bold').text('Project Specifications:');
    doc.moveDown(0.5);
    
    doc.font('Helvetica').text(`Complexity Level: ${complexity}`);
    doc.text(`Custom Hardware Integration: ${hardware ? 'Yes (+ ₹4,000)' : 'No'}`);
    doc.moveDown(2);
    
    // Total
    doc.fontSize(16).font('Helvetica-Bold').text(`Estimated Total: ₹${total.toLocaleString()}`, { align: 'right' });
    
    doc.moveDown(4);
    doc.fontSize(10).font('Helvetica-Oblique').text('Note: This is an automatically generated estimate and does not constitute a binding contract. Final pricing is confirmed after technical review.', { align: 'center', color: 'grey' });
    
    doc.end();
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ error: 'Failed to generate PDF invoice.' });
  }
});


// 404 Catch-All — serve branded 404 page
app.use((req, res) => {
  const notFoundPath = path.join(FRONTEND_DIR, '404.html');
  if (fs.existsSync(notFoundPath)) {
    res.status(404).sendFile(notFoundPath);
  } else {
    res.status(404).json({ error: 'Not found.' });
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 ZEUS IOT UPGRADED BACKEND IS LIVE ON PORT ${PORT}`);
  console.log(`🔗 Local server: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
