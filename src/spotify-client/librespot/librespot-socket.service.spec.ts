import { Test, TestingModule } from '@nestjs/testing';

import { LibrespotSocketService } from './librespot-socket.service';

describe('LibrespotSocketService', () => {
  let service: LibrespotSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibrespotSocketService],
    }).compile();

    service = module.get<LibrespotSocketService>(LibrespotSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
