/* eslint-disable react/prop-types */
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../lib/Firebase';

function ClassQuizzes({ classId, isClassCreator }) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', choices: ['', '', '', ''], correctAnswer: '' }]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);

  // Fetch quizzes from Firebase
  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizSnapshot = await getDocs(collection(db, 'Classes', classId, 'quizzes'));
      const quizList = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(quizList);
    };
    fetchQuizzes();
  }, [classId]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', choices: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleChangeQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleCreateQuiz = async () => {
    try {
      await addDoc(collection(db, 'Classes', classId, 'quizzes'), {
        title,
        questions,
        createdAt: new Date(),
      });
      setTitle('');
      setQuestions([{ questionText: '', choices: ['', '', '', ''], correctAnswer: '' }]);
      alert('Quiz created successfully');
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const handleSelectAnswer = (answer) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: answer });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    selectedQuiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
  };

  return (
    <div className="p-4">
      {/* Quiz creation interface for teachers */}
      {isClassCreator ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">Create a Quiz</h3>
          <input
            className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {questions.map((question, index) => (
            <div key={index} className="mb-6">
              <input
                className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                type="text"
                placeholder="Question Text"
                value={question.questionText}
                onChange={(e) => handleChangeQuestion(index, 'questionText', e.target.value)}
              />
              {question.choices.map((choice, choiceIndex) => (
                <input
                  key={choiceIndex}
                  className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                  type="text"
                  placeholder={`Choice ${choiceIndex + 1}`}
                  value={choice}
                  onChange={(e) => {
                    const updatedChoices = [...questions[index].choices];
                    updatedChoices[choiceIndex] = e.target.value;
                    handleChangeQuestion(index, 'choices', updatedChoices);
                  }}
                />
              ))}
              <input
                className="border border-gray-300 rounded-md p-2 mb-4 w-full"
                type="text"
                placeholder="Correct Answer"
                value={question.correctAnswer}
                onChange={(e) => handleChangeQuestion(index, 'correctAnswer', e.target.value)}
              />
            </div>
          ))}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            onClick={handleAddQuestion}
          >
            Add Another Question
          </button>
          <button
            className="ml-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
            onClick={handleCreateQuiz}
          >
            Create Quiz
          </button>
        </div>
      ) : (
        <div>
          {/* Display available quizzes */}
          <h3 className="text-2xl font-bold mb-4">Available Quizzes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <button
                key={quiz.id}
                className="border border-blue-500 hover:border-blue-600 text-blue-500 font-bold py-2 px-4 rounded-md shadow-md"
                onClick={() => {
                  setSelectedQuiz(quiz);
                  setCurrentQuestionIndex(0);
                  setScore(null);  // Reset score for new quiz
                }}
              >
                {quiz.title}
              </button>
            ))}
          </div>

          {/* Quiz-taking flow */}
          {selectedQuiz && (
            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
              <h3 className="text-xl font-bold mb-4">{selectedQuiz.title}</h3>

              {/* Display one question at a time */}
              <div className="mb-4">
                <p className="font-semibold mb-2">
                  Question {currentQuestionIndex + 1}/{selectedQuiz.questions.length}
                </p>
                <p className="mb-4">{selectedQuiz.questions[currentQuestionIndex].questionText}</p>
                <div className="flex gap-2">
                  {selectedQuiz.questions[currentQuestionIndex].choices.map((choice) => (
                    <button
                      key={choice}
                      className={`py-1 px-3 rounded-md ${selectedAnswers[currentQuestionIndex] === choice ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
                      onClick={() => handleSelectAnswer(choice)}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-4">
                <button
                  className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-md ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentQuestionIndex === 0}
                  onClick={handlePreviousQuestion}
                >
                  Previous
                </button>

                {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
                  <button
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md"
                    onClick={handleNextQuestion}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-md"
                    onClick={handleSubmitQuiz}
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Show score after quiz submission */}
          {score !== null && (
            <div className="bg-yellow-200 rounded-lg p-6 mt-6 text-center">
              <p className="text-2xl font-bold">Your Score: {score}/{selectedQuiz.questions.length}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClassQuizzes;
