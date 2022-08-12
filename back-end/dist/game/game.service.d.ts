import { SetPlayerDto } from './dto/SetPlayer.dto';
import { Match } from './entities/game.entity';
export declare class GameService {
    matches: Match[];
    setPlayer(setPlayerDto: SetPlayerDto, clientId: string): {
        status: string;
        match?: undefined;
    } | {
        status: string;
        match: Match;
    };
}
