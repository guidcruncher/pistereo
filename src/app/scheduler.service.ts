import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}
}
