import { Injectable } from '@nestjs/common';
import { SetPlayerDto } from './dto/SetPlayer.dto';
import { Match } from './entities/game.entity';

@Injectable()
export class GameService {
  matches: Match[] = [];
  canvWidth = 600;
  canvheight = 400;

  setPlayer(setPlayerDto: SetPlayerDto, clientId: string) {
    const { matchId, name } = setPlayerDto;
    const match = this.matches.find(m => m.id === matchId);

    // check macthId if exist
    if (!match) {
      const newMatch = {
        id: matchId,
        playerOne: {
          socketId: clientId,
          name,
          x: 0,
          y: (this.canvheight - 100) / 2,
          width: 10,
          height: 100,
          color: 'white',
          score: 1337,
        },
        playerTwo: {
          socketId: null,
          name: null,
          x: this.canvWidth - 10,
          y: (this.canvheight - 100) / 2,
          width: 10,
          height: 100,
          color: 'white',
          score: 220,
        },
        ball: {
          x: this.canvWidth / 2,
          y: this.canvheight / 2,
          radius: 10,
          speed: 7,
          velocityX: 7,
          velocityY: 7,
          color: 'white',
        },
      }
      this.matches.push(newMatch);
      return {
        status: 'first player',
      }
    }
    else {
      match.playerTwo.socketId = clientId;
      match.playerTwo.name = name;
      return {
        status: 'second player',
        match,
      }
    }
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

  resetBall(id: number) {
    const match = this.matches.find(m => m.id === id);
    if (match.id === id) {
      match.ball.x = this.canvWidth / 2;
      match.ball.y = this.canvheight / 2;
      match.ball.speed = 7;
      match.ball.velocityX = -match.ball.velocityX;
    }
  }

  update(id: number) {
    const match = this.matches.find(m => m.id === id);
    if (match.id === id) {
      if (match.ball.x - match.ball.radius < 0) {
        match.playerTwo.score++;
        this.resetBall(id);
      }
      else if (match.ball.x + match.ball.radius > this.canvWidth) {
        match.playerOne.score++;
        this.resetBall(id);
      }
      // the ball has a velocity
      match.ball.x += match.ball.velocityX;
      match.ball.y += match.ball.velocityY;
      // computer plays for itself, and we must be able to beat it
      // sample AI to control the com paddle
      match.playerTwo.y += (match.ball.y - (match.playerTwo.y + match.playerTwo.height / 2)) * 1;
      if (match.ball.y - match.ball.radius < 0 || match.ball.y + match.ball.radius > this.canvheight) {
        match.ball.velocityY = -match.ball.velocityY;
      }

      let player = (match.ball.x + match.ball.radius < this.canvWidth / 2) ? match.playerOne : match.playerTwo;
      if (this.collision(match.ball, player)) {
        // where the match.ball hit the player
        let collidPoint = match.ball.y - (player.y + player.height / 2);
        // normalisation
        collidPoint /= player.height / 2;
        // calculate angle in radian
        let angleRad = collidPoint * (Math.PI / 4);
        // X direction of the ball when it's hit
        let direction = (match.ball.x + match.ball.radius < this.canvWidth / 2) ? 1 : -1;

        // change vel X and Y
        match.ball.velocityX = direction * match.ball.speed * Math.cos(angleRad);
        match.ball.velocityY = match.ball.speed * Math.sin(angleRad);
        // everytime the ball hit a paddle, we encrese its speed
        match.ball.speed += 0.1;
        // update the score;
      }
      return match;
    }
  }
}
