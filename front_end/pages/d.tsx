import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001/')

const Home: NextPage = () => {
  const canvasRef = useRef(null);
  const canvWidth = 600;
  const canvHeight = 400;
  // create the net
  const [net, setNet] = useState({
    x: (canvWidth / 2) - 1,
    y: 0,
    width: 2,
    height: 10,
    color: "white"
  })

  // Page Name
  // const [data, setData]=useState({name : ""});
  const [name, setName] = useState("");
  const [matchId, setMatchId] = useState(0);
  const [Umatch, setUmatch] = useState<{
    id: number;
    playerOne: {
      socketId: string;
      name: string;
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      score: number;
    }
    playerTwo: {
      socketId: string;
      name: string;
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      score: number;
    }
    ball: {
      x: number;
      y: number;
      radius: number;
      speed: number;
      velocityX: number;
      velocityY: number;
      color: string
    }
  }>();

  useEffect(() => {
    socket.connect();
    socket.off('connect').on('connect', () => {
      console.log("connected");
    })
    socket.on('disconnect', () => {
      console.log('disconnected');
    })
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    // console.log('---Umatch:', Umatch);
  }, [Umatch]);

  // PAGE GAME

  function init(){
    
  }

  // draw rect
  function drawRect(ctx: CanvasRenderingContext2D | null, x: number, y: number, w: number, h: number, color: string) {
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }
  }

  function drawNet(ctx: CanvasRenderingContext2D | null) {
    for (var i = 0; i <= canvHeight; i += 15)
      drawRect(ctx, net.x, net.y + i, net.width, net.height, net.color);
  }

  // //draw circle
  function drawCircle(ctx: CanvasRenderingContext2D | null, x: number, y: number, r: number, color: string) {
    if (ctx) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
    }
  }

  // // draw Text
  function drawText(ctx: CanvasRenderingContext2D | null, text: string, x: number, y: number, color: string) {
    if (ctx) {
      ctx.fillStyle = color;
      ctx.font = '45px fantasy';
      ctx.fillText(text, x, y);
    }
  }

  useEffect(() => {
    let inter: NodeJS.Timer | undefined;
    const interval = setInterval(() => {
      if (canvasRef.current) {
        const canvas: HTMLCanvasElement = canvasRef.current;
        const ctx = canvas.getContext("2d");
        // //clear the canvas
        drawRect(ctx, 0, 0, canvWidth, canvHeight, "black");
        // //draw the net
        drawNet(ctx);
        // //draw score
        // console.log(user);
        // drawText(ctx, user.score.toString(), canvWidth / 4, canvHeight / 5, "white");

        if (Umatch?.playerOne || Umatch?.playerTwo) {
          drawText(ctx, Umatch.playerOne.score.toString(), canvWidth / 4, canvHeight / 5, "white");
          // drawText(ctx, com.score.toString(), 3 * canvWidth / 4, canvHeight / 5, "white");
          drawText(ctx, Umatch.playerTwo.score.toString(), 3 * canvWidth / 4, canvHeight / 5, "white");
          // draw the user & computer paddle

          drawRect(ctx, Umatch.playerOne.x, Umatch.playerOne.y, Umatch.playerOne.width, Umatch.playerOne.height, Umatch.playerOne.color);
          drawRect(ctx, Umatch.playerTwo.x, Umatch.playerTwo.y, Umatch.playerTwo.width, Umatch.playerTwo.height, Umatch.playerTwo.color);
          // //draw the ball
          drawCircle(ctx, Umatch.ball.x, Umatch.ball.y, Umatch.ball.radius, Umatch.ball.color);
        }

        if (Umatch?.id) {
          console.log('-----Umatch:', Umatch.id);
          socket.emit('updateGame', Umatch.id, (resp: any) => {
            setUmatch(resp)
          });
        }
      }
    }, 1000 / 50);

    
    return () => clearInterval(interval);
  }, [Umatch])

  function keydown(e: any) {
    const data = {
      id: Umatch?.id,
      key: e.key,
    }
      socket.emit('keydown', data);
  }

  useEffect(() => {
    document.addEventListener("keydown", keydown);
  }, [])

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
