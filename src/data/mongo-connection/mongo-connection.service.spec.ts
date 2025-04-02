import { Test, TestingModule } from '@nestjs/testing';
import { MongoConnectionService } from './mongo-connection.service';

describe('MongoConnectionService', () => {
  let service: MongoConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoConnectionService],
    }).compile();

    service = module.get<MongoConnectionService>(MongoConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
