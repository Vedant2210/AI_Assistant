/**
 * Split text into chunks of approximately `wordsPerChunk` words.
 */
function chunkText(text, wordsPerChunk = 100) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(' '));
  }
  return chunks;
}

/**
 * Mathematical helper to calculate cosine similarity between two vectors.
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Vector-based semantic chunk retrieval.
 * Returns the top `topK` chunks most relevant to the question's embedding.
 */
function findRelevantChunksByEmbedding(chunks, chunkEmbeddings, questionEmbedding, topK = 3) {
  // If an old document has no embeddings, handle gracefully (could return empty or fallback, 
  // but as requested, we enforce vector search).
  if (!chunkEmbeddings || chunkEmbeddings.length === 0) {
    console.warn("No embeddings found for this document.");
    return [];
  }

  const scored = chunks.map((chunk, i) => {
    // If some chunks didn't get embeddings properly, assign 0 score
    const score = (chunkEmbeddings[i] && chunkEmbeddings[i].length > 0)
      ? cosineSimilarity(questionEmbedding, chunkEmbeddings[i]) 
      : 0;
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}

module.exports = { chunkText, findRelevantChunksByEmbedding };
