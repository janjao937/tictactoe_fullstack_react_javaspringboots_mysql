import { useEffect, useState } from "react";
import { useMyHistoryStore, type HistoryPayload } from "../store/historyStore";
import { useTokenStore } from "../store/tokenStore";

export type Value = 'X' | 'O' | null;
export type BoardState = Value[];

const createBoardState  = (scale: number = 9) => Array(scale).fill(null);

const generateWinningCombinations = (size: number) => {
    const combination : number[][] = [];
    // row
    for (let r = 0; r < size; r++) {
        combination.push(Array.from({length: size}, (_, c) => r * size + c));
    }
    // column
    for (let c = 0; c < size; c++) {
        combination.push(Array.from({length: size}, (_, r) => r * size + c));
    }
    // diagonal 
    combination.push(Array.from({length: size}, (_, i) => i * size + i));
    // diagonal 
    combination.push(Array.from({length: size}, (_, i) => i * size + (size - 1 - i)));

    return combination;
    
}

const calculateWinner  = (boardState: BoardState, size: number = 3) => {
    if (!Array.isArray(boardState) || boardState.length < size * size) return null;
    const winningCombinations = generateWinningCombinations(size);
    for (let combo of winningCombinations) {
        if (combo.some(idx => idx >= boardState.length)) continue;
        const first = boardState[combo[0]];
        if (first && combo.every(idx => boardState[idx] === first)) {
            return first;
        }
    }
    return null;
}

export type GameState = {
    history: BoardState[];
    step: number;
}

export const useGameState = (size: number = 3) => {
    const [gameState, setGameState] = useState<GameState>({
        history: [createBoardState(size * size)],
        step: 0,
    });
    const [isBotMode, setIsBotMode] = useState(false);
    const [isReplay, setIsReplay] = useState(false);
    const { replayData, insertHistory } = useMyHistoryStore();
    const { token } = useTokenStore();

    const activeSize = replayData?.size ?? size;
    const current = replayData
        ? (JSON.parse(replayData.boardState) as GameState).history[
            Math.min(gameState.step, (JSON.parse(replayData.boardState) as GameState).history.length - 1)
        ]
        : gameState.history[Math.min(gameState.step, gameState.history.length - 1)];
    
    const winner =
        current.length === activeSize * activeSize
        ? calculateWinner(current, activeSize)
        : null;
    
    useEffect(() => {
        if (!replayData) return;
        try {
        const replayGameState = JSON.parse(replayData.boardState) as GameState;
        setGameState({
            history: [createBoardState(replayData.size * replayData.size)],
            step: 0,
        });
        replay(replayGameState);
        } catch (err) {
        console.log("Replay parse error:", err);
        }
    }, [replayData]);

    useEffect(() => {
        if (winner && token && !replayData) {
        const req: HistoryPayload = {
            token,
            size: size.toString(),
            boardState: JSON.stringify(gameState),
        };
        insertHistory(req);
        }
    }, [winner, token]);
    useEffect(() => {
        setGameState({
            history: [createBoardState(activeSize * activeSize)],
            step: 0,
        });
    }, [activeSize]);

    const handleClick = (squareIndex: number) => {
        const history = gameState.history.slice(0, gameState.step + 1);
        const boardState = history[history.length - 1];
        if (calculateWinner(boardState, activeSize) || boardState[squareIndex]) return;

        const newBoardState = boardState.slice();
        newBoardState[squareIndex] = isBotMode? "X" : gameState.step % 2 === 0 ? "X" : "O";
        history.push(newBoardState);
        setGameState({
            history,
            step: history.length - 1,
        });
//==
        if (
            isBotMode &&
            !calculateWinner(newBoardState, activeSize) &&
            newBoardState.some(cell => cell === null)
        ) {
            botMove(newBoardState);
        }
    };

    const botMove = (latestBoardState: BoardState) => {
        const history = gameState.history.slice(0, gameState.step + 1);
        const boardState = latestBoardState;
        const emptyIndices = boardState
            .map((cell, idx) => (cell === null ? idx : null))
            .filter(idx => idx !== null) as number[];
        if (emptyIndices.length === 0) return;
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const newBoardState = boardState.slice();
        newBoardState[randomIndex] = "O";
        history.push(newBoardState);
        setGameState({
            history,
            step: history.length - 1,
        });
    };

  const jumpTo = (step: number) => {
    setGameState((prev) => ({
      history: prev.history,
      step,
    }));
  };

  const replay = (data: GameState) => {
    setIsReplay(true);
    for (let i = 0; i < data.history.length; i++) {
      setTimeout(() => {
        jumpTo(i);
        if (i === data.history.length - 1) {
          setIsReplay(false);
        }
      }, i * 1000);
    }
  };

  return { gameState, current, xIsNext: gameState.step % 2 === 0, winner, handleClick, jumpTo, replay, isReplay, activeSize, setIsBotMode, isBotMode };
};