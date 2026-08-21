const mongoose = require('mongoose');

const fileTransferSchema = new mongoose.Schema({
  fileId: { type: String, required: true, unique: true },
  originalName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, default: 'application/octet-stream' },
  storagePath: { type: String, required: true },
  passwordHash: { type: String, default: null },
  downloadCount: { type: Number, default: 0 },
  maxDownloads: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('FileTransfer', fileTransferSchema);