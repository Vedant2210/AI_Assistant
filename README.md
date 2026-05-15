# 📚 AI Assistant: Smart PDF Study Companion

AI Assistant is a powerful MERN-stack web application designed to revolutionize the way students and professionals interact with documents. By leveraging Artificial Intelligence and Retrieval-Augmented Generation (RAG), this tool allows users to upload PDFs and "talk" to their documents, generating insights and quizzes instantly.

---

## 🚀 Key Features

- **📂 PDF Upload & Processing:** Seamlessly upload PDF documents and extract text for analysis.
- **💬 AI-Powered Chat:** Ask complex questions about your documents and get precise, context-aware answers using RAG technology.
- **📝 Automated Quiz Generation:** Instantly generate multiple-choice quizzes based on the content of your PDF to test your knowledge.
- **🎯 Intelligent Chunking:** Advanced text processing that ensures the AI understands the context of your specific document.
- **🎨 Modern UI:** A sleek, responsive, and user-friendly interface built with React and custom CSS.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js** (Hooks, Context API)
- **Vite** (Build Tool)
- **CSS3** (Custom styling with modern aesthetics)
- **Axios** (API Requests)

### **Backend**
- **Node.js** & **Express.js**
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **Hugging Face API** (AI/LLM integration)
- **Multer** (File Handling)

---

## 📦 Project Structure

```text
├── backend/            # Express server, routes, controllers, models
├── frontend/           # React application (Vite)
├── .gitignore          # Root gitignore for dependencies/secrets
└── README.md           # Project documentation
```

---

## ⚙️ Installation & Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/Vedant2210/AI_Assistant.git
cd AI_Assistant
```

### **2. Backend Setup**
- Navigate to the backend folder:
  ```bash
  cd backend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Create a `.env` file and add your credentials:
  ```env
  PORT=5001
  MONGO_URI=your_mongodb_connection_string
  HF_API_TOKEN=your_hugging_face_token
  ```
- Start the backend server:
  ```bash
  npm run dev
  ```

### **3. Frontend Setup**
- Navigate to the frontend folder:
  ```bash
  cd ../frontend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start the frontend development server:
  ```bash
  npm run dev
  ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Vedant2210/AI_Assistant/issues).

---

Developed with ❤️ by [Vedant](https://github.com/Vedant2210)
