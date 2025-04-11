import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EpgSchedulerService } from '../radio-client/epg/epg-scheduler.service';

@Injectable()
export class SchedulerService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly epgSchedulerService: EpgSchedulerService,
  ) {}

  public runStartupJobs() {
    this.epgSchedulerService.runJob();
    // this.epgSchedulerService.runJobUuidRefresh();
  }

  public registerJobs() {
    this.epgSchedulerService.registerJobs(this.schedulerRegistry);
  }

  public getJob(name: string) {
    return this.schedulerRegistry.getCronJob(name);
  }

  public getCronJobs() {
    return this.schedulerRegistry.getCronJobs();
  }

  public listCronJobs() {
    const jobs = this.getCronJobs();
    let result: any[] = [] as any[];
    jobs.forEach((value, key, map) => {
      let next;
      let last;
      try {
        next = value.nextDate().toJSON();
      } catch (e) {
        next = '';
      }
      try {
        let v = value.lastDate();
        last = '';
        if (v) {
          last = v.toJSON();
        }
      } catch (e) {
        last = '';
      }
      result.push({ name: key, last: last, next: next });
    });

    return result.sort((a, b) => {
      return a.next - b.next;
    });
  }
}
