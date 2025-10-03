import styled from 'styled-components';
import { useGameState, type BoardState, type Value } from "../hooks/GameState";
import { useRef, useState } from 'react';
import { useMyHistoryStore } from '../store/historyStore';

const Row = styled.div<LayoutProps>`
    display: flex;
    flex-direction: row;
    gap: ${props => props.gap}px;
`;
const Column = styled.div<LayoutProps>`
    display: flex;
    flex-direction: column;
    gap: ${props => props.gap}px;
`;
const StyledSquare = styled.button`
  width: 34px;
  height: 34px;
  background: #fff;
  color: #000;
  border: 1px solid #999;
  padding: 0;
  font-size: 24px;
  `;

type LayoutProps = {
    gap: number,
}
type GameProps = {
  restart: () => void;
};

const Game = ({restart}:GameProps) => { 
    const STARTER_SIZE = 3;

    const [size, setSize] = useState(STARTER_SIZE);
    const [inputSize, setInputSize] = useState(STARTER_SIZE);
    const inputRef = useRef<HTMLInputElement>(null);

    const { gameState, current, xIsNext, winner, handleClick, isReplay, activeSize, setIsBotMode, isBotMode } = useGameState(size);
    const { myHistory, onSelectHistory, replayData } = useMyHistoryStore();

    const handleInputClick = () =>{
        inputRef.current?.select();
    }
    const onSetSize = () =>{
        if(gameState.step >= 1){
            setInputSize(size);
            return;
        }
        const newSize = inputSize < 2 ? 2 : inputSize > 20 ? 20 : inputSize;
        setSize(newSize);
        setInputSize(newSize);
    }

    return (
        <div>
            <Row gap={40}>
                <Column gap={20}>
                        <div className="input-group">
                            <button onClick={() => {
                                if(gameState.step >= 1) return;
                                setIsBotMode(!isBotMode);
                            }}>{!isBotMode ? "open bot" : "close bot"}</button>
                            <input ref = {inputRef} type="number" value={inputSize} min={3} onClick={handleInputClick} onChange={(e) =>{
                                const value = Number(e.target.value);
                                setInputSize(value);
                            }}/>
                            <button onClick={onSetSize}>Set Size</button>
                            <button onClick={restart}>Restart</button>
                        </div>
                        <div>
                        {winner
                            ? `Winner: ${winner}`
                            : current.every(cell => cell !== null)
                            ? 'Draw'
                            : `Next player: ${xIsNext ? 'X' : 'O'}`
                        }
                    </div>
                    {
                        <Board boardState={current} boardSize={activeSize} onClick={replayData ? () => {} : handleClick} />
                    }
                </Column>
                {/* <Log history = {gameState.history} jumpTo = {jumpTo}/> */}
                <HistoryList myHistory = {myHistory} onSelectHistory = {onSelectHistory} isReplay = {isReplay} />
            </Row>
        </div>
    );
}
type HistoryListProps = {
    myHistory?: string[],
    isReplay: boolean,
    onSelectHistory: (boardId: string) => void,
}

const HistoryList = (props: HistoryListProps) => {
    return (
        <div>
            <h2>History List</h2>
            <div className='history-list-container'>
                {props.myHistory && props.myHistory.length > 0 ? (
                props.myHistory.map((item, idx) => (
                        <button className='history-list-button' key={idx} onClick={() => {
                            if(props.isReplay) return;
                            props.onSelectHistory(item);
                        }}>Replay: {++idx}</button>
                ))
            ) : (
                <li>No history</li>
            )}
            </div>
        </div>
    );
}

type SquareProps = {
    value: Value,
    onClick: () => void,
}
const Square = (props:SquareProps) => {
    return(
        <StyledSquare onClick={props.onClick}>
        {props.value}
        </StyledSquare>
    );
}

type BoardProps = {
    boardState:BoardState,
    boardSize: number,
    onClick: (squareIndex: number) => void,
}
const Board = ({boardState, boardSize, onClick}: BoardProps) => {
    const createProps = (i: number): SquareProps => ({
        value: boardState[i],
        onClick: () => onClick(i),
    });

    const rows = [];
    for (let i = 0; i < boardSize; i++) {
        const cols = [];
        for (let j = 0; j < boardSize; j++) {
            const index = i * boardSize + j;
            cols.push(<Square key={index} {...createProps(index)} />);
        }
        rows.push(
            <Row gap={0} key={i}>
                {cols}
            </Row>
        );
    }

    return <Column gap={0}>{rows}</Column>;
}

// type LogProps = {
//     history: BoardState[],
//     jumpTo: (step: number) => void,
// }
// const Log =(props: LogProps)=>{
//     return (
//         <ol>
//             {/* <button>Go to move #1</button> */}
//             {
//                 props.history.map((e, index) => {
//                     return(
//                      <li key={index}>
//                         <button className = "list"onClick={() => props.jumpTo(index)}>
//                         {index === 0 ? 'start #0' : `move #${index}`}
//                         </button>

//                      </li>   
//                     )
//                 })
//             }
//         </ol>
//     );
// }
export default Game;