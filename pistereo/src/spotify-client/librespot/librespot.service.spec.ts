import { Test, TestingModule } from '@nestjs/testing';
import { LibrespotService } from './librespot.service';

describe('LibrespotService', () => {
  let service: LibrespotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibrespotService],
    }).compile();

    service = module.get<LibrespotService>(LibrespotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
