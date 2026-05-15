const express = require('express');
const router = express.Router();
const { generateQuiz, getQuiz } = require('../controllers/quizController');

router.post('/generate', generateQuiz);
router.get('/:docId', getQuiz);

module.exports = router;
