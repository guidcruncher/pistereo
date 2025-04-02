import { Test, TestingModule } from '@nestjs/testing';
import { StreamerController } from './streamer.controller';

describe('StreamerController', () => {
  let controller: StreamerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreamerController],
    }).compile();

    controller = module.get<StreamerController>(StreamerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
