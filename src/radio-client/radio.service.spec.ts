import { Test, TestingModule } from '@nestjs/testing';
import { RadioService } from './radio.service';

describe('RadioService', () => {
  let service: RadioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RadioService],
    }).compile();

    service = module.get<RadioService>(RadioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
