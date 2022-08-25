import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io'
import { SetPlayerDto } from './dto/SetPlayer.dto';
import { setInterval } from 'timers/promises';
import { Match } from './entities/game.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly gameService: GameService) { }
  
  @SubscribeMessage('createGame')
  setInitPlayer(
    @MessageBody() setPlayerDto: SetPlayerDto,
    @ConnectedSocket() client: Socket
  ) {
    // console.log("SetPlayerDto ", setPlayerDto);
    const resp = this.gameService.setPlayer(setPlayerDto, client.id);
    client.join(setPlayerDto.matchId.toString());

    if (resp.status === 'first player') {
      return 'first player';
    }
    else {
      this.server.to(resp.match.id.toString()).emit('JoinMatch', resp.match);
      return resp.match;
      // this.server.to(resp.match.playerOne.socketId).emit('JoinMatch', resp.match);
      // this.server.to(resp.match.playerTwo.socketId).emit('JoinMatch', resp.match);
    }
  }
  @SubscribeMessage('updateGame')
  updateGame(@MessageBody() id: number) {
    // console.log("updateGame ", id);
    return this.gameService.update(id);
  }

  @SubscribeMessage('updateplayers')
  updateplayers(@MessageBody() match: Match) {
    this.gameService.updateMovement(match);
  }

  // @SubscribeMessage('keydown')
  // keydown(@MessageBody() data: any) {
  //   // console.log("id : ", data.id);
  //   // console.log("key: ", data.key);
    
  //   this.gameService.keydown(data);
  // }
}
