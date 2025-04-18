import { Test, TestingModule } from '@nestjs/testing';

import { JackController } from './jack.controller';

describe('JackController', () => {
  let controller: JackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JackController],
    }).compile();

    controller = module.get<JackController>(JackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
