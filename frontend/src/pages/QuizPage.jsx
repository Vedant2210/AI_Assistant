import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { generateQuiz } from '../services/api';
import Loader from '../components/Loader';
import './QuizPage.css';

export default function QuizPage() {
  const { documentId, filename, quizData, setQuizData, setUserAnswers } = useApp();
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  useEffect(() => { if (!documentId) navigate('/'); }, [documentId, navigate]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const { data } = await generateQuiz(documentId);
      setQuizData(data);
      setAnswers({});
      setCurrent(0);
      setSelected(null);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to generate quiz. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelect = (opt) => { if (selected !== null) return; setSelected(opt); };

  const handleNext = () => {
    const updated = { ...answers, [current]: selected };
    setAnswers(updated);
    setSelected(null);
    if (current + 1 < quizData.questions.length) {
      setCurrent(current + 1);
    } else {
      setUserAnswers(updated);
      navigate('/results');
    }
  };

  const q = quizData?.questions?.[current];
  const total = quizData?.questions?.length || 0;
  const progress = total > 0 ? ((current) / total) * 100 : 0;

  /* --- Generate screen --- */
  if (!quizData) {
    return (
      <div className="page quiz-page">
        <motion.div className="quiz-generate-card glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="quiz-gen-icon">🧠</div>
          <h2>Ready to be tested?</h2>
          <p>We'll generate <strong>10 MCQs</strong> from <em>{filename}</em> using Mistral AI.</p>
          <p className="quiz-gen-note">⏳ This may take 30–60 seconds — the model is reading your PDF!</p>
          {error && <p className="quiz-error">❌ {error}</p>}
          {generating ? (
            <Loader text="Generating your quiz with Mistral AI..." />
          ) : (
            <button id="generate-quiz-btn" className="btn-primary quiz-gen-btn" onClick={handleGenerate}>
              ✨ Generate Quiz
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  /* --- Question screen --- */
  return (
    <div className="page quiz-page">
      {/* Progress */}
      <div className="quiz-progress-wrap">
        <span className="quiz-progress-label">Question {current + 1} of {total}</span>
        <div className="quiz-progress-bar">
          <motion.div
            className="quiz-progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="quiz-card glass"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <p className="quiz-q-num">Q{current + 1}</p>
          <h2 className="quiz-question">{q.question}</h2>

          <div className="quiz-options">
            {q.options.map((opt, i) => {
              let cls = 'option-btn';
              if (selected !== null) {
                if (opt === q.answer) cls += ' correct';
                else if (opt === selected) cls += ' wrong';
                else cls += ' dimmed';
              }
              if (opt === selected && selected === null) cls += ' selected';
              return (
                <button
                  key={i}
                  id={`option-${i}`}
                  className={cls}
                  onClick={() => handleSelect(opt)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <motion.div
              className={`answer-feedback ${selected === q.answer ? 'feedback-correct' : 'feedback-wrong'}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              {selected === q.answer ? '✅ Correct!' : `❌ Wrong! Answer: ${q.answer}`}
            </motion.div>
          )}

          {selected !== null && (
            <motion.button
              id="next-btn"
              className="btn-primary next-btn"
              onClick={handleNext}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              {current + 1 === total ? '🏁 See Results' : 'Next →'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
