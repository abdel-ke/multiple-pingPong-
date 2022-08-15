import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { GameTwoModule } from './game-two/game-two.module';

@Module({
  imports: [GameModule, GameTwoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
