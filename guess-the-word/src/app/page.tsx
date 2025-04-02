"use client";
import { useEffect, useState } from "react";
import "./style.css";
type LineProps = {
  guess: string;
  isFinal: boolean;
  solution: string;
};
const API_URL = "http://localhost:3000/api/words";
const WORD_LENGTH = 5;

export default function Home() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const handleTyping = (event: KeyboardEvent) => {
      if (isGameOver) return;

      if (event.key === "Enter") {
        if (currentGuess.length !== 5) return;

        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val == null)] =
          currentGuess.toUpperCase();
        setGuesses(newGuesses);
        setCurrentGuess("");

        const isCorrrect = solution === currentGuess;
        if (isCorrrect) setIsGameOver(true);
      }
      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }
      if (currentGuess.length >= 5) return;

      const isLetter = event.key.match(/^[a-z]{1}$/) != null;
      if (isLetter) {
        setCurrentGuess((oldGuess) => oldGuess + event.key);
      }
    };

    window.addEventListener("keydown", handleTyping);
    return () => window.removeEventListener("keydown", handleTyping);
  }, [currentGuess, isGameOver, solution]);

  useEffect(() => {
    const fetchWord = async () => {
      const response = await fetch(API_URL);
      const words = await response.json();
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setSolution(randomWord);
    };
    fetchWord();
  }, []);

  return (
    <div className="board">
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex((val) => val == null);
        return (
          <Line
            isFinal={!isCurrentGuess && guess != null}
            key={i}
            solution={solution}
            guess={isCurrentGuess ? currentGuess : guess ?? ""}
          />
        );
      })}
    </div>
  );
}

function Line({ guess, isFinal, solution }: LineProps) {
  const tiles = [];
  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    let className = "tile";

    if (isFinal) {
      if (char === solution[i]) {
        className += " correct";
      } else if (solution.includes(char)) {
        className += " close";
      } else {
        className += " incorrect";
      }
    }
    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }

  return <div className="line">{tiles}</div>;
}
