"use client";
import { useEffect, useState } from "react";
import './styles.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [dice, setDice] = useState([1, 1]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const players = {
    1: useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
    2: useState([23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9])
  };

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram) {
      telegram.expand();
      if (telegram.initDataUnsafe?.user) setUser(telegram.initDataUnsafe.user);
      document.body.style.backgroundColor = telegram.themeParams?.backgroundColor || "#fff";
    }
  }, []);

  const rollDice = () => {
    const newDice = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)];
    setDice(newDice);
    const [pieces, setPieces] = players[currentPlayer];
    setPieces(prev => [prev[0] + newDice[0], ...prev.slice(1)]);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  return (
    <div className="game">
      <h1>Добро пожаловать в игру в нарды!</h1>
      <p>{user ? `Вы авторизованы как ${user.first_name} ${user.last_name}` : "Не удалось получить данные пользователя"}</p>
      
      <div className="board">
        {[1, 2].map(player => (
          <div key={player} className="player-side">
            {players[player][0].map((pos, idx) => (
              <div key={idx} className="chip" style={{
                backgroundColor: player === 1 ? "blue" : "red",
                bottom: `${(pos % 12) * 8}%`,
                left: `${Math.floor(pos / 12) * 50}%`
              }} />
            ))}
          </div>
        ))}
      </div>

      <button onClick={rollDice}>Бросить кубики</button>
      <p>Кубики: {dice[0]} и {dice[1]}</p>
    </div>
  );
}
