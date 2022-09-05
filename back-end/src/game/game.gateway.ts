import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly gameService: GameService) { }

  afterInit() {
    console.log('Websocket Server Started,Listening on Port:3000');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`, " length: ", this.server.engine.clientsCount, "  server:   ", Object.keys(this.server.sockets).length);
    // this.gameService.state = this.gameService.createGameState();
    // client.on('keyDown', keyCode => {
    //   const ret = this.gameService.handleKeyDown(keyCode);
    //   this.gameService.updatePlayer(client, state, ret);
    // });
    // client.on('newGame', this.gameService.handleNewGame);
    // this.gameService.startGameInterval(client, state);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const roomName = this.gameService.clientRooms[client.id];
    if (roomName) {
      this.gameService.gameActive = false;
      if (client.id === this.gameService.state[roomName].playerOne.id)
        this.gameService.playerDisconnected = 1;
      else if (client.id === this.gameService.state[roomName].playerTwo.id)
        this.gameService.playerDisconnected = 2;
    }
  }

  @SubscribeMessage('keyDown')
  handleKeyDown(
    @MessageBody() keyCode: number,
    @ConnectedSocket() client: Socket
  ) {
    const ret = this.gameService.handleKeyDown(keyCode);
    this.gameService.updatePlayer(client, this.gameService.state, ret);
  }

  @SubscribeMessage('newGame')
  handleNewGame(@ConnectedSocket() client: Socket, @MessageBody() name: string) {
    this.gameService.handleNewGame(client, name);
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.gameService.handleJoinGame(this.server, client, data.gameCode, data.name);
  }

  @SubscribeMessage('spectateGame')
  handleSpectateGame(@MessageBody() gameCode: string, @ConnectedSocket() client: Socket) {
    this.gameService.handleSpectateGame(this.server, client, gameCode);
  }

  // @SubscribeMessage('canvaSize')
  // handleCanvaSize(@MessageBody() data: any) {
  //   this.gameService.handleCanvaSize(data.width, data.height)
  // }
}
