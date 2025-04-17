import { Test, TestingModule } from '@nestjs/testing';
import { TuneinService } from './tunein.service';

describe('TuneinService', () => {
  let service: TuneinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TuneinService],
    }).compile();

    service = module.get<TuneinService>(TuneinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
