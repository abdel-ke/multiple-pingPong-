import { DataService } from './data.service';
import { CreateDatumDto } from './dto/create-datum.dto';
import { UpdateDatumDto } from './dto/update-datum.dto';
export declare class DataController {
    private readonly dataService;
    constructor(dataService: DataService);
    create(createDatumDto: CreateDatumDto): string;
    findAll(): import(".prisma/client").PrismaPromise<{
        player_one_score: number;
        player_two_score: number;
    }[]>;
    findOne(id: string): string;
    update(id: string, updateDatumDto: UpdateDatumDto): string;
    remove(id: string): string;
}
