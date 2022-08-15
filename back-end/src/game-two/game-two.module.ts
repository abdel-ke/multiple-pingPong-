import { Module } from '@nestjs/common';
import { GameTwoService } from './game-two.service';
import { GameTwoGateway } from './game-two.gateway';
import { Game } from './game';
// import { canvasHeight } from './constants';

@Module({
  providers: [GameTwoGateway, GameTwoService, Game],
})
export class GameTwoModule {}
