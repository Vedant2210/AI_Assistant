const OpenAI = require('openai');
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const client = new OpenAI({
  apiKey: process.env.HF_API_TOKEN,
  baseURL: 'https://router.huggingface.co/v1',
});

const hf = new HfInference(process.env.HF_API_TOKEN);

async function askQuestion(context, question) {
  const response = await client.chat.completions.create({
    model: 'meta-llama/Llama-3.1-8B-Instruct',
    messages: [
      {
        role: 'user',
        content: `You are a helpful study assistant. Use the following context from a PDF document to answer the question clearly and concisely. If the answer is not in the context, say so.

Context:
${context}

Question: ${question}`,
      },
    ],
    max_tokens: 512,
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
}

async function generateMCQs(text, count = 3) {
  const response = await client.chat.completions.create({
    model: 'meta-llama/Llama-3.1-8B-Instruct',
    messages: [
      {
        role: 'user',
        content: `Generate exactly ${count} multiple choice questions from the text below.
Return ONLY a valid JSON array. Each object must have:
- "question": question string
- "options": array of exactly 4 answer choices
- "answer": the correct choice (must exactly match one of the options)

Text:
${text.substring(0, 1500)}

JSON array:`,
      },
    ],
    max_tokens: 800,
    temperature: 0.7,
  });

  const raw = response.choices[0].message.content.trim();
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('No JSON array found in HF response');
  return JSON.parse(match[0]);
}

async function generateEmbeddings(texts) {
  // Using feature extraction from the native sdk
  const result = await hf.featureExtraction({
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    inputs: texts,
  });
  return result;
}

module.exports = { askQuestion, generateMCQs, generateEmbeddings };
