import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import './ResultsPage.css';

export default function ResultsPage() {
  const { quizData, userAnswers, setQuizData, setUserAnswers, documentId } = useApp();
  const navigate = useNavigate();

  useEffect(() => { if (!quizData || !documentId) navigate('/'); }, [quizData, documentId, navigate]);

  if (!quizData) return null;

  const questions = quizData.questions;
  const correct = questions.filter((q, i) => userAnswers[i] === q.answer).length;
  const total = questions.length;
  const pct = Math.round((correct / total) * 100);

  const getGrade = () => {
    if (pct >= 90) return { emoji: '🏆', label: 'Excellent!', color: '#10b981' };
    if (pct >= 70) return { emoji: '🎉', label: 'Great Job!', color: '#a78bfa' };
    if (pct >= 50) return { emoji: '📚', label: 'Keep Studying!', color: '#fbbf24' };
    return { emoji: '💪', label: 'Keep Practicing!', color: '#ef4444' };
  };
  const grade = getGrade();

  const retake = () => { setQuizData(null); setUserAnswers({}); navigate('/quiz'); };

  return (
    <div className="page results-page">
      {/* Score card */}
      <motion.div className="score-card glass" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="score-emoji">{grade.emoji}</div>
        <h1 className="score-label" style={{ color: grade.color }}>{grade.label}</h1>
        <div className="score-ring">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" strokeWidth="8" fill="none" stroke="rgba(255,255,255,0.06)" />
            <motion.circle
              cx="50" cy="50" r="42" strokeWidth="8" fill="none"
              stroke={grade.color}
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
              style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
              initial={{ strokeDashoffset: `${2 * Math.PI * 42}` }}
              animate={{ strokeDashoffset: `${2 * Math.PI * 42 * (1 - pct / 100)}` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="score-text">
            <span className="score-pct">{pct}%</span>
            <span className="score-fraction">{correct}/{total}</span>
          </div>
        </div>
        <div className="score-actions">
          <button id="retake-btn" className="btn-primary" onClick={retake}>🔄 Retake Quiz</button>
          <button className="btn-ghost" onClick={() => navigate('/study')}>💬 Back to Study</button>
        </div>
      </motion.div>

      {/* Question review */}
      <div className="review-section">
        <h2 className="review-title">📋 Answer Review</h2>
        {questions.map((q, i) => {
          const userAns = userAnswers[i];
          const isCorrect = userAns === q.answer;
          return (
            <motion.div
              key={i}
              className={`review-card glass ${isCorrect ? 'review-correct' : 'review-wrong'}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="review-header">
                <span className="review-num">Q{i + 1}</span>
                <span className="review-status">{isCorrect ? '✅ Correct' : '❌ Incorrect'}</span>
              </div>
              <p className="review-question">{q.question}</p>
              {!isCorrect && (
                <div className="review-answers">
                  <p className="your-ans">Your answer: <span>{userAns || 'Not answered'}</span></p>
                  <p className="correct-ans">Correct answer: <span>{q.answer}</span></p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
