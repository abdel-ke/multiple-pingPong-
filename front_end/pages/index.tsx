import type { NextPage } from 'next'
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client'

const socket = io('http://localhost:8080');

const Home: NextPage = () => {
  const canvasRef = useRef(null);
  let canvas: HTMLCanvasElement;
  let ctx: any;

  const [gameCodeInput, setGameCodeInput] = useState('');
  const [namePlayer, setNamePlayer] = useState('');
  const [gameCodeDisplay, setGameCodeDisplay] = useState('');
  const [initialScreen, setinitialScreen] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [playerNamber, setPlayerNamber] = useState(0);

  const init = (player: number) => {
    setGameActive(true);
    setPlayerNamber(player)
  }

  if (typeof window !== "undefined") {
    window.onresize = () => {
      if (gameActive) {
        if (canvasRef.current) {
          if (window.innerWidth > 1300) {
            canvas.width = 600;
            canvas.height = canvas.width / 2;
          }
          else if (window.innerWidth < 1300 && window.innerWidth > 600) {
            canvas.width = 500;
            canvas.height = canvas.width / 2;
          }
          else if (window.innerWidth < 600) {
            canvas.width = 300;
            canvas.height = canvas.width / 2;
          }
        }
      }
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      canvas = canvasRef.current;
      ctx = canvas.getContext('2d');
      if (window.innerWidth > 1300) {
        canvas.width = 600;
        canvas.height = canvas.width / 2;
      }
      else if (window.innerWidth < 1300 && window.innerWidth > 600) {
        canvas.width = 500;
        canvas.height = canvas.width / 2;
      }
      else if (window.innerWidth < 600) {
        canvas.width = 300;
        canvas.height = canvas.width / 2;
      }
      socket.emit('canvaSize', { width: canvas.width, height: canvas.height });
    }
  }, [!initialScreen]);

  /* const newGame = () => {
    setPlayerNamber(1);
    socket.emit('newGame', namePlayer);
    init(1);
  }
 */
  const playGame = () => {
    socket.emit('playGame');
  }
  /* 
    const joinGame = () => {
      setPlayerNamber(2);
      socket.emit('joinGame', { gameCode: gameCodeInput.toString(), name: namePlayer });
      init(2);
    }
     */
  const spectateGame = () => {
    setinitialScreen(true);
    socket.emit('spectateGame', gameCodeInput.toString());
    init(0);
  }

  const handlSpectateState = (state: string) => {
    if (canvasRef.current) {
      if (ctx?.clearRect)
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      drawRect(ctx, 0, 0, canvas.width, canvas.height, "black");
      if (!gameActive) {
        console.log("gameActive handlegame ret : ", gameActive);
        return;
      }

      let StateTemp = JSON.parse(state);
      requestAnimationFrame(() => paintGame(ctx, StateTemp));
    }
  }
  socket.off('spectateState').on('spectateState', handlSpectateState);

  // draw rect
  const drawRect = (ctx: any, x: number, y: number, w: number, h: number, color: string) => {
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }
  }

  const drawNet = (ctx: any) => {
    for (var i = 0; i <= canvas.height; i += 15)
      drawRect(ctx, (canvas.width / 2) - 1, 0 + i, 2, 10, "white");
  }

  // //draw circle
  const drawCircle = (ctx: any, x: number, y: number, r: number, color: string) => {
    if (ctx) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
    }
  }

  // // draw Text
  const drawText = (ctx: any, text: string, x: number, y: number, color: string, percentage: number) => {
    if (ctx) {
      ctx.fillStyle = color;
      ctx.font = `${45 / percentage}px fantasy`;
      ctx.fillText(text, x, y);
    }
  }

  // PAGE GAME
  const keydown = (e: any) => {
    socket.emit('keyDown', e.keyCode);
  }

  const paintGame = (ctx: any, gameState: any) => {
    let percentage = 600 / canvas.width;
    const ball = gameState.ball;
    ball.r = ball.r / percentage;
    ball.x = ball.x / percentage;
    ball.y = ball.y / percentage;

    drawRect(ctx, 0, 0, canvas.width, canvas.height, "black");
    drawNet(ctx);
    drawCircle(ctx, ball.x, ball.y, ball.radius, ball.color);
    paintPlayers(ctx, gameState, percentage);
  }

  const paintPlayers = (ctx: any, gameState: any, percentage: number) => {
    const pOne = gameState.playerOne;
    const pTwo = gameState.playerTwo;
    pOne.x = pOne.x / percentage;
    pOne.y = pOne.y / percentage;
    pOne.width = pOne.width / percentage;
    pOne.height = pOne.height / percentage;
    pTwo.x = pTwo.x / percentage;
    pTwo.y = pTwo.y / percentage;
    pTwo.width = pTwo.width / percentage;
    pTwo.height = pTwo.height / percentage;

    drawRect(ctx, pOne.x, pOne.y, pOne.width, pOne.height, pOne.color);
    drawRect(ctx, pTwo.x, pTwo.y, pTwo.width, pTwo.height, pTwo.color);
    drawText(ctx, pOne.score.toString(), (600 / 4) / percentage, (300 / 5) / percentage, "white", percentage);
    drawText(ctx, pTwo.score.toString(), ((600 / 4) * 3) / percentage, (300 / 5) / percentage, "white", percentage);
  }

  const dots = (x: number, y: number) => {
    if (ctx) {
      let percentage = 600 / canvas.width;
      ctx.fillStyle = "red";
      ctx.font = `${45 / percentage}px fantasy`;
      ctx.fillText(".", x, y);
    }
  }

  const handlInit = async (number: number) => {
    setinitialScreen(true);
    setPlayerNamber(number);
    setGameActive(true);
  }
  socket.off('init').on('init', handlInit);

  const handlGameState = (gameState: string) => {
    if (canvasRef.current) {
      if (ctx?.clearRect)
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      drawRect(ctx, 0, 0, canvas.width, canvas.height, "black");
      document.addEventListener("keydown", keydown);
      if (!gameActive) {
        console.log("gameActive handlegame ret : ", gameActive);
        return;
      }

      let StateTemp = JSON.parse(gameState);
      requestAnimationFrame(() => paintGame(ctx, StateTemp));
    }
  }
  socket.off('gameState').on('gameState', handlGameState);

  const handleGameOver = (data: any) => {
    if (!gameActive) {
      return;
    }
    data = JSON.parse(data);
    setGameActive(false);
    if (data === playerNamber) {
      alert('You Win!');
      // console.log('You Win!');
    }
    if (data !== playerNamber) {
      alert('You Lose :(');
      // console.log('You Lose :(');
    }
  }
  socket.off('gameOver').on('gameOver', handleGameOver);

  const handlePlayerDisconnected = (player: number) => {
    if (player !== playerNamber) {
      alert('Your opponent disconnected. You win!');
      // console.log('Your opponent disconnected. You win!');
    }
  }
  socket.off('playerDisconnected').on('playerDisconnected', handlePlayerDisconnected);

  const handleGameCode = (gameCode: string) => {
    setGameCodeDisplay(gameCode);
  }
  socket.off('gameCode').on('gameCode', handleGameCode);

  let x = 0;
  const handleWaiting = () => {
    drawText(ctx, ". ", (canvas.width / 2 - 12) + x, canvas.height / 2, "white", 600 / canvas.width);
    x += 10;
    if (x === 40) {
      x = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  socket.off('waiting').on('waiting', handleWaiting);
  
  let countDown = 3;
  const handleStarting = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawText(ctx, countDown.toString(), canvas.width / 2, canvas.height / 2, "white", 600 / canvas.width);
    countDown--;
  }
  socket.off('start').on('start', handleStarting);

  /* 
    const handleUnknownGame = () => {
      alert("Unknown Game code");
    }
    socket.off('unknownGame').on('unknownGame', handleUnknownGame);
  
    const handletooManyPlayers = () => {
      // reset();
      alert("This Game is already in progress");
    }
    socket.off('tooManyPlayers').on('tooManyPlayers', handletooManyPlayers);
    const reset = () => {
      setGameCodeInput('');
      setGameCodeDisplay('');
      setinitialScreen(false);
    }
  */

  return (
    <div>
      <div>
        {!initialScreen ? <div id='initialScreen'>
          <input type="text" placeholder='Write your name' id='name' onChange={(e) => { setNamePlayer(e.target.value) }} />
          <input type="text" placeholder='Write the code' id='code' onChange={(e) => { setGameCodeInput(e.target.value) }} />
          {/* <button type='submit' onClick={joinGame}>join Game</button>
          <button type='submit' onClick={newGame}>new Game</button> */}
          <button type='submit' onClick={spectateGame}>spectating a game</button>
          <button type='submit' onClick={playGame}>Play</button>
        </div>
          : <div id='gameScreen'>
            <h1>{namePlayer} your game code is: <span id='gameCodeDisplay'>{gameCodeDisplay}</span> </h1>
            <div style={{ display: "flex", justifyContent: "center" }} >
              <canvas ref={canvasRef} style={{ border: "1px solid #c3c3c3", backgroundColor: "black" }}></canvas>
            </div>
          </div>}
      </div>
    </div>
  );
}

export default Home
