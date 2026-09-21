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
  Zap,
  HardDrive,
  KeyRound,
  MailCheck,
  Flame,
  Layers,
  Check
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
        setEmailStatus('Link successfully dispatched to inbox!');
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
      backgroundColor: '#070b14',
      backgroundImage: `
        radial-gradient(at 10% 10%, rgba(14, 165, 233, 0.15) 0px, transparent 40%),
        radial-gradient(at 90% 90%, rgba(99, 102, 241, 0.16) 0px, transparent 45%),
        radial-gradient(at 50% 50%, rgba(15, 23, 42, 0.6) 0px, transparent 80%)
      `,
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>

      {/* Ambient Grid Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Top Application Navbar */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(7, 11, 20, 0.75)',
        backdropFilter: 'blur(16px)',
        padding: '16px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)'
          }}>
            <Zap size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Swift<span style={{ color: '#38bdf8' }}>Share</span>
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              P2P Ephemeral Protocol
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#4ade80'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
            Relay Operational
          </div>
          <div style={{
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '12px',
            color: '#94a3b8'
          }}>
            v1.4 Enterprise
          </div>
        </div>
      </header>

      {/* Main Wide Body Section */}
      <main style={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '40px 24px',
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: '48px',
        alignItems: 'center'
      }}>

        {/* LEFT COLUMN: Visual Graphics & Technical Pillars */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(14, 165, 233, 0.1)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '14px'
            }}>
              <Sparkles size={13} />
              Zero Footprint • Instant Invalidation
            </div>
            <h1 style={{
              fontSize: '44px',
              fontWeight: '800',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: '0 0 16px 0',
              background: 'linear-gradient(135deg, #ffffff 40%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Ultra-Secure Ephemeral File Dispatch.
            </h1>
            <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Distribute confidential datasets, keys, and payloads via single-use, auto-purging URLs backed by direct automated SMTP inbox delivery.
            </p>
          </div>

          {/* Interactive Protocol Diagram Graphic */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <HardDrive size={22} color="#38bdf8" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#e2e8f0' }}>Client Encrypt</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Client-side stream</div>
            </div>

            <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(14, 165, 233, 0.06)', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
              <Flame size={22} color="#f59e0b" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b' }}>Self-Destruct</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Purged on access</div>
            </div>

            <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <MailCheck size={22} color="#a855f7" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#e2e8f0' }}>Inbox Relay</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Brevo SMTP link</div>
            </div>
          </div>

          {/* Technical Specs List */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              padding: '14px',
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px'
            }}>
              <ShieldCheck size={20} color="#0ea5e9" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>SHA-256 + Bcrypt</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Zero plain-text password retention</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              padding: '14px',
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px'
            }}>
              <Layers size={20} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>Atomic Purge</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Instant FS unlinking upon fetch</div>
              </div>
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: The Interactive Console (Upload & Result) */}
        <section>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '36px 32px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(14, 165, 233, 0.1)',
            position: 'relative'
          }}>

            {/* Glowing Accent Top Bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '10%',
              right: '10%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent)'
            }} />

            {shareableLink ? (
              /* ================= SUCCESS STATE ================= */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div style={{
                  textAlign: 'center',
                  padding: '24px 16px',
                  borderRadius: '16px',
                  background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.02) 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.25)'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
                  }}>
                    <CheckCircle2 size={34} color="#22c55e" />
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0' }}>
                    Payload Staged & Encrypted
                  </h2>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                    Link is live. It will be completely purged after the first download or expiration.
                  </p>
                </div>

                {/* Direct Link Copy Card */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#cbd5e1', marginBottom: '8px', display: 'block' }}>
                    Single-Use Direct URL
                  </label>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    background: '#070b14',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
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
                        color: '#38bdf8',
                        outline: 'none',
                        fontSize: '13px',
                        fontFamily: 'monospace'
                      }}
                    />
                    <button
                      onClick={copyToClipboard}
                      style={{
                        background: copied ? '#22c55e' : '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: '700',
                        fontSize: '13px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)'
                      }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Brevo Automated Delivery Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '18px'
                }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#cbd5e1', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Send size={14} color="#818cf8" />
                    <span>Direct In-App Delivery via Email</span>
                  </label>

                  <form onSubmit={handleSendDirectEmail} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="email"
                        placeholder="recipient@company.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        required
                        style={{
                          flex: 1,
                          padding: '11px 14px',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          background: '#070b14',
                          color: '#ffffff',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="submit"
                        disabled={emailSending}
                        style={{
                          padding: '11px 20px',
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          fontWeight: '700',
                          fontSize: '13px',
                          cursor: emailSending ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
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
                        fontWeight: '600',
                        color: emailStatus.includes('successfully') ? '#4ade80' : '#f87171',
                        margin: '2px 0 0 2px'
                      }}>
                        {emailStatus}
                      </p>
                    )}
                  </form>
                </div>

                {/* Reset Action */}
                <button
                  onClick={resetForm}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#94a3b8',
                    padding: '12px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
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
              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Drag and Drop Zone */}
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: isDragging ? '2px dashed #38bdf8' : '2px dashed rgba(255, 255, 255, 0.18)',
                    borderRadius: '18px',
                    padding: '36px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragging ? 'rgba(56, 189, 248, 0.08)' : 'rgba(7, 11, 20, 0.5)',
                    transition: 'all 0.2s ease',
                    display: 'block'
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: isDragging ? 'rgba(56, 189, 248, 0.2)' : 'rgba(56, 189, 248, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px auto',
                    boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)'
                  }}>
                    {file ? <FileText size={28} color="#38bdf8" /> : <UploadCloud size={28} color="#38bdf8" />}
                  </div>

                  {file ? (
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px 0' }}>
                        {file.name}
                      </p>
                      <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for staging
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', margin: '0 0 6px 0' }}>
                        Drop payload here, or <span style={{ color: '#38bdf8' }}>browse</span>
                      </p>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                        All file formats supported • Automatic memory streaming
                      </p>
                    </div>
                  )}
                  <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>

                {/* Expiry Selector */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Clock size={14} color="#38bdf8" />
                    <span>Self-Destruct Lifetime</span>
                  </label>
                  <select
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: '#070b14',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#f8fafc',
                      fontSize: '13px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="1">1 Hour (High Security / Sensitive)</option>
                    <option value="6">6 Hours</option>
                    <option value="24">24 Hours (Standard)</option>
                    <option value="168">7 Days (Extended)</option>
                  </select>
                </div>

                {/* Optional Password Box */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <KeyRound size={14} color="#38bdf8" />
                    <span>Payload Passphrase (Optional)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Require recipient to unlock with password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: '#070b14',
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
                    padding: '10px 14px',
                    color: '#fca5a5',
                    fontSize: '13px'
                  }}>
                    {error}
                  </div>
                )}

                {/* Primary Upload Button */}
                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    marginTop: '4px',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '14px',
                    border: 'none',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 20px rgba(2, 132, 199, 0.4)',
                    opacity: uploading ? 0.75 : 1
                  }}
                >
                  {uploading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Encrypting & Staging Link...</span>
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

          </div>
        </section>

      </main>

      {/* Full-Width Security Trust Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(7, 11, 20, 0.8)',
        backdropFilter: 'blur(12px)',
        padding: '16px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Protocol: <strong>TLS 1.3 / Brevo SMTP</strong></span>
          <span>Storage: <strong>Ephemeral In-Memory / Unlink-on-Fetch</strong></span>
        </div>
        <div>
          SwiftShare Core Engine • 2026
        </div>
      </footer>

    </div>
  );
}