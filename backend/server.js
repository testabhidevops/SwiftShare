const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const FileTransfer = require('./models/FileTransfer');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Route 1: Upload a file
app.post('/api/files/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please attach a file.' });
    }

    const { expiryHours = 24, password, maxDownloads } = req.body;
    const fileId = nanoid(8);
    const expiresAt = new Date(Date.now() + Number(expiryHours) * 60 * 60 * 1000);

    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    await FileTransfer.create({
      fileId,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      storagePath: req.file.filename,
      passwordHash,
      maxDownloads: maxDownloads ? Number(maxDownloads) : null,
      expiresAt
    });

    res.json({
      success: true,
      fileId,
     shareableLink: `${process.env.CLIENT_URL || 'https://swift-share-roan.vercel.app'}/download/${fileId}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route 2: Get file metadata before download
app.get('/api/files/:fileId', async (req, res) => {
  try {
    const file = await FileTransfer.findOne({ fileId: req.params.fileId });
    if (!file) return res.status(404).json({ error: 'File not found or expired.' });

    if (new Date() > file.expiresAt) {
      return res.status(410).json({ error: 'File link has expired.' });
    }

    if (file.maxDownloads && file.downloadCount >= file.maxDownloads) {
      return res.status(410).json({ error: 'Download limit reached.' });
    }

    res.json({
      originalName: file.originalName,
      fileSize: file.fileSize,
      isPasswordProtected: Boolean(file.passwordHash)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route 3: Download the file
app.post('/api/files/download/:fileId', async (req, res) => {
  try {
    const { password } = req.body;
    const file = await FileTransfer.findOne({ fileId: req.params.fileId });

    if (!file) return res.status(404).json({ error: 'File not found.' });

    if (file.passwordHash) {
      if (!password) return res.status(401).json({ error: 'Password required.' });
      const valid = await bcrypt.compare(password, file.passwordHash);
      if (!valid) return res.status(403).json({ error: 'Incorrect password.' });
    }

    const filePath = path.join(uploadsDir, file.storagePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File missing from server.' });
    }

    file.downloadCount += 1;
    await file.save();

    res.download(filePath, file.originalName);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Backend server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('MongoDB connection error:', err));