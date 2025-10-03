import { useEffect, useState } from 'react';
import './App.css'
import Game from './components/Game'
import { useTokenStore } from './store/tokenStore';
import { useMyHistoryStore } from './store/historyStore';

function App() {
  const [restartKey, setRestartKey] = useState(0);
  const { initToken, token } = useTokenStore();
  const { historyList, clearReplayData } = useMyHistoryStore();
  
  useEffect(() => {
    initToken();
  },[]);

  useEffect(() => {
    if(!token|| token === "") return;
    historyList(token || "");
  }, [token]);

  const restartComponent = () => {
    clearReplayData();
    setRestartKey(prev => prev + 1);
  };
  
  return (
    <>
      <h1 className="header">Tic-Tac-Toe</h1>
      <Game key={restartKey} restart = {restartComponent}/>
    </>
  );
}

export default App