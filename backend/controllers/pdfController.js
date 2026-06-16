const fs = require('fs'); //Used to read and delete files.
const pdfParse = require('pdf-parse'); //Used to parse PDF files.
const officeParser = require('officeparser'); //Used to parse DOCX and PPTX files.
const Document = require('../models/Document'); //Used to store document data.
const { chunkText } = require('../utils/chunker'); //Used to chunk text.
const { generateEmbeddings } = require('../utils/hfClient');

const uploadDocument = async (req, res) => {
  console.log(req.file);
  console.log(req.file.path);
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    let extractedText = '';
    let pageCount = 0;
    const fileType = req.file.mimetype.split('/')[1].split('.').pop(); // Simple way to get type

    try {
      if (req.file.mimetype === 'application/pdf') {
        const buffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(buffer);
        extractedText = data.text;
        pageCount = data.numpages;
      } else {
        // Handle DOCX, PPTX using officeparser
        extractedText = await officeParser.parseOffice(req.file.path);
        // For Office docs, page count is hard to determine accurately without complex libs,
        // so we'll set it to 1 or estimate based on length if needed.
        // For now, let's keep it simple.
        pageCount = 1;
      }
    } catch (parseErr) {
      console.error('File parsing failed:', parseErr);
      return res.status(500).json({ error: `Failed to parse file content: ${parseErr.message}` });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'No text could be extracted from this document.' });
    }

    const chunks = chunkText(extractedText, 100);

    let chunkEmbeddings = [];
    try {
      // Small batches to prevent API limits if the document is very large
      const batchSize = 20;
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const embeddingsBatch = await generateEmbeddings(batch);
        chunkEmbeddings.push(...embeddingsBatch);
      }
    } catch (embErr) {
      console.error('Embedding generation failed:', embErr);
      return res.status(500).json({ error: `Failed to generate embeddings: ${embErr.message}` });
    }

    const document = new Document({
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype.includes('pdf') ? 'pdf' : (req.file.mimetype.includes('word') ? 'docx' : 'pptx'),
      extractedText,
      chunks,
      chunkEmbeddings,
      pageCount,
    });

    await document.save();
    fs.unlinkSync(req.file.path);//Delete uploaded file after processing.

    res.json({
      success: true,
      documentId: document._id,
      filename: document.originalName,
      fileType: document.fileType,
      pageCount: document.pageCount,
      chunkCount: chunks.length,
      extractedText: extractedText,
    });
  } catch (err) {
    console.error('Upload error details:', err);
    res.status(500).json({ error: `Failed to process document: ${err.message}` });
  }
};

module.exports = { uploadDocument };
