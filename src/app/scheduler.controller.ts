import { Public } from '@auth/public.decorator';
import { Controller, Get } from '@nestjs/common';

import { SchedulerService } from './scheduler.service';

@Public()
@Controller('/api/scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Get()
  public listCronJobs() {
    return this.schedulerService.listCronJobs();
  }
}
