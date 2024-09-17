/* eslint-disable react/prop-types */
import { Box, Button, Card, CardActions, CardContent, CircularProgress, TextField, Typography } from '@mui/material';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { CustomUseContext } from '../../context/context';
import { db } from '../../lib/Firebase';

function ClassQuizzes({ classId, isClassCreator }) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', choices: ['', '', '', ''], correctAnswer: '' }]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [timer, setTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizDuration, setQuizDuration] = useState(0); // Duration in seconds
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState({});
  const { loggedInMail } = CustomUseContext();

  // Fetch quizzes and submissions from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch quizzes
        const quizSnapshot = await getDocs(collection(db, 'classes', classId, 'quizzes'));
        const quizList = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuizzes(quizList);

        // Fetch submissions
        const submissionsData = {};
        for (const quiz of quizList) {
          const submissionSnapshot = await getDocs(collection(db, 'classes', classId, 'quizzes', quiz.id, 'submissions'));
          submissionsData[quiz.id] = submissionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        setSubmissions(submissionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      if (!title || !quizDuration || questions.length === 0) {
        alert('Please complete all fields before creating a quiz.');
        return;
      }

      await addDoc(collection(db, 'classes', classId, 'quizzes'), {
        title,
        questions,
        createdAt: new Date(),
        duration: quizDuration, // Save quiz duration
        // Add createdBy field if necessary
        // createdBy: "teacher_id" // Replace with actual teacher ID
      });
      setTitle('');
      setQuestions([{ questionText: '', choices: ['', '', '', ''], correctAnswer: '' }]);
      setQuizDuration(0); // Reset duration
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

  const handleSubmitQuiz = async () => {
    let calculatedScore = 0;
    selectedQuiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    clearInterval(timer); // Clear timer on submit

    // Save submission
    try {
      await addDoc(collection(db, 'classes', classId, 'quizzes', selectedQuiz.id, 'submissions'), {
        studentId: loggedInMail, // Replace with actual student ID
        score: calculatedScore,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error saving submission:', error);
    }
  };

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setScore(null);
    setSelectedAnswers({});
    setTimeRemaining(quiz.duration); // Set timer duration
    const quizTimer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(quizTimer);
          handleSubmitQuiz(); // Submit quiz when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(quizTimer);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="p-4">
      {/* Quiz creation interface for teachers */}
      {isClassCreator ? (
        <Card className="mb-8">
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Create a Quiz
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Quiz Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Duration (in minutes)"
              type="number"
              variant="outlined"
              value={quizDuration / 60}
              onChange={(e) => setQuizDuration(e.target.value * 60)}
            />
            {questions.map((question, index) => (
              <div key={index} className="mb-6">
                <TextField
                  fullWidth
                  margin="normal"
                  label="Question Text"
                  variant="outlined"
                  value={question.questionText}
                  onChange={(e) => handleChangeQuestion(index, 'questionText', e.target.value)}
                />
                {question.choices.map((choice, choiceIndex) => (
                  <TextField
                    key={choiceIndex}
                    fullWidth
                    margin="normal"
                    label={`Choice ${choiceIndex + 1}`}
                    variant="outlined"
                    value={choice}
                    onChange={(e) => {
                      const updatedChoices = [...questions[index].choices];
                      updatedChoices[choiceIndex] = e.target.value;
                      handleChangeQuestion(index, 'choices', updatedChoices);
                    }}
                  />
                ))}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Correct Answer"
                  variant="outlined"
                  value={question.correctAnswer}
                  onChange={(e) => handleChangeQuestion(index, 'correctAnswer', e.target.value)}
                />
              </div>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddQuestion}
            >
              Add Another Question
            </Button>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginLeft: 8 }}
              onClick={handleCreateQuiz}
            >
              Create Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div>
          {/* Display available quizzes */}
          <Typography variant="h5" component="div" gutterBottom>
            Available Quizzes
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="shadow-md">
                <CardContent>
                  <Typography variant="h6" component="div">
                    {quiz.title}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => startQuiz(quiz)}
                  >
                    Start
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>

          {/* Quiz-taking flow */}
          {selectedQuiz && (
            <Card className="mt-6">
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {selectedQuiz.title}
                </Typography>

                {/* Timer */}
                <Typography variant="body1" color="error" gutterBottom>
                  Time Remaining: {formatTime(timeRemaining)}
                </Typography>

                {/* Display one question at a time */}
                <div className="mb-4">
                  <Typography variant="body1" gutterBottom>
                    Question {currentQuestionIndex + 1}/{selectedQuiz.questions.length}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedQuiz.questions[currentQuestionIndex].questionText}
                  </Typography>
                  <div className="flex gap-4">
                    {selectedQuiz.questions[currentQuestionIndex].choices.map((choice, index) => (
                      <Button
                        key={index}
                        variant="outlined"
                        onClick={() => handleSelectAnswer(choice)}
                      >
                        {choice}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Navigation and submit buttons */}
                <Box>
                  {currentQuestionIndex > 0 && (
                    <Button
                      variant="contained"
                      onClick={handlePreviousQuestion}
                    >
                      Previous
                    </Button>
                  )}
                  {currentQuestionIndex < selectedQuiz.questions.length - 1 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNextQuestion}
                      style={{ marginLeft: 8 }}
                    >
                      Next
                    </Button>
                  )}
                  {currentQuestionIndex === selectedQuiz.questions.length - 1 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleSubmitQuiz}
                      style={{ marginLeft: 8 }}
                    >
                      Submit
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Display score */}
          {score !== null && (
            <Card className="mt-6">
              <CardContent>
                <Typography variant="h6" component="div">
                  Your Score: {score} / {selectedQuiz.questions.length}
                </Typography>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Display quiz results for the class */}
      {isClassCreator && (
        <div className="mt-8">
          <Typography variant="h5" component="div" gutterBottom>
            Quiz Results
          </Typography>
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="mb-6">
              <CardContent>
                <Typography variant="h6" component="div">
                  {quiz.title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Submissions:
                </Typography>
                {submissions[quiz.id] && submissions[quiz.id].length > 0 ? (
                  submissions[quiz.id].map(submission => (
                    <Box key={submission.id} className="border p-2 mb-2">
                      <Typography variant="body2">
                        Student ID: {submission.studentId}
                      </Typography>
                      <Typography variant="body2">
                        Score: {submission.score}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No submissions yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClassQuizzes;
