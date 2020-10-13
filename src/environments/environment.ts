import { LogLevel } from './../app/_models/logConfig';
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appName: 'ELROI',
  envName: 'DEV',
  serviceUrl: 'http://172.16.32.240/ElroiWebAPI/api/',
  // serviceUrl: 'http://172.16.36.36/ElroiWebAPI/api/',
  // serviceUrl: 'https://localhost:44314/api/',
  // serviceUrl : 'http://172.16.32.96/ElroiWebApi/api/',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
