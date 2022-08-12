import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001/')

const Home: NextPage = () => {
  const canvasRef = useRef(null);
  const canvWidth = 600;
  const canvHeight = 400;

  const [user, setUser] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    score: number;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: "",
    score: 0,
  })

  const [com, setCom] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    score: number;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: "",
    score: 13,
  })

  const [ball, setBall] = useState<{
    x: number;
    y: number;
    radius: number;
    speed: number;
    velocityX: number;
    velocityY: number;
    color: string
  }>({
    x: 0,
    y: 0,
    radius: 0,
    speed: 0,
    velocityX: 0,
    velocityY: 0,
    color: ""
  })

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
  const [typedMatchId, setTypedMatchId] = useState("");
  const [joined, setJoined] = useState(false)
  const [started, setStarted] = useState(false)
  const [players, setPlayers] = useState({ p1: "", p2: "" });
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

    socket.on('JoinMatch', (match) => {
      console.log('---match:', match);
      setStarted(false)
      setJoined(true);
      setUmatch(match);
    })

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
      console.log('---Umatch:', Umatch);
  }, [Umatch]);

  const sendName = (e: any) => {
    e.preventDefault();
    // generate a random match id
    const matchId = typedMatchId ? parseInt(typedMatchId) : Math.floor(Math.random() * 1000000);
    socket.emit('createGame', { matchId, name: name }, (ret: any) => {
      console.log('ret:', ret);
      if (ret?.playerTwo?.socketId) {
        setMatchId(matchId);
        setJoined(true);
      }
      else {
        setMatchId(matchId);
        setStarted(true);
      }
    });
  }

  // PAGE GAME

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
        
        console.log("----------Bara", Umatch);
        if (Umatch?.playerOne || Umatch?.playerTwo) {
          drawText(ctx, Umatch.playerOne.score.toString(), canvWidth / 4, canvHeight / 5, "white");
          // drawText(ctx, com.score.toString(), 3 * canvWidth / 4, canvHeight / 5, "white");
          drawText(ctx, Umatch.playerTwo.score.toString(), 3 * canvWidth / 4, canvHeight / 5, "white");
        // draw the user & computer paddle

          drawRect(ctx, Umatch.playerOne.x, Umatch.playerOne.y, Umatch.playerOne.width, Umatch.playerOne.height, Umatch.playerOne.color);
          drawRect(ctx, Umatch.playerTwo.x, Umatch.playerTwo.y, Umatch.playerTwo.width, Umatch.playerTwo.height, Umatch.playerTwo.color);
          // //draw the ball
          drawCircle(ctx, Umatch.ball.x, Umatch.ball.y, Umatch.ball.radius, Umatch.ball.color);
          console.log("-------------sroooow");
        }
        // drawRect(ctx, user.x, user.y, user.width, user.height, user.color);
        // drawRect(ctx, com.x, com.y, com.width, com.height, com.color);
        // // //draw the ball
        // drawCircle(ctx, ball.x, ball.y, ball.radius, ball.color);
        /*          UPDATE         */
        // if (ball.x - ball.radius < 0) {
        //   com.score++;
        //   resetBall();
        //   socket.emit('resetBall', ball);
        //   socket.emit('updateCom', com);
        // }
        // else if (ball.x + ball.radius > canvas.width) {
        //   user.score++;
        //   resetBall();
        //   socket.emit('resetBall', ball);
        //   socket.emit('updateUser', user);
        // }

        // // the ball has a velocity
        // ball.x += ball.velocityX;
        // ball.y += ball.velocityY;
        // // setball({...ball, x: ball.x + ball.velocityX});
        // // setball({...ball, y: ball.y + ball.velocityY});
        // // computer plays for itself, and we must be able to beat it
        // // sample AI to control the com paddle
        // com.y += (ball.y - (com.y + com.height / 2)) * 1;
        // // setCom({...com, y: com.y + (ball.y - (com.y + com.height / 2)) * 0.1});
        // // if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0)
        // if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height)
        //   // setball({...ball, velocityY: -ball.velocityY});
        //   ball.velocityY = -ball.velocityY;
        // let player = (ball.x + ball.radius < canvas.width / 2) ? user : com;
        // if (collision(ball, player)) {
        //   // where the ball hit the player
        //   let collidPoint = ball.y - (player.y + player.height / 2);
        //   // normalisation
        //   collidPoint /= player.height / 2;
        //   // calculate angle in radian
        //   let angleRad = collidPoint * (Math.PI / 4);
        //   // X direction of the ball when it's hit
        //   let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;

        //   // change vel X and Y
        //   ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        //   ball.velocityY = ball.speed * Math.sin(angleRad);
        //   // everytime the ball hit a paddle, we encrese its speed
        //   ball.speed += 0.1;
        //   // update the score;
        // }

        // console.log("back com: ", com);

        // socket.emit('updateCom', { com });
        // socket.emit('updateBall', { ball });
      }
    }, 1000 / 50);

    // document.addEventListener("keydown", (event) => {
    //   let toadd = 0;
    //   if (event.key === 'w' || event.key === 'W') {
    //     if (user.y <= 0)
    //       toadd = 0;
    //     else
    //       toadd -= 5;
    //   }
    //   else if (event.key === 's' || event.key === 's') {
    //     if (toadd + 100 >= canvHeight)
    //       toadd = canvHeight - 100;
    //     else
    //       toadd += 5;
    //   }
    //   startMoving(toadd);
    // });

    // function startMoving(toadd: any) {
    //   if (inter === undefined) {
    //     loop(toadd);
    //   }
    // }

    // function loop(toadd: any) {
    //   move(toadd);
    //   inter = setTimeout(loop, 1000 / 60, toadd);
    // }

    // function move(toadd: any) {
    //   user.y += toadd;
    //   if (user.y <= 0)
    //     user.y = 0;
    //   else if (user.y + 100 >= canvHeight)
    //     user.y = canvHeight - 100;
    //   socket.emit('updateUser', { user })
    // }

    // function stopMoving() {
    //   clearTimeout(inter);
    //   inter = undefined;
    // }

    // document.addEventListener("keyup", (event) => {
    // stopMoving();
    // });
    return () => clearInterval(interval);
  }, [Umatch])
  return (
    <div>
      {!started && !joined && <form className={`w-full  ${styles.cont}`} onSubmit={sendName}>
        <div className="flex items-center border-b border-teal-500 py-2">
          <input id='uname' value={name} onChange={(e) => setName(e.target.value)}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Write your name" aria-label="Full name" />
        </div>
        <div className="flex items-center border-b border-teal-500 py-2">
          <input value={typedMatchId} onChange={(e) => setTypedMatchId(e.target.value)}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Write match Id" aria-label="Full name" />
        </div>
        <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit" >
          Confirme
        </button>
      </form>
      }
      {started && <h1>Wait joining of the second player in the match number: {matchId}</h1>}
      {joined && <div>
        <div className={styles.names}><h1> {players.p1} </h1> <h1> {players.p2} </h1></div>
        <div>
          <canvas width={600} height={400} ref={canvasRef} style={{ border: "1px solid #c3c3c3" }}></canvas>
        </div>
        {/* <Link href="/"> GO HOME </Link> */}
        {/* <button onClick={deletNames}><Link href="/">d</Link>delet names</button> */}
      </div>
      }

    </div>
  );
}

export default Home
