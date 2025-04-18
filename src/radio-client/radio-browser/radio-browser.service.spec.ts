import { Test, TestingModule } from '@nestjs/testing';

import { RadioBrowserService } from './radio-browser.service';

describe('RadioBrowserService', () => {
  let service: RadioBrowserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RadioBrowserService],
    }).compile();

    service = module.get<RadioBrowserService>(RadioBrowserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
