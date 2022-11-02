import { informationRepository } from '@/repositories';
import { describe, expect, vi, beforeEach, test } from 'vitest';
import { informationFactory } from '@/../tests/factories/informationFactory';
import { informationService } from './informationServer';
import { mongoDb } from '@/config';

vi.mock('@/config', () => ({
  mongoDb: {
    connectionTest: vi.fn(async () => ({
      connection: true,
      read: true,
      write: true,
    })),
  },
}));

describe('informationServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getting information', () => {
    describe('if connection to database is available', () => {
      test('should return information with good database connection', async () => {
        const spyInformation = vi
          .spyOn(informationRepository, 'getLastInformation')
          .mockImplementationOnce(async () =>
            informationFactory.getInformation()
          );

        const information = await informationService.getInformation();

        expect(information).toBeTruthy();
        expect(spyInformation).toBeCalledTimes(1);
        expect(information?.connection).toBe('Connected');
        expect(information?.databaseRead).toBe('Available');
        expect(information?.databaseWrite).toBe('Available');
        expect(information.lastUpdate).not.toBeNull();
      });
    });

    describe('if connection to database is not available', () => {
      test('shold return a information with bad connection', async () => {
        const spyInformation = vi
          .spyOn(informationRepository, 'getLastInformation')
          .mockImplementationOnce(async () => Promise.resolve(null));

        mongoDb.connectionTest = vi.fn(async () => ({
          connection: false,
          read: false,
          write: false,
        }));

        const information = await informationService.getInformation();

        expect(information).toBeTruthy();
        expect(spyInformation).toBeCalledTimes(1);
        expect(information?.connection).toBe('Disconnected');
        expect(information?.databaseRead).toBe('Unavailable');
        expect(information?.databaseWrite).toBe('Unavailable');
        expect(information?.lastUpdate).toBe('Never');
      });
    });
  });
});
