const Document = require('../models/Document');
const Quiz = require('../models/Quiz');
const { generateMCQs } = require('../utils/hfClient');

const generateQuiz = async (req, res) => {
  try {
    const { documentId } = req.body;
    if (!documentId) return res.status(400).json({ error: 'documentId is required' });

    const document = await Document.findById(documentId);
    if (!document) return res.status(404).json({ error: 'Document not found' });

    // Return existing quiz if already generated
    const existing = await Quiz.findOne({ documentId });
    if (existing) return res.json({ quizId: existing._id, questions: existing.questions });

    // Generate MCQs from up to 4 chunks
    const allQuestions = [];
    const chunksToUse = document.chunks.slice(0, 5);

    for (const chunk of chunksToUse) {
      try {
        const qs = await generateMCQs(chunk, 3);
        allQuestions.push(...qs);
        if (allQuestions.length >= 10) break;
      } catch (e) {
        console.warn('Chunk MCQ generation failed, skipping:', e.message);
      }
    }

    if (allQuestions.length === 0)
      return res.status(500).json({ error: 'Could not generate quiz questions. Try a different PDF.' });

    const questions = allQuestions.slice(0, 10);
    const quiz = new Quiz({ documentId, questions });
    await quiz.save();

    res.json({ quizId: quiz._id, questions });
  } catch (err) {
    console.error('Quiz generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
};

const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ documentId: req.params.docId });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found for this document' });
    res.json({ quizId: quiz._id, questions: quiz.questions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve quiz' });
  }
};

module.exports = { generateQuiz, getQuiz };
