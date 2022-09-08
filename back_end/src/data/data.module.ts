import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DataController],
  providers: [DataService, PrismaService]
})
export class DataModule {}
