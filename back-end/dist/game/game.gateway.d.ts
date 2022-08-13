import { GameService } from './game.service';
import { Server, Socket } from 'Socket.io';
import { SetPlayerDto } from './dto/SetPlayer.dto';
import { Match } from './entities/game.entity';
export declare class GameGateway {
    private readonly gameService;
    server: Server;
    constructor(gameService: GameService);
    setInitPlayer(setPlayerDto: SetPlayerDto, client: Socket): Match | "first player";
    updateGame(id: number): Match;
    updateplayers(match: Match): void;
}
