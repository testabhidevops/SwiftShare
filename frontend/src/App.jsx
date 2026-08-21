import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Lock, Clock, CheckCircle2, Copy } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [expiryHours, setExpiryHours] = useState('24');
  const [maxDownloads, setMaxDownloads] = useState('');
  const [uploading, setUploading] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to transfer.');
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
      const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShareableLink(response.data.shareableLink);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#1e293b', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px', color: '#38bdf8' }}>SwiftShare</h1>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Secure, expiring peer-to-peer file delivery</p>

        {shareableLink ? (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle2 size={48} color="#22c55e" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>File Ready to Share!</h2>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', background: '#0f172a', padding: '8px', borderRadius: '8px', alignItems: 'center' }}>
              <input 
                type="text" 
                readOnly 
                value={shareableLink} 
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#e2e8f0', outline: 'none', fontSize: '13px' }}
              />
              <button onClick={copyToClipboard} style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                <Copy size={14} /> {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <button onClick={() => { setShareableLink(''); setFile(null); }} style={{ marginTop: '20px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>
              Send Another File
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ border: '2px dashed #475569', borderRadius: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#0f172a' }}>
              <UploadCloud size={36} color="#38bdf8" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: '14px', color: '#cbd5e1' }}>{file ? file.name : 'Click to select or drop a file'}</p>
              {file && <span style={{ fontSize: '12px', color: '#64748b' }}>({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>}
              <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Clock size={14} /> Expiry Duration
              </label>
              <select value={expiryHours} onChange={(e) => setExpiryHours(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}>
                <option value="1">1 Hour</option>
                <option value="6">6 Hours</option>
                <option value="24">24 Hours (1 Day)</option>
                <option value="168">7 Days</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Lock size={14} /> Password Protection (Optional)
              </label>
              <input 
                type="password" 
                placeholder="Enter a secret password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', boxSizing: 'border-box' }}
              />
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>}

            <button 
              type="submit" 
              disabled={uploading} 
              style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer', marginTop: '8px' }}
            >
              {uploading ? 'Encrypting & Uploading...' : 'Generate Transfer Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}