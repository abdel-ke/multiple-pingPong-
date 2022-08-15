import { Test, TestingModule } from '@nestjs/testing';
import { GameTwoGateway } from './game-two.gateway';
import { GameTwoService } from './game-two.service';

describe('GameTwoGateway', () => {
  let gateway: GameTwoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameTwoGateway, GameTwoService],
    }).compile();

    gateway = module.get<GameTwoGateway>(GameTwoGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
