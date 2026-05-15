import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { sendChat } from '../services/api';
import Loader from '../components/Loader';
import './StudyPage.css';

export default function StudyPage() {
  const { documentId, filename, pageCount } = useApp();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I've read **${filename || 'your document'}**. Ask me anything about it! 📖` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!documentId) navigate('/');
  }, [documentId, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    console.log('Sending chat request:', { documentId, question: q });
    setLoading(true);
    try {
      const { data } = await sendChat(documentId, q);
      setMessages((prev) => [...prev, { role: 'ai', text: data.answer }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [...prev, { role: 'ai', text: '❌ Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className="study-layout">
      {/* Sidebar */}
      <aside className="study-sidebar glass">
        <div className="sidebar-doc">
          <div className="sidebar-icon">📄</div>
          <div>
            <p className="sidebar-filename">{filename}</p>
            <p className="sidebar-meta">{pageCount} pages</p>
          </div>
        </div>
        <hr className="sidebar-divider" />
        <p className="sidebar-hint">💡 Try asking:</p>
        {['Summarize this document', 'What are the key concepts?', 'Explain the main topic'].map((s) => (
          <button key={s} className="suggestion-btn" onClick={() => { setInput(s); }}>
            {s}
          </button>
        ))}
        <button
          id="go-to-quiz-btn"
          className="btn-primary go-quiz-btn"
          onClick={() => navigate('/quiz')}
        >
          🧠 Take Quiz
        </button>
      </aside>

      {/* Chat */}
      <div className="chat-container">
        <div className="chat-header glass">
          <span>💬 Chat with your Document</span>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`bubble ${msg.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bubble-avatar">{msg.role === 'ai' ? '🤖' : '👤'}</div>
              <div className="bubble-text">
                {msg.text.split('\n').map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="bubble ai">
              <div className="bubble-avatar">🤖</div>
              <Loader text="Mistral is thinking..." />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-row glass">
          <textarea
            id="chat-input"
            className="chat-input"
            rows={1}
            placeholder="Ask anything about your document..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            id="send-btn"
            className="send-btn btn-primary"
            onClick={send}
            disabled={!input.trim() || loading}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
