import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [GameModule, DataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
