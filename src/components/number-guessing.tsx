"use client"; // Enables client-side rendering for this component

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NumberGuessing(): JSX.Element {
  const [start, setStart] = useState<boolean>(false); // Game start state
  const [gameOver, setGameOver] = useState<boolean>(false); // Game over state
  const [display, setDisplay] = useState<boolean>(true); // To control the display of the initial screen
  const [userGuess, setUserGuess] = useState<number | "">(""); // User's guess (changed to number or empty string)
  const [targetNumber, setTargetNumber] = useState<number>(0); // Random number
  const [paused, setPaused] = useState<boolean>(false); // Paused state
  const [attempts, setAttempts] = useState<number>(0); // Attempts counter
  const [timer, setTimer] = useState<number>(30); // Timer state for 60 seconds

  // Generate a random number between 1 and 10 when the game starts
  useEffect(() => {
    if (start && !paused) {
      const randomNumber: number = Math.floor(Math.random() * 10) + 1;
      setTargetNumber(randomNumber);

      // Start the countdown
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) return prevTimer - 1;
          clearInterval(countdown); // Stop timer when it reaches zero
          setGameOver(true); // End game when timer reaches zero
          return 0;
        });
      }, 1000);

      // Cleanup timer interval when component unmounts or game ends
      return () => clearInterval(countdown);
    }
  }, [start, paused]);

  // Function to handle the start of the game
  const handleStartGame = (): void => {
    setStart(true); // Start the game
    setDisplay(false); // Hide the initial screen
    setGameOver(false); // Reset game over state
    setAttempts(0); // Reset attempts
    setPaused(false); // Reset paused state
    setTimer(30); // Reset the timer to 30 seconds
  };

  // Function to handle pausing the game
  const handlePauseGame = (): void => {
    setPaused(true);
  };

  // Function to handle resuming the game
  const handleResumeGame = (): void => {
    setPaused(false);
  };

  // Function to handle user's guess
  const handleGuess = (): void => {
    if (userGuess === targetNumber) {
      setGameOver(true); // End the game if guess is correct
    } else {
      setAttempts(attempts + 1); // Increment attempts if guess is wrong
    }
  };

  // Function to restart the game
  const handleTryAgain = (): void => {
    setStart(false);
    setGameOver(false);
    setUserGuess(""); // Reset guess
    setAttempts(0);
    setDisplay(true); // Show initial screen again
    setTimer(30); // Reset timer
  };

  // Handle changes in the input field
  const handleUserGuessChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value);
    setUserGuess(isNaN(value) ? "" : value); // Store value as number or empty string if invalid
  };

  return (
    <div
      className="h-screen flex justify-center items-center"
      style={{ backgroundImage: "url('/bg-image.jpg')" }}
    >
      {display && (
        <div className="bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 flex flex-col items-center rounded-lg shadow-lg p-8 w-full max-w-md gap-4">
          <h1 className="text-3xl font-bold">Number Guessing Game</h1>
          <p>Try to guess the number between 1 and 10!</p>
          <Button variant="blue" onClick={handleStartGame}>
            Start Game
          </Button>
        </div>
      )}

      {start && !gameOver && (
        <div className="bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 flex flex-col items-center rounded-lg shadow-lg p-8 w-full max-w-md gap-4">
          <h1 className="text-3xl font-bold">Number Guessing Game</h1>
          <p>Game Started! Guess the number between 1 and 10.</p>

          <div className="flex gap-4">
            <Input
              type="number"
              value={userGuess}
              onChange={handleUserGuessChange}
              className="bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 w-full max-w-xs"
              placeholder="Enter your guess"
            />
            <Button variant="blue" onClick={handleGuess}>
              Guess
            </Button>
          </div>
          <p>Attempts: {attempts}</p>
          <p>Time left: {timer} seconds</p>

          {paused ? (
            <Button variant="blue" onClick={handleResumeGame}>
              Resume
            </Button>
          ) : (
            <Button variant="blue" onClick={handlePauseGame}>
              Pause
            </Button>
          )}
        </div>
      )}

      {gameOver && (
        <div className="bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 flex flex-col items-center rounded-lg shadow-lg p-8 w-full max-w-md gap-4">
          {timer === 0 ? (
            <>
              <h1 className="text-3xl font-bold">Time Up!</h1>
              <p>You ran out of time. The correct number was {targetNumber}.</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">Congratulations!</h1>
              <p>
                You guessed the correct number {targetNumber} in {attempts}{" "}
                attempts!
              </p>
            </>
          )}
          <Button variant="blue" onClick={handleTryAgain}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
