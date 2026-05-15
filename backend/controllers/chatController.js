const Document = require('../models/Document');
const { askQuestion } = require('../utils/hfClient');
const { findRelevantChunks } = require('../utils/chunker');

const chat = async (req, res) => {
  try {
    const { documentId, question } = req.body;
    if (!documentId || !question)
      return res.status(400).json({ error: 'documentId and question are required' });

    const document = await Document.findById(documentId);
    if (!document) return res.status(404).json({ error: 'Document not found' });

    const relevantChunks = findRelevantChunks(document.chunks, question, 3);
    const context = relevantChunks.join('\n\n');

    const answer = await askQuestion(context, question);
    res.json({ answer });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Failed to get answer from AI' });
  }
};

module.exports = { chat };
