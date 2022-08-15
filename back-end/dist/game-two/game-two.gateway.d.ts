import { GameTwoService } from './game-two.service';
import { Server, Socket } from 'socket.io';
import { Game } from './game';
export declare class GameTwoGateway {
    private readonly gameTwoService;
    server: Server;
    constructor(gameTwoService: GameTwoService);
    game: Game;
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
