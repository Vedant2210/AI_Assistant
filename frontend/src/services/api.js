import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5001/api' });

// export const uploadDocument = (formData, onProgress) =>
//   api.post('/document/upload', formData, {
//     // headers: { 'Content-Type': 'multipart/form-data' },
//     onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
//   });

export const uploadDocument = (formData, onProgress) =>
  api.post('/document/upload', formData, {
    onUploadProgress: (e) => {
      console.log("Loaded:", e.loaded);
      console.log("Total:", e.total);

      const percent = Math.round((e.loaded * 100) / e.total);

      console.log("Progress:", percent + "%");

      onProgress && onProgress(percent);
    },
  });
  
export const sendChat = (documentId, question) =>
  api.post('/chat', { documentId, question });

export const generateQuiz = (documentId) =>
  api.post('/quiz/generate', { documentId });

export const getQuiz = (docId) =>
  api.get(`/quiz/${docId}`);
