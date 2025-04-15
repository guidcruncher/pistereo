import { Test, TestingModule } from '@nestjs/testing';
import { JackEqualiserService } from './jack-equaliser.service';

describe('JackEqualiserService', () => {
  let service: JackEqualiserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JackEqualiserService],
    }).compile();

    service = module.get<JackEqualiserService>(JackEqualiserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
