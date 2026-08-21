import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DownloadCloud, Lock, FileText, AlertCircle } from 'lucide-react';

export default function DownloadPage() {
  const { fileId } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/files/${fileId}`)
      .then(res => {
        setFileInfo(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'File not found or expired.');
        setLoading(false);
      });
  }, [fileId]);

  const handleDownload = async (e) => {
    e.preventDefault();
    setDownloading(true);
    setError('');

    try {
      const response = await axios.post(
        `http://localhost:5000/api/files/download/${fileId}`,
        { password },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileInfo.originalName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to download. Invalid password or link expired.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <p>Loading file details...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#1e293b', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px', color: '#38bdf8' }}>SwiftShare Download</h1>

        {error ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#fca5a5', fontSize: '14px' }}>{error}</p>
          </div>
        ) : (
          <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
              <FileText size={32} color="#38bdf8" />
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {fileInfo?.originalName}
                </p>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {(fileInfo?.fileSize / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>

            {fileInfo?.isPasswordProtected && (
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Lock size={14} /> Enter Password to Decrypt
                </label>
                <input 
                  type="password" 
                  required
                  placeholder="Secret password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', boxSizing: 'border-box' }}
                />
              </div>
            )}

            <button 
              type="submit" 
              disabled={downloading} 
              style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', cursor: downloading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <DownloadCloud size={18} /> {downloading ? 'Downloading...' : 'Download File'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}