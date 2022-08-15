import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001/')

const Home: NextPage = () => {
  const canvasRef = useRef(null);
  let canvas: HTMLCanvasElement;
  let ctx: any;
  const canvWidth = 600;
  const canvHeight = 400;
  const gameState = {
    playerOne: {
      x: 0,
      y: (canvHeight - 100) / 2,
      width: 10,
      height: 100,
      color: 'white',
      score: 0,
    },
    playerTwo: {
      x: canvWidth - 10,
      y: (canvHeight - 100) / 2,
      width: 10,
      height: 100,
      color: 'white',
      score: 0,
    },
    ball: {
      x: canvWidth / 2,
      y: canvHeight / 2,
      radius: 10,
      speed: 7,
      velocityX: 7,
      velocityY: 7,
      color: "white"
    }
  }

  // draw rect
  function drawRect(x: number, y: number, w: number, h: number, color: string) {
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }
  }

  function  drawNet() {
    for (var i = 0; i <= canvHeight; i += 15)
      drawRect((canvWidth / 2) - 1, 0 + i, 2, 10, "white");
  }

  // //draw circle
  function  drawCircle(x: number, y: number, r: number, color: string) {
    if (ctx) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
    }
  }

  // // draw Text
  function  drawText(text: string, x: number, y: number, color: string) {
    if (ctx) {
      ctx.fillStyle = color;
      ctx.font = '45px fantasy';
      ctx.fillText(text, x, y);
    }
  }

  // PAGE GAME
  function  init() {
    if (canvasRef.current) {
      canvas = canvasRef.current;
      ctx = canvas.getContext('2d');

      drawRect(0, 0, canvas.width, canvas.height, "black");
      document.addEventListener("keydown", keydown);
    }
  }
  
  function  keydown(e: any) {
    // console.log(e.keyCode);
  }
  
  function paintGame(gameState: any) {
    const ball = gameState.ball;
    drawNet();
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
  }

  function  paintPlayers() {
    const pOne = gameState.playerOne;
    const pTwo = gameState.playerTwo;
    drawRect(pOne.x, pOne.y, pOne.width, pOne.height, pOne.color);
    drawRect(pTwo.x, pTwo.y, pTwo.width, pTwo.height, pTwo.color);
    drawText(pOne.score.toString(), canvWidth / 4, canvHeight / 5, "white");
    drawText(pTwo.score.toString(), (canvWidth / 4) * 3, canvHeight / 5, "white");
  }

  useEffect(() => {
    console.log("useeffect");
    init();
    // paintGame();
    paintPlayers();
  })

  useEffect(() => {
    console.log("useeffect2");

    socket.connect();
    socket.on('connection', () => {
      console.log("connected2");
    })
    socket.on('disconnect', () => {
      console.log('disconnected');
    })

    socket.on('init', handlInit);
 
    socket.on('gameState', handlGameState);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('init');
    };
  }, []);
  
  function handlInit(msg: string) {
    console.log("msg: ", msg);
  }

  function handlGameState(gameState: string) {
    gameState = JSON.parse(gameState);
    // requestAnimationFrame(() => {paintGame(gameState));
  }

  return (
    <div>
      <div>
        {/* <div className={styles.names}><h1> {players.p1} </h1> <h1> {players.p2} </h1></div> */}
        <div>
          <canvas width={600} height={400} ref={canvasRef} style={{ border: "1px solid #c3c3c3" }}></canvas>
        </div>
      </div>

    </div>
  );
}

export default Home
