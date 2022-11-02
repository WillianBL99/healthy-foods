import { describe, test, expect, beforeEach, vi } from 'vitest';
import { DatabaseUpdateRoutine } from '@/servers/databaseUpdateRoutine';

vi.mock('@/servers/downloadProductsServer', () => ({
  upadateDatabaseServer: vi.fn(async () => {
    return new Promise(() => 1);
  }),
}));

vi.mock('cron', () => {
  return {
    CronJob: class CronJob {
      constructor(
        public cronTime: string,
        public onTick: () => void,
        public onComplete: () => void,
        public startNow?: boolean,
        public timeZone?: string
      ) {
        onTick();
      }
    },
  };
});

describe('databaseUpdateRoutine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateDatabase', () => {
    test('when called start function, should call updateDatabase', async () => {
      vi.useRealTimers();
      const time = '02:55:00';
      const databaseUpdateRoutine = new DatabaseUpdateRoutine(time);
      const spyStart = vi.spyOn(databaseUpdateRoutine, 'start');

      databaseUpdateRoutine.start();

      expect(spyStart).toBeCalledTimes(1);
    });
  });
});
