import { Test, TestingModule } from '@nestjs/testing';
import { StreamerSocketService } from './streamer-socket.service';

describe('StreamerSocketService', () => {
  let service: StreamerSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamerSocketService],
    }).compile();

    service = module.get<StreamerSocketService>(StreamerSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
