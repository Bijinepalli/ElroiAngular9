import { LogLevel } from 'src/app/_models/logConfig';

export const environment = {
  production: true,
  appName: 'ELROI',
  envName: 'PROD',
  serviceUrl: 'http://172.16.32.57/TimeSystemService/',
  authUrl: 'http://172.16.32.67/ElroiWebAPI/api/',
  folderMgmtURL: 'http://172.16.32.240/ElroiService/',
  portfolioURL: 'http://172.16.32.240/ElroiWebApiSerivce/',
  // logLevel: [LogLevel.Debug],
  logLevel: LogLevel.Debug,
  logPublisherConfigTypes: [
    {
      loggerName: 'console',
      loggerLocation: 'console',
      logLevel: [LogLevel.Debug, LogLevel.Error],
      isActive: false
    },
    {
      loggerName: 'localstorage',
      loggerLocation: 'errorLogging',
      logLevel: [LogLevel.All],
      isActive: false
    },
    {
      loggerName: 'webapi',
      loggerLocation: '/api/log',
      logLevel: [LogLevel.All],
      isActive: true
    }
  ],
};
