import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
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
      this.config.get<string>('radio.xmltvrefresh') as string
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

      let name: string = 'EPG Refresh ' + hour.padStart(2, '0') + ':05:00';
      try {
        this.schedulerRegistry.deleteCronJob(name);
      } catch (err) {
        this.log.warn('Job not found.');
      }
      try {
        this.schedulerRegistry.addCronJob(name, job);
        job.start();
      } catch (err) {
        this.log.error('Error adding job ' + name, err);
      }
    });
  }
}
