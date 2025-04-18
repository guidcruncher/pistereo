import { Test, TestingModule } from '@nestjs/testing';

import { EpgService } from './epg.service';

describe('EpgService', () => {
  let service: EpgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpgService],
    }).compile();

    service = module.get<EpgService>(EpgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
