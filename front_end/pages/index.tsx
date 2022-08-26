import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001/')

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

  useEffect(() => {
    // socket.connect();
    // socket.on('connection', () => { console.log("connected"); })
    // socket.on('disconnect', () => { console.log('disconnected'); })

    // socket.on('init', handlInit);
    // socket.on('gameState', handlGameState);
    // socket.on('gameOver', handleGameOver);
    // socket.on('gameCode', handleGameCode);
    // socket.on('unknownGame', handleUnknownGame);
    // socket.on('tooManyPlayers', handletooManyPlayers);

    return () => {
      // socket.off('connect');
      // socket.off('disconnect');
      // socket.off('init');
      // socket.off('gameState');
      // socket.off('gameOver');
      // socket.off('gameCode');
      // socket.off('unknownGame');
      // socket.off('tooManyPlayers');
    };
  }, []);

  const init = (player: number) => {
    setGameActive(true);
    setPlayerNamber(player)
  }

  useEffect(() => {
    console.log("define canvas");
    if (canvasRef.current) {
      console.log("inside canvas: ", playerNamber);

      canvas = canvasRef.current;
      ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 400;
      socket.emit('canvaSize', { width: canvas.width, height: canvas.height });
      console.log("canvas.width: ", canvas.width, "---- canvas.height: ", canvas.height);
    }
  }, [!initialScreen])

  const newGame = () => {
    setPlayerNamber(1);
    socket.emit('newGame', namePlayer);
    init(1);
  }

  const joinGame = () => {
    setPlayerNamber(2);
    socket.emit('joinGame', {gameCode: gameCodeInput.toString(), name: namePlayer});
    init(2);
  }

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
  const drawText = (ctx: any, text: string, x: number, y: number, color: string) => {
    if (ctx) {
      ctx.fillStyle = color;
      ctx.font = '45px fantasy';
      ctx.fillText(text, x, y);
    }
  }

  // PAGE GAME
  const keydown = (e: any) => {
    // console.log(e.keyCode);
    socket.emit('keyDown', e.keyCode);
  }

  const paintGame = (ctx: any, gameState: any) => {
    const ball = gameState.ball;
    drawRect(ctx, 0, 0, canvas.width, canvas.height, "black");
    drawNet(ctx);
    drawCircle(ctx, ball.x, ball.y, ball.radius, ball.color);
    paintPlayers(ctx, gameState);
  }

  const paintPlayers = (ctx: any, gameState: any) => {
    const pOne = gameState.playerOne;
    const pTwo = gameState.playerTwo;
    drawRect(ctx, pOne.x, pOne.y, pOne.width, pOne.height, pOne.color);
    drawRect(ctx, pTwo.x, pTwo.y, pTwo.width, pTwo.height, pTwo.color);
    drawText(ctx, pOne.score.toString(), canvas.width / 4, canvas.height / 5, "white");
    drawText(ctx, pTwo.score.toString(), (canvas.width / 4) * 3, canvas.height / 5, "white");
  }

  const handlInit = (number: number) => {
    // setPlayerNamber(number);
    setinitialScreen(true);
    // init();
  }
  socket.off('init').on('init', handlInit);

  useEffect(() => {
    console.log("UseEffect playerNamber: ", playerNamber);
  }, [playerNamber])

  useEffect(() => {
    console.log("UseEffect gameActive: ", gameActive);
  }, [gameActive])

  let oneTime = false;
  const handlGameState = (gameState: string) => {
    if (canvasRef.current) {
      if (ctx?.clearRect)
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      drawRect(ctx, 0, 0, canvas.width, canvas.height, "black");
      document.addEventListener("keydown", keydown);
      if (!gameActive)
      {
        console.log("gameActive handlegame ret : ", gameActive);
          return;
      }

      let StateTemp = JSON.parse(gameState);
      requestAnimationFrame(() => paintGame(ctx, StateTemp));
    }
  }
  socket.off('gameState').on('gameState', handlGameState);

  const handleGameOver = (data: any) => {
    // if (!gameActive) {
    //   return;
    // }

    data = JSON.parse(data);

    setGameActive(false);
    console.log("data.winner: ", data);
    console.log("playerNamber: ", playerNamber);
    console.log("gameCodeDisplay: |", gameCodeDisplay, "|");

    if (data === playerNamber) {
      // alert('You Win!');
      console.log('You Win!');
    } else {
      // alert('You Lose :(');
      console.log('You Lose :(');
    }
  }

  socket.off('gameOver').on('gameOver', handleGameOver);
  
  const handlePlayerDisconnected = (player: number) => {
    if (player !== playerNamber) {
      // alert('Your opponent disconnected');
      console.log('Your opponent disconnected');
    }
    /* if (player !== playerNamber) {
      // alert('You were disconnected from the server.');
      console.log('You were disconnected from the server.');
    } else {
      // alert('Your opponent was disconnected.');
      console.log('Your opponent was disconnected.');
    } */
  }
  socket.off('playerDisconnected').on('playerDisconnected', handlePlayerDisconnected);

  const handleGameCode = (gameCode: string) => {
    // console.log("gameCode", gameCode);
    setGameCodeDisplay(gameCode);
    // setinitialScreen(true);
  }
  socket.off('gameCode').on('gameCode', handleGameCode);

  // useEffect(() => {
  // } , [gameCodeDisplay]);

  const handleUnknownGame = () => {
    // reset();
    alert("Unknown Game code");
  }
  socket.off('unknownGame').on('unknownGame', handleUnknownGame);

  const handletooManyPlayers = () => {
    // reset();
    alert("This Game is already in progress");
  }
  socket.off('tooManyPlayers').on('tooManyPlayers', handletooManyPlayers);

  // const reset = () => {
  //   setGameCodeInput('');
  //   setGameCodeDisplay('');
  //   // setPlayerNamber(0)
  //   setinitialScreen(false);
  // }

  return (
    <div>
      <div>
        {!initialScreen ? <div id='initialScreen'>
          <input type="text" placeholder='Write your name' id='name' onChange={(e) => { setNamePlayer(e.target.value) }}/>
          <input type="text" placeholder='Write the code' id='code' onChange={(e) => { setGameCodeInput(e.target.value) }} />
          <button type='submit' id='joinGameBtn' onClick={joinGame}>join Game</button>
          <button type='submit' id='newGameBtn' onClick={newGame}>new Game</button>
        </div>
          : <div id='gameScreen'>
            <h1>{namePlayer} your game code is: <span id='gameCodeDisplay'>{gameCodeDisplay}</span> </h1>
            <canvas ref={canvasRef} style={{ border: "1px solid #c3c3c3" }}></canvas>
          </div>}
      </div>
    </div>
  );
}

export default Home
