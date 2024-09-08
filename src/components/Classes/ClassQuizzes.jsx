/* eslint-disable react/prop-types */
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/Firebase";

function ClassQuizzes({ classId, isClassCreator }) {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: "", questions: [], dueDate: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizzesRef = collection(db, "Classes", classId, "Quizzes");
        const querySnapshot = await getDocs(quizzesRef);
        const quizzesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuizzes(quizzesList);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [classId]);

  const handleAddQuiz = async () => {
    try {
      const quizzesRef = collection(db, "Classes", classId, "Quizzes");
      await addDoc(quizzesRef, newQuiz);
      setQuizzes([...quizzes, { ...newQuiz, id: Date.now().toString() }]);
      setNewQuiz({ title: "", questions: [], dueDate: "" });
    } catch (error) {
      console.error("Error adding quiz:", error);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await deleteDoc(doc(db, "Classes", classId, "Quizzes", quizId));
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleUpdateQuiz = async (quizId, updatedData) => {
    try {
      await updateDoc(doc(db, "Classes", classId, "Quizzes", quizId), updatedData);
      setQuizzes(quizzes.map(quiz => 
        quiz.id === quizId ? { ...quiz, ...updatedData } : quiz
      ));
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quizzes</h2>
      {loading && <div>Loading quizzes...</div>}
      {isClassCreator && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Create Quiz</h3>
          <input
            type="text"
            placeholder="Title"
            value={newQuiz.title}
            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Questions (JSON format)"
            value={JSON.stringify(newQuiz.questions)}
            onChange={(e) => setNewQuiz({ ...newQuiz, questions: JSON.parse(e.target.value) })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="date"
            value={newQuiz.dueDate}
            onChange={(e) => setNewQuiz({ ...newQuiz, dueDate: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={handleAddQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Quiz
          </button>
        </div>
      )}
      <ul>
        {quizzes.map(quiz => (
          <li key={quiz.id} className="border p-4 mb-2 rounded">
            <h3 className="text-lg font-semibold">{quiz.title}</h3>
            <p>Due Date: {quiz.dueDate}</p>
            <p>Questions: {JSON.stringify(quiz.questions)}</p>
            {isClassCreator && (
              <div>
                <button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleUpdateQuiz(quiz.id, { title: "Updated Title" })}
                  className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                >
                  Update
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassQuizzes;
