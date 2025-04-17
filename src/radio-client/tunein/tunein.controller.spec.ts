import { Test, TestingModule } from '@nestjs/testing';
import { TuneinController } from './tunein.controller';

describe('TuneinController', () => {
  let controller: TuneinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TuneinController],
    }).compile();

    controller = module.get<TuneinController>(TuneinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
