import { Test, TestingModule } from '@nestjs/testing';

import { JackListenerService } from './jack-listener.service';

describe('JackListenerService', () => {
  let service: JackListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JackListenerService],
    }).compile();

    service = module.get<JackListenerService>(JackListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
