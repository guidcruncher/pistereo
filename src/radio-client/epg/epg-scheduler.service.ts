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
    private readonly epgService: EpgService,
  ) {}

  public registerJobs(schedulerRegistry: SchedulerRegistry) {
    const xmltvrefresh: string[] = (
      this.config.get<string>('radio.xmltvrefresh') as string
    ).split(',');
    xmltvrefresh.forEach((hour) => {
      const job = new CronJob(`0 5 ${hour} * * *`, () => {
        this.log.debug(
          'Invoking job EPG Refresh ' + hour.padStart(2, '0') + ':05:00',
        );
        this.runJob()
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

      const name: string = 'EPG Refresh ' + hour.padStart(2, '0') + ':05:00';
      try {
        schedulerRegistry.deleteCronJob(name);
      } catch (err) {
        this.log.warn('Job not found.');
      }
      try {
        schedulerRegistry.addCronJob(name, job);
        job.start();
      } catch (err) {
        this.log.error('Error adding job ' + name, err);
      }
    });
  }

  async runJobUuidRefresh() {
    try {
      this.log.debug('Starting EPG Job with UUID Refresh');
      await this.epgService.executeScheduleJobWithStationCheck();
      this.log.debug('Finished EPG Job with UUID Refresh');
    } catch (err) {
      this.log.error('Error invoking EPG Job with UUID Refresh', err);
    }
  }

  async runJob() {
    try {
      this.log.debug('Starting EPG Job');
      await this.epgService.executeScheduleJob();
      this.log.debug('Finished EPG Job');
    } catch (err) {
      this.log.error('Error invoking EPG Job', err);
    }
  }
}
