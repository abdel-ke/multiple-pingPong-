import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'Socket.io'
import { SetPlayerDto } from './dto/SetPlayer.dto';

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
    console.log("SetPlayerDto ", setPlayerDto);
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
  @SubscribeMessage('JoinMatchServer')
  JoinMatchServer(
    @MessageBody() setPlayerDto: SetPlayerDto,
    @ConnectedSocket() client: Socket
  ) {
    console.log("SetPlayerDto ", setPlayerDto);
    const resp = this.gameService.setPlayer(setPlayerDto, client.id);
    // if (resp.status === 'first player') {
    //   return 'first player';
    // }
    // else {
    //   this.server.to(resp.match.playerOne.socketId).emit('JoinMatch', resp.match);
    //   this.server.to(resp.match.playerTwo.socketId).emit('JoinMatch', resp.match);
    //   return resp.match;
    // }
   
  }
}
