import { Test, TestingModule } from '@nestjs/testing';

import { LibrespotController } from './librespot.controller';

describe('LibrespotController', () => {
  let controller: LibrespotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrespotController],
    }).compile();

    controller = module.get<LibrespotController>(LibrespotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
