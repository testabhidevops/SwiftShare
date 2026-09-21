import React, { useState } from 'react';
import axios from 'axios';
import { 
  UploadCloud, 
  Lock, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Send, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  RefreshCw,
  Zap
} from 'lucide-react';

export default function App() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [expiryHours, setExpiryHours] = useState('24');
  const [maxDownloads, setMaxDownloads] = useState('');
  const [uploading, setUploading] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop a file to transfer.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('expiryHours', expiryHours);
    if (password) formData.append('password', password);
    if (maxDownloads) formData.append('maxDownloads', maxDownloads);

    try {
      const response = await axios.post('https://swiftshare-backend-ouxx.onrender.com/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShareableLink(response.data.shareableLink);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSendDirectEmail = async (e) => {
    e.preventDefault();
    if (!recipientEmail) return;

    setEmailSending(true);
    setEmailStatus('');

    try {
      const res = await axios.post('https://swiftshare-backend-ouxx.onrender.com/api/files/send-email', {
        recipientEmail,
        shareableLink,
      });
      if (res.data.success) {
        setEmailStatus('Email sent successfully!');
        setRecipientEmail('');
      }
    } catch (err) {
      setEmailStatus(err.response?.data?.error || 'Failed to deliver email. Check server configuration.');
    } finally {
      setEmailSending(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setShareableLink('');
    setFile(null);
    setPassword('');
    setError('');
    setEmailStatus('');
    setRecipientEmail('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090d16',
      backgroundImage: `
        radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.12) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(14, 165, 233, 0.05) 0px, transparent 50%)
      `,
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Decorative Blur Spheres */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '20%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Main Glassmorphic Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '520px',
        backgroundColor: 'rgba(17, 24, 39, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '36px 32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.05)'
      }}>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '9999px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: '#38bdf8',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            <Sparkles size={13} />
            <span>Encrypted • Single-Use • Ephemeral</span>
          </div>

          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            margin: '0 0 6px 0',
            background: 'linear-gradient(135deg, #ffffff 30%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            SwiftShare
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
            Send sensitive files with auto-destruction and zero trace
          </p>
        </div>

        {shareableLink ? (
          /* ================= SUCCESS / SEND STATE ================= */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              textAlign: 'center',
              padding: '24px 16px',
              borderRadius: '16px',
              background: 'rgba(34, 197, 94, 0.05)',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <CheckCircle2 size={32} color="#22c55e" />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px 0' }}>
                Secure Link Generated
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                This file is locked and will self-destruct once downloaded or expired.
              </p>
            </div>

            {/* Shareable Link Box */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px', display: 'block' }}>
                Direct Download URL
              </label>
              <div style={{
                display: 'flex',
                gap: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '6px 6px 6px 14px',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  readOnly
                  value={shareableLink}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: '#e2e8f0',
                    outline: 'none',
                    fontSize: '13px',
                    fontFamily: 'monospace'
                  }}
                />
                <button
                  onClick={copyToClipboard}
                  style={{
                    background: copied ? '#22c55e' : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600',
                    fontSize: '13px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                  }}
                >
                  <Copy size={14} />
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Email Dispatch Form */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '16px'
            }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send size={13} color="#818cf8" />
                <span>Deliver Directly to Recipient's Inbox</span>
              </label>

              <form onSubmit={handleSendDirectEmail} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      background: 'rgba(15, 23, 42, 0.9)',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={emailSending}
                    style={{
                      padding: '11px 18px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: emailSending ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                      opacity: emailSending ? 0.7 : 1
                    }}
                  >
                    {emailSending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                    <span>{emailSending ? 'Sending...' : 'Send'}</span>
                  </button>
                </div>

                {emailStatus && (
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: emailStatus.includes('successfully') ? '#4ade80' : '#f87171',
                    margin: '2px 0 0 2px'
                  }}>
                    {emailStatus}
                  </p>
                )}
              </form>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetForm}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '4px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#94a3b8',
                padding: '11px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.2s ease'
              }}
            >
              <RefreshCw size={14} />
              <span>Send Another File</span>
            </button>
          </div>
        ) : (
          /* ================= UPLOAD STATE ================= */
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Interactive Dropzone */}
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: isDragging ? '2px dashed #38bdf8' : '2px dashed rgba(255, 255, 255, 0.18)',
                borderRadius: '18px',
                padding: '32px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragging ? 'rgba(56, 189, 248, 0.08)' : 'rgba(15, 23, 42, 0.5)',
                transition: 'all 0.2s ease',
                display: 'block'
              }}
            >
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                background: isDragging ? 'rgba(56, 189, 248, 0.2)' : 'rgba(56, 189, 248, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                {file ? <FileText size={26} color="#38bdf8" /> : <UploadCloud size={26} color="#38bdf8" />}
              </div>

              {file ? (
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc', margin: '0 0 4px 0' }}>
                    {file.name}
                  </p>
                  <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '500' }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to transfer
                  </span>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0', margin: '0 0 4px 0' }}>
                    Drop file here or <span style={{ color: '#38bdf8' }}>browse</span>
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                    Support for documents, images, videos & archives
                  </p>
                </div>
              )}
              <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>

            {/* Expiry Options */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Clock size={14} color="#38bdf8" />
                <span>Link Expiration Window</span>
              </label>
              <select
                value={expiryHours}
                onChange={(e) => setExpiryHours(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#f8fafc',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="1">1 Hour (Ultra-Secure)</option>
                <option value="6">6 Hours</option>
                <option value="24">24 Hours (Standard)</option>
                <option value="168">7 Days</option>
              </select>
            </div>

            {/* Optional Password Protection */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Lock size={14} color="#38bdf8" />
                <span>End-to-End Password (Optional)</span>
              </label>
              <input
                type="password"
                placeholder="Leave blank for open link"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#f8fafc',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fca5a5',
                fontSize: '13px'
              }}>
                {error}
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={uploading}
              style={{
                marginTop: '6px',
                padding: '13px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '14px',
                border: 'none',
                cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(2, 132, 199, 0.4)',
                opacity: uploading ? 0.75 : 1
              }}
            >
              {uploading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Encrypting & Generating Link...</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>Generate Transfer Link</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Trust Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          marginTop: '26px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#64748b' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Encrypted in Transit</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#64748b' }}>
            <Zap size={14} color="#f59e0b" />
            <span>Single-Use Auto Expire</span>
          </div>
        </div>

      </div>
    </div>
  );
}