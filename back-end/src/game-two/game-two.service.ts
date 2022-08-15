import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { FRAMERATE } from './constants';
import { canvasHeight, canvasWidth } from './constants';


@Injectable()
export class GameTwoService {
    constructor() { }
    createGameState() {
        return {
            playerOne: {
                x: 0,
                y: (canvasWidth - 100) / 2,
                width: 10,
                height: 100,
                color: 'white',
                score: 0,
            },
            playerTwo: {
                x: canvasWidth - 10,
                y: (canvasHeight - 100) / 2,
                width: 10,
                height: 100,
                color: 'white',
                score: 0,
            },
            ball: {
                x: canvasWidth / 2,
                y: canvasHeight / 2,
                radius: 10,
                speed: 7,
                velocityX: 7,
                velocityY: 7,
                color: "white"
            }
        }
    }

    hasCollision(ball: any, player: any) {
        return ball.x + ball.radius > player.x &&
            ball.x - ball.radius < player.x + player.width &&
            ball.y + ball.radius > player.y &&
            ball.y - ball.radius < player.y + player.height;
    }

    collision(b: any, p: any) {
        p.top = p.y;
        p.bottom = p.y + p.height;
        p.left = p.x;
        p.right = p.x + p.width;

        b.top = b.y - b.radius;
        b.bottom = b.y + b.radius;
        b.left = b.x - b.radius;
        b.right = b.x + b.radius;

        return (b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom);
    }

    resetBall(state: any) {
        state.ball.x = canvasWidth / 2;
        state.ball.y = canvasHeight / 2;
        state.ball.speed = 7;
        state.ball.velocityX = -state.ball.velocityX;
    }

    gameloop(state: any) {
        if (!state)
            return;
        const playerOne = state.playerOne;
        const playerTwo = state.playerTwo;
        const ball = state.ball;
        
        if (ball.x - ball.radius < 0) {
            playerTwo.score++;
            this.resetBall(state);
          }
          else if (ball.x + ball.radius > canvasWidth) {
            playerOne.score++;
            this.resetBall(state);
          }
      
          // the ball has a velocity
          ball.x += ball.velocityX;
          ball.y += ball.velocityY;
          // setball({...ball, x: ball.x + ball.velocityX});
          // setball({...ball, y: ball.y + ball.velocityY});
          // computer plays for itself, and we must be able to beat it
          // sample AI to control the com paddle
          playerTwo.y += (ball.y - (playerTwo.y + playerTwo.height / 2)) * 1;
          // setCom({...com, y: com.y + (ball.y - (com.y + com.height / 2)) * 0.1});
          // if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0)
          if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvasHeight)
            // setball({...ball, velocityY: -ball.velocityY});
            ball.velocityY = -ball.velocityY;
          let player = (ball.x + ball.radius < canvasWidth / 2) ? playerOne : playerTwo;
          if (this.collision(ball, player)) {
            // where the ball hit the player
            let collidPoint = ball.y - (player.y + player.height / 2);
            // normalisation
            collidPoint /= player.height / 2;
            // calculate angle in radian
            let angleRad = collidPoint * (Math.PI / 4);
            // X direction of the ball when it's hit
            let direction = (ball.x + ball.radius < canvasWidth / 2) ? 1 : -1;
      
            // change vel X and Y
            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = ball.speed * Math.sin(angleRad);
            // everytime the ball hit a paddle, we encrese its speed
            ball.speed += 0.1;
            // update the score;
          }

        // playerOne win
        if (playerOne.score == 10) {
            playerOne.score = 0;
            playerTwo.score = 0;
            ball.x = canvasWidth / 2;
            ball.y = canvasHeight / 2;
            ball.velocityX = 7;
            ball.velocityY = 7;
            return 1;
        }
        // playerTwo win
        if (playerTwo.score == 10) {
            playerOne.score = 0;
            playerTwo.score = 0;
            ball.x = canvasWidth / 2;
            ball.y = canvasHeight / 2;
            ball.velocityX = -7;
            ball.velocityY = 7;
            return 2;
        }
        return false;
    }

    startGameInterval(clinet: Socket, state: any) {
        // playerOne win return 1 && playerTwo win return 2
        const interval = setInterval(() => {
            const winner = this.gameloop(state);
            if (!winner) {
                clinet.emit('gameState', JSON.stringify(state));
            }
            else {
                clinet.emit('gameOver');
                clearInterval(interval);
            }
        }, 1000 / FRAMERATE);
    }
}
