import { PrismaService } from 'src/prisma.service';
import { CreateDatumDto } from './dto/create-datum.dto';
import { UpdateDatumDto } from './dto/update-datum.dto';
export declare class DataService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDatumDto: CreateDatumDto): string;
    findAll(): import(".prisma/client").PrismaPromise<{
        player_one_score: number;
        player_two_score: number;
    }[]>;
    findOne(id: number): string;
    update(id: number, updateDatumDto: UpdateDatumDto): string;
    remove(id: number): string;
}
