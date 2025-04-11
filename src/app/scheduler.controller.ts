import { Controller, Get, Logger, Post, Body, Req, Res } from '@nestjs/common';
import { Public } from '@auth/public.decorator';
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
