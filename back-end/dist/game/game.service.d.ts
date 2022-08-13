import { SetPlayerDto } from './dto/SetPlayer.dto';
import { Match } from './entities/game.entity';
export declare class GameService {
    matches: Match[];
    canvWidth: number;
    canvheight: number;
    setPlayer(setPlayerDto: SetPlayerDto, clientId: string): {
        status: string;
        match?: undefined;
    } | {
        status: string;
        match: Match;
    };
    collision(b: any, p: any): boolean;
    resetBall(id: number): void;
    update(id: number): Match;
    updateMovement(movement: any): Match;
}
