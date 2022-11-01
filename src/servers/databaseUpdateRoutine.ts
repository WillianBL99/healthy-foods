import { CronJob } from 'cron';
import { upadateDatabaseServer } from '@/servers/downloadProductsServer';

export class DatabaseUpdateRoutine {
  hours: number | undefined;
  minutes: number | undefined;
  seconds: number | undefined;

  constructor(time: string) {
    const [hours, minutes, seconds] = time.split(':');
    this.hours = parseInt(hours);
    this.minutes = parseInt(minutes);
    this.seconds = parseInt(seconds);
  }

  public start() {
    new CronJob(
      `${this.seconds} ${this.minutes} ${this.hours} * * *`,
      async () => {
        console.log('Starting database update routine');
        console.time('download');
        await this.updateDatabase();
        console.timeEnd('download');
      },
      null,
      true,
      'America/Sao_Paulo',
      -3
    );
  }

  private async updateDatabase() {
    await upadateDatabaseServer();
  }
}
