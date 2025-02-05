"use client";
import { useEffect, useState } from "react";
import './styles.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [dice, setDice] = useState([1, 1]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1Pieces, setPlayer1Pieces] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  const [player2Pieces, setPlayer2Pieces] = useState([23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9]);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp; // Используем без useState
      tg.expand(); // Разворачиваем Web App на весь экран

      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }

      // Используем API Telegram для установки темы
      document.body.style.backgroundColor = tg.themeParams?.backgroundColor || "#ffffff";

      // ✅ Используем переменную tg, чтобы исключить ошибку
      console.log("Telegram WebApp API инициализирован:", tg);
    }
  }, []);

  const rollDice = () => {
    const randomDice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
    setDice(randomDice);

    const steps = randomDice[0];

    if (currentPlayer === 1) {
      const newPlayer1Pieces = [...player1Pieces];
      newPlayer1Pieces[0] += steps;
      setPlayer1Pieces(newPlayer1Pieces);
    } else {
      const newPlayer2Pieces = [...player2Pieces];
      newPlayer2Pieces[0] += steps;
      setPlayer2Pieces(newPlayer2Pieces);
    }

    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Добро пожаловать в игру в нарды!</h1>
      {user ? (
        <p>Вы авторизованы как {user.first_name} {user.last_name}</p>
      ) : (
        <p>Не удалось получить данные пользователя</p>
      )}

      <div className="board">
        <div className="player-side">
          {player1Pieces.map((pos, idx) => (
            <div key={idx} className="chip" style={{ backgroundColor: "blue", bottom: `${(pos % 12) * 8}%`, left: `${Math.floor(pos / 12) * 50}%` }}></div>
          ))}
        </div>

        <div className="dice-roll">
          <button onClick={rollDice}>Бросить кубики</button>
          <p>Кубики: {dice[0]} и {dice[1]}</p>
        </div>

        <div className="player-side">
          {player2Pieces.map((pos, idx) => (
            <div key={idx} className="chip" style={{ backgroundColor: "red", bottom: `${(pos % 12) * 8}%`, left: `${Math.floor(pos / 12) * 50}%` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
