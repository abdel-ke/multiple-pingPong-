import { Injectable } from '@nestjs/common';
import { SetPlayerDto } from './dto/SetPlayer.dto';
import { Match } from './entities/game.entity';

@Injectable()
export class GameService {
  matches: Match[] = [];
  
  setPlayer(setPlayerDto: SetPlayerDto, clientId: string) {
    const { matchId, name } = setPlayerDto;
    const match = this.matches.find(m => m.id === matchId);
    const canvWidth = 600;
    const canvheight = 400;
    // check macthId if exist
    if (!match) {
      const newMatch = {
        id: matchId,
        playerOne: {
          socketId: clientId,
          name,
          x: 0,
          y: (canvheight - 100) / 2,
          width: 10,
          height: 100,
          color: 'white',
          score: 1337,
        },
        playerTwo: {
          socketId: null,
          name: null,
          x: canvWidth - 10,
          y: (canvheight - 100) / 2,
          width: 10,
          height: 100,
          color: 'white',
          score: 220,
        },
        ball: {
          x: canvWidth / 2,
          y: canvheight / 2,
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
}
