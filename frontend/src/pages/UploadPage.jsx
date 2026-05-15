import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { uploadDocument } from '../services/api';
import './UploadPage.css';

export default function UploadPage() {
  const { setDocumentId, setFilename, setPageCount, setQuizData, setUserAnswers } = useApp();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle | uploading | done | error
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setSelectedFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      const { data } = await uploadDocument(formData, setProgress);

      setDocumentId(data.documentId);
      setFilename(data.filename);
      setPageCount(data.pageCount);
      setQuizData(null);
      setUserAnswers({});
      setStatus('done');
      setTimeout(() => navigate('/study'), 800);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Upload failed. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="page upload-page">
      {/* Hero */}
      <motion.div
        className="upload-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-badge">✨ Powered by Mistral-7B</div>
        <h1>
          Study Smarter with <span className="gradient-text">AI</span>
        </h1>
        <p className="hero-sub">
          Upload any PDF, DOCX, or PPTX — then chat with it and take an auto-generated quiz to test your knowledge.
        </p>
      </motion.div>

      {/* Dropzone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div
          {...getRootProps()}
          className={`dropzone glass ${isDragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
        >
          <input {...getInputProps()} id="pdf-upload-input" />
          <div className="dropzone-icon">{selectedFile ? '📄' : '☁️'}</div>
          {selectedFile ? (
            <>
              <p className="dropzone-filename">{selectedFile.name}</p>
              <p className="dropzone-hint">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Click to change
              </p>
            </>
          ) : (
            <>
              <p className="dropzone-title">
                {isDragActive ? 'Drop your file here!' : 'Drag & drop your document'}
              </p>
              <p className="dropzone-hint">PDF, DOCX, or PPTX · Max 10 MB</p>
            </>
          )}
        </div>

        {/* Upload button */}
        <AnimatePresence>
          {selectedFile && status !== 'done' && (
            <motion.div
              className="upload-actions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {status === 'uploading' ? (
                <div className="progress-wrap">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="progress-label">Uploading & extracting text... {progress}%</span>
                </div>
              ) : (
                <button
                  id="upload-btn"
                  className="btn-primary upload-btn"
                  onClick={handleUpload}
                >
                  🚀 Upload & Start Studying
                </button>
              )}
              {status === 'error' && (
                <p className="upload-error">❌ {errorMsg}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        className="features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[
          { icon: '💬', title: 'Chat with Document', desc: 'Ask any question — get instant AI answers from your document.' },
          { icon: '🧠', title: 'Auto Quiz', desc: 'Generate 10 MCQs automatically from your content.' },
          { icon: '🏆', title: 'Track Score', desc: 'See your results with correct answers highlighted.' },
        ].map((f) => (
          <div key={f.title} className="feature-card glass">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
