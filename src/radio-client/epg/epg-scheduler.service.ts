import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { EpgService } from './epg.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EpgSchedulerService {
  private readonly log = new Logger(EpgSchedulerService.name);

  constructor(
    private readonly config: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly epgService: EpgService,
  ) {
    this.registerJobs();
  }

  public registerJobs() {
    let xmltvrefresh: string[] = (
      config.get<string>('radio.xmltvrefresh') as string
    ).split(',');
    xmltvrefresh.forEach((hour) => {
      const job = new CronJob(`0 5 ${hour} * * *`, () => {
        await this.epgService.downloadEpg();
      });

      this.schedulerRegistry.addCronJob(
        'EPG Refresh ' + hour.padStart(2, '0') + ':05:00',
        job,
      );
      job.start();
    });
  }
}
