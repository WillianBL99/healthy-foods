import { mongoDb } from '@/config';
import { ResposneInformation } from '@/interfaces';
import { informationRepository } from '@/repositories/informationRepository';
import { getDateAndTime } from '@/utils/getDateAndTime';

async function getInformation() {
  const upTime = process.uptime();
  const dbTest = await mongoDb.connectionTest();
  const memoryUsage = process.memoryUsage();
  const information = await informationRepository.getLastInformation();

  const MINUTE = 60;
  const HOUR = MINUTE * 60;
  const apiUpTime = `${(upTime / HOUR).toFixed(0)}h ${(
    upTime / MINUTE
  ).toFixed(0)}m ${upTime.toFixed(0)}s`;

  let totalMemoryUsage = 0;
  for (const key in memoryUsage) {
    totalMemoryUsage += memoryUsage[key as keyof NodeJS.MemoryUsage];
  }

  const lastUpdate = information?.date ? getDateAndTime(information.date) : 'Never';

  const response: ResposneInformation = {
    lastUpdate, 
    upTime: apiUpTime,
    connection: dbTest?.connection ? 'Connected' : 'Disconnected',
    memoryUsage: `${(totalMemoryUsage / 1024000).toFixed(2)} MB`,
    databaseRead: dbTest?.read ? 'Available' : 'Unavailable',
    databaseWrite: dbTest?.write ? 'Available' : 'Unavailable',
  };

  return response;
}

const informationService = {
  getInformation,
};

export { informationService };
