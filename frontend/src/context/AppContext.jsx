import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [documentId, setDocumentId] = useState(null);
  const [filename, setFilename] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [quizData, setQuizData] = useState(null);   // { quizId, questions }
  const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: selectedOption }

  return (
    <AppContext.Provider value={{
      documentId, setDocumentId,
      filename, setFilename,
      pageCount, setPageCount,
      quizData, setQuizData,
      userAnswers, setUserAnswers,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
