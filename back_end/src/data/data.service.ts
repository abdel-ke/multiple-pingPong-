import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDatumDto } from './dto/create-datum.dto';
import { UpdateDatumDto } from './dto/update-datum.dto';

@Injectable()
export class DataService {
  constructor(private prisma: PrismaService) {}

  create(createDatumDto: CreateDatumDto) {
    return 'This action adds a new datum';
  }

  findAll() {
    // return `This action returns all data`;
    return this.prisma.match.findMany({
      select: {
        player_one_score: true,
        player_two_score: true,
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} datum`;
  }

  update(id: number, updateDatumDto: UpdateDatumDto) {
    return `This action updates a #${id} datum`;
  }

  remove(id: number) {
    return `This action removes a #${id} datum`;
  }
}
