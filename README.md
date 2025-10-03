# 🧠 Tic-Tac-Toe Game (XO) — Spring Boot + React

## 🚀 Tech Stack
- **Frontend**: React + TypeScript + Axios + Zustand
- **Backend**: Spring Boot + JPA + RESTful API
- **Database**: MySQL 8.x
- **Dev Tools**: Vite, Maven, VS Code
---

## Setup และ Run

### Database (docker compose)
#### Run database
- หลังจาก เปิด docker desktop แล้วให้ใช้
```bash
docker-compose up -d
```
#### Stop 
```bash
docker-compose down 
```
#### Stop & Remove Volumes
```bash
docker-compose down -v
```
---

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
### application.properties (ถ้าไม่ได้ใช้ database ผ่าน docker ให้เปลี่ยนตรงนี้)
```code
spring.application.name=tictactoe
spring.main.banner-mode=off
spring.datasource.url=jdbc:mysql://localhost:3306/tictactoe_db
spring.datasource.username=appuser
spring.datasource.password=apppass
spring.jpa.hibernate.ddl-auto=update
server.port=8080

```
---

### frontend (Spring Boot)
```bash
cd frontend
npm install
npm run dev
```
---
## การออกแบบโปรแกรม
### Frontend
- ใช้ Zustand ในการจัดการ state จากการยิง api (historyStore.ts, tokenStore.ts)
- logic game จะอยู่ GameState.ts 
- Game.ts จะยุ่งเกี่ยวกับ UI เกม
### Backend
- DB Entity Table history
```bash
    @Id
    @Column(name = "id", columnDefinition = "CHAR(36)")
    private String id;

    @Column(nullable = false, columnDefinition = "CHAR(36)")
    private String token;

    @Column(nullable = false)
    private Integer size;

    @Column(name = "board_state", columnDefinition = "TEXT")
    private String boardState;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date createdAt;
```
- API endpoints
```code
HTTP:GET
  /api/token
  RES: "6b43e17a-971d-402b-8805-6790ee6129e3"
 
  /api/history/{token}
  PathVariable: token: String
  RES:
  {
    [
    "6cba10f2-ad1f-481e-8a89-a9ec1e3b302d",
    "e12b807d-ae8f-47fb-83a5-8f3d5a280a9e",
    "802bd3dd-418a-47c3-92f9-d1739932bee7"
    ] 
  }
  
  /api/history/state/{id}
  PathVariable: id: String
  RES:
  {
    "id": "6cba10f2-ad1f-481e-8a89-a9ec1e3b302d",
    "token": "6b43e17a-971d-402b-8805-6790ee6129e3",
    "size": 3,
    "boardState": "{\"history\":[[null,null,null,null,null,null,null,null,null],[\"X\",null,null,null,null,null,null,null,null],[\"X\",\"O\",null,null,null,null,null,null,null],[\"X\",\"O\",null,\"X\",null,null,null,null,null],[\"X\",\"O\",null,\"X\",\"O\",null,null,null,null],[\"X\",\"O\",null,\"X\",\"O\",null,\"X\",null,null]],\"step\":5}",
    "createdAt": "2025-10-02T21:42:22.722+00:00"
  }

HTTP:POST
  /api/history
  BODY:
  {
    "token":"6b43e17a-971d-402b-8805-6790ee6129e3",
    "size":"8",
    "boardState":"{\"history\":[[null,null,null,null,null,null,null,null,null],[null,\"X\",null,null,null,null,null,null,null],[null,\"X\",null,null,null,null,\"O\",null,null],[null,\"X\",null,null,\"X\",null,\"O\",null,null],[null,\"X\",null,null,\"O\",\"X\",\"O\",null,null],[null,\"X\",null,null,\"X\",\"O\",\"O\",\"X\",null]],\"step\":5}"
  }
  RES:
  {
    "id": "6cba10f2-ad1f-481e-8a89-a9ec1e3b302d",
    "token": "6b43e17a-971d-402b-8805-6790ee6129e3",
    "size": 3,
    "boardState": "{\"history\":[[null,null,null,null,null,null,null,null,null],[\"X\",null,null,null,null,null,null,null,null],[\"X\",\"O\",null,null,null,null,null,null,null],[\"X\",\"O\",null,\"X\",null,null,null,null,null],[\"X\",\"O\",null,\"X\",\"O\",null,null,null,null],[\"X\",\"O\",null,\"X\",\"O\",null,\"X\",null,null]],\"step\":5}",
    "createdAt": "2025-10-02T21:42:22.722+00:00"
  }
    
```

---
## Flow การทำงาน
- frontend จะเช็คว่ามี token ที่ localstorage ไหม ถ้าไม่มีจะ GET จาก backend และเก็บที่ localstorage

- หลังจากได้ token แล้ว frontend GET History id ทั้งหมด จาก backend โดยดูจาก token 

- เมื่อ User เล่นเกมจบ frontend จะ POST History โดยจะเก็บประวัติการเล่น ด้วย Json string

- เมื่อ User กด replay frontend จะ GET History ตาม id ของ History และเอาข้อมูลจาก Json string มาแปลงเป็น Json แล้วใช้ในการ run replay
---
## Algorithm
### ตรวจผู้ชนะ

```code
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
```
generateWinningCombinations จะสร้างตำแหน่งที่สามารถชนะได้ (แนวนอน, แนวตั้ง,ทแยงซ้าย, ทแยงขวา) โดยดูจาก size ของตาราง

```code
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
```
calculateWinner จะวนตรวจทุกชุดที่สามารถชนะได้ และเช็คว่าในชุดนั้นมีค่าที่เหมือนกันทั้งหมดหรือไม่

---
### Replay
```code
  const replay = (data: GameState) => {
    setIsReplay(true);
    for (let i = 0; i < data.history.length; i++) {
      setTimeout(() => {
        jumpTo(i);
        if (i === data.history.length - 1) {
          setIsReplay(false);
        }
      }, i * 1000);// หน่วงเวลา 1 วินาทีต่อตา
    }
  };
```
replay จะ run history ทั้งหมดใน state ที่มีโดย หน่วงเวลา 1 วินาทีต่อตา 
```code
  const jumpTo = (step: number) => {
    setGameState((prev) => ({
      history: prev.history,
      step,
    }));
  };
```
jumpTo จะ setGameState(useState) ตาม step ที่ต้องการไปใน GameState 

---
### bot
```code
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
```
หลัง player กดช่องเพื่อลง ถ้าอยู่ใน bot mode จะทำการ random ช่องว่างที่เหลือแล้วลง

