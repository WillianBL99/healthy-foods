import { CronJob } from 'cron';
import { transferPorductsToDatabase } from './downloadProductsServer';

export class DatabaseUpdateRoutine {
  hours: number | undefined;
  minutes: number | undefined;
  seconds: number | undefined;

  constructor(hours: number, minutes: number, seconds: number) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  public start() {
    new CronJob(
      `${this.seconds} ${this.minutes} ${this.hours} * * *`,
      () => {
        console.log('Starting database update routine');
        this.updateDatabase();
      },
      null,
      true,
      'America/Sao_Paulo',
      -3
    );
  }

  private async updateDatabase() {
    await transferPorductsToDatabase();
  }
}
