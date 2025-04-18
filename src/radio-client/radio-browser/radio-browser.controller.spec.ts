import { Test, TestingModule } from '@nestjs/testing';

import { RadioBrowserController } from './radio-browser.controller';

describe('RadioBrowserController', () => {
  let controller: RadioBrowserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RadioBrowserController],
    }).compile();

    controller = module.get<RadioBrowserController>(RadioBrowserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
