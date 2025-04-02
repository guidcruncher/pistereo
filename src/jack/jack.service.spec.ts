import { Test, TestingModule } from '@nestjs/testing';
import { JackService } from './jack.service';

describe('JackService', () => {
  let service: JackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JackService],
    }).compile();

    service = module.get<JackService>(JackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
