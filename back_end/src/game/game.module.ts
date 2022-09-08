import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PrismaService } from 'src/prisma.service';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [GameGateway, GameService, PrismaService, PrismaClient],
})
export class GameModule {}
