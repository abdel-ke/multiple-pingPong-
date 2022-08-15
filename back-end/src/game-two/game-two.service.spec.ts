import { Test, TestingModule } from '@nestjs/testing';
import { GameTwoService } from './game-two.service';

describe('GameTwoService', () => {
  let service: GameTwoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameTwoService],
    }).compile();

    service = module.get<GameTwoService>(GameTwoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
