import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
export declare class GameGateway {
    private readonly gameService;
    server: Server;
    constructor(gameService: GameService);
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleKeyDown(keyCode: number, client: Socket): void;
    handleNewGame(client: Socket, name: string): void;
    handleJoinGame(data: any, client: Socket): void;
    handleSpectateGame(gameCode: string, client: Socket): void;
    handleTestGame(client: Socket): void;
}
