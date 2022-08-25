import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GameTwoService } from './game-two.service';
import { Server, Socket } from 'socket.io';
import { canvasHeight, canvasWidth } from './constants';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameTwoGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly gameTwoService: GameTwoService) { }

  afterInit() {
    console.log('Websocket Server Started,Listening on Port:3000');
  }

  handleConnection(client: Socket) {
    // this.gameTwoService.state = this.gameTwoService.createGameState();
    // client.on('keyDown', keyCode => {
    //   const ret = this.gameTwoService.handleKeyDown(keyCode);
    //   this.gameTwoService.updatePlayer(client, state, ret);
    // });
    // client.on('newGame', this.gameTwoService.handleNewGame);
    // this.gameTwoService.startGameInterval(client, state);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('keyDown')
  handleKeyDown(
    @MessageBody() keyCode: number,
    @ConnectedSocket() client: Socket
    ) {
      const ret = this.gameTwoService.handleKeyDown(keyCode);
      this.gameTwoService.updatePlayer(client, this.gameTwoService.state, ret);
  }

  @SubscribeMessage('newGame')
  handleNewGame(@ConnectedSocket() client: Socket){
    this.gameTwoService.handleNewGame(client);
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(@MessageBody() gameCode: string, @ConnectedSocket() client: Socket){
    this.gameTwoService.handleJoinGame(this.server, client, gameCode);
  }

  @SubscribeMessage('canvaSize')
  handleCanvaSize(@MessageBody() data: any){
    this.gameTwoService.handleCanvaSize(data.width, data.height)
  }
}
