/**
 * Split text into chunks of approximately `wordsPerChunk` words.
 */
function chunkText(text, wordsPerChunk = 800) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(' '));
  }
  return chunks;
}

/**
 * Simple keyword-based chunk retrieval.
 * Returns the top `topK` chunks most relevant to the question.
 */
function findRelevantChunks(chunks, question, topK = 3) {
  const keywords = question
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const scored = chunks.map((chunk) => {
    const lower = chunk.toLowerCase();
    const score = keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}

module.exports = { chunkText, findRelevantChunks };
