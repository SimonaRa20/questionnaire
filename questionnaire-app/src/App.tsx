import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Button } from '@mui/material';

export default function App() {

  interface Question {
    category: string,
    type: string,
    difficulty: string,
    question: string,
    correct_answer: string,
    incorrect_answers: string[]
  }

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10')
      .then((response) => response.json())
      .then((data) => {
        const formattedQuestions: Question[] = data.results.map((result: any) => ({
          category: result.category,
          type: result.type,
          difficulty: result.difficulty,
          question: result.question,
          correct_answer: result.correct_answer,
          incorrect_answers: result.incorrect_answers,
        }));
        setQuestions(formattedQuestions);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleAnswerOptionClick = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      setGameOver(true);
    }
  };

  return (
    <Container sx={{ margin: 4, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{
        width: "500px", height: "300px",
        border: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Box sx={{ margin: 4 }}>
          {showScore ? (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Box mb={4}>
                <div className='score-section'>
                  Congratulations, you answered {score}/{questions.length} questions correctly.
                </div>
              </Box>
            </Box>
          ) : (
            <Box
            >
              <Box textAlign="center" mb={4}>
                <div className='question-text'>{questions[currentQuestion]?.question}</div>
              </Box>
              <Box textAlign="center" mb={4}>
                <Grid container spacing={2} justifyContent="center">
                  {questions[currentQuestion]?.incorrect_answers.map((incorrectAnswer: string, index: number) => (
                    <Grid key={index} item>
                      <Button variant="outlined" onClick={() => handleAnswerOptionClick(false)}>
                        {incorrectAnswer}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Box textAlign="center" mb={4}>
                <div className='question-count'>
                  Question {currentQuestion + 1}/{questions.length}
                </div>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}
