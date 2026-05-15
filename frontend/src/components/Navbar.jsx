import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { documentId, filename } = useApp();
  const loc = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">📚</span>
        <span className="gradient-text">StudyAI</span>
      </Link>

      {documentId && (
        <div className="navbar-doc">
          <span className="doc-icon">📄</span>
          <span className="doc-name">{filename}</span>
        </div>
      )}

      <div className="navbar-links">
        <Link to="/" className={`nav-link ${loc.pathname === '/' ? 'active' : ''}`}>Upload</Link>
        {documentId && (
          <>
            <Link to="/study" className={`nav-link ${loc.pathname === '/study' ? 'active' : ''}`}>Study</Link>
            <Link to="/quiz" className={`nav-link ${loc.pathname === '/quiz' ? 'active' : ''}`}>Quiz</Link>
          </>
        )}
      </div>
    </nav>
  );
}
