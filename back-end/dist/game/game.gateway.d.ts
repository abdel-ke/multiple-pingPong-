import { GameService } from './game.service';
import { Server, Socket } from 'Socket.io';
import { SetPlayerDto } from './dto/SetPlayer.dto';
export declare class GameGateway {
    private readonly gameService;
    server: Server;
    constructor(gameService: GameService);
    setInitPlayer(setPlayerDto: SetPlayerDto, client: Socket): "first player" | import("./entities/game.entity").Match;
    JoinMatchServer(setPlayerDto: SetPlayerDto, client: Socket): void;
}
