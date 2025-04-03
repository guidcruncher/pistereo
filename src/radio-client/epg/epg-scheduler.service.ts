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
        this.log.debug(
          'Invoking job => EPG Refresh ' + hour.padStart(2, '0') + ':05:00',
        );
        this.epgService
          .downloadEpg()
          .then(() => {
            this.log.debug(
              'Finished job => EPG Refresh ' + hour.padStart(2, '0') + ':05:00',
            );
          })
          .catch((err) => {
            this.log.error(
              'Error in job => EPG Refresh ' + hour.padStart(2, '0') + ':05:00',
              err,
            );
          });
      });

      this.schedulerRegistry.addCronJob(
        'EPG Refresh ' + hour.padStart(2, '0') + ':05:00',
        job,
      );
      job.start();
    });
  }
}
