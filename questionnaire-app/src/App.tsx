import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Button } from '@mui/material';

export default function App() {
  interface Question {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [mixedAnswers, setMixedAnswers] = useState<string[]>([]);

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

  useEffect(() => {
    if (questions.length > 0) {
      mixAnswers();
    }
  }, [currentQuestion, questions]);

  const mixAnswers = () => {
    const allAnswers = [...questions[currentQuestion]?.incorrect_answers, questions[currentQuestion]?.correct_answer];
    const shuffledAnswers = shuffleAnswers(allAnswers);
    setMixedAnswers(shuffledAnswers);
  };

  const handleAnswerOptionClick = (selectedAnswer: string) => {
    if (selectedAnswer === questions[currentQuestion]?.correct_answer) {
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

  const shuffleAnswers = (answers: string[]): string[] => {
    const shuffledAnswers = [...answers];
    for (let i = shuffledAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
    }
    return shuffledAnswers;
  };

  const resetGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
    setGameOver(false);
    mixAnswers();
  };

  return (
    <Container sx={{
      margin: 4,
      display: 'flex',
      justifyContent: 'center'
    }}
    >
      <Box
        sx={{
          width: '600px',
          height: '300px',
          border: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: 1
        }}
      >
        <Box sx={{ margin: 4 }}>
          {showScore ? (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Box mb={4}>
                <div className='score-section'>
                  Congratulations, you answered {score}/{questions.length} questions correctly.
                </div>
              </Box>
              <Box>
                {gameOver && (
                  <Button sx={{
                    color: 'black',
                    borderBlockColor: 'black',
                    borderBlockStyle: 'solid'
                  }}
                    onClick={resetGame}
                    variant="outlined">
                    Play 1 more time
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Box>
              <Box textAlign="center" mb={7}>
                <div className='question-text'>{questions[currentQuestion]?.question}</div>
              </Box>
              <Box textAlign="center" mb={4}>
                <Grid container spacing={2} justifyContent="center">
                  {mixedAnswers.map((answerOption: string, index: number) => (
                    <Grid key={index} item>
                      <Button variant="outlined" sx={{
                        color: 'black',
                        borderBlockColor: 'black',
                        borderBlockStyle: 'solid'
                      }}
                        onClick={() => handleAnswerOptionClick(answerOption)}
                      >
                        {answerOption}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Box textAlign="right" mb={1}>
                <div className='question-count'>
                  {currentQuestion + 1}/{questions.length}
                </div>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}
