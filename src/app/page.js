"use client";
import { useEffect, useState } from "react";
import "../../styles.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [dice, setDice] = useState([1, 1]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1Pieces, setPlayer1Pieces] = useState([0, 1, 2, 3, 4]);
  const [player2Pieces, setPlayer2Pieces] = useState([23, 22, 21, 20, 19]);
  const [selectedPiece, setSelectedPiece] = useState(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();

      if (window.Telegram.WebApp.initDataUnsafe?.user) {
        setUser(window.Telegram.WebApp.initDataUnsafe.user);
      }

      document.body.style.backgroundColor = window.Telegram.WebApp.themeParams?.backgroundColor || "#ffffff";
    }
  }, []);

  const rollDice = () => {
    const randomDice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
    setDice(randomDice);
  };

  const handlePieceClick = (index, player) => {
    if (currentPlayer !== player) return; // Ходит только текущий игрок
    setSelectedPiece(index);
  };

  const handleMove = () => {
    if (selectedPiece === null) return;

    const steps = dice[0]; // Пока используем только первый кубик
    let newPositions;

    if (currentPlayer === 1) {
      newPositions = [...player1Pieces];
      newPositions[selectedPiece] += steps;

      if (newPositions[selectedPiece] > 23) {
        newPositions[selectedPiece] = 23;
      }

      setPlayer1Pieces(newPositions);
    } else {
      newPositions = [...player2Pieces];
      newPositions[selectedPiece] -= steps;

      if (newPositions[selectedPiece] < 0) {
        newPositions[selectedPiece] = 0;
      }

      setPlayer2Pieces(newPositions);
    }

    setSelectedPiece(null);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1); // Смена хода
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Нарды</h1>
      {user ? <p>Вы играете как {user.first_name} {user.last_name}</p> : <p>Не удалось получить данные пользователя</p>}

      <div className="board">
        <div className="player-side">
          {player1Pieces.map((pos, idx) => (
            <div 
              key={idx} 
              className={`chip ${selectedPiece === idx && currentPlayer === 1 ? "selected" : ""}`}
              style={{ backgroundColor: "blue", bottom: `${(pos % 12) * 8}%`, left: `${Math.floor(pos / 12) * 50}%` }}
              onClick={() => handlePieceClick(idx, 1)}
            ></div>
          ))}
        </div>

        <div className="dice-roll">
          <button onClick={rollDice}>Бросить кубики</button>
          <p>Кубики: {dice[0]} и {dice[1]}</p>
          <button onClick={handleMove} disabled={selectedPiece === null}>Сделать ход</button>
        </div>

        <div className="player-side">
          {player2Pieces.map((pos, idx) => (
            <div 
              key={idx} 
              className={`chip ${selectedPiece === idx && currentPlayer === 2 ? "selected" : ""}`}
              style={{ backgroundColor: "red", bottom: `${(pos % 12) * 8}%`, left: `${Math.floor(pos / 12) * 50}%` }}
              onClick={() => handlePieceClick(idx, 2)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
