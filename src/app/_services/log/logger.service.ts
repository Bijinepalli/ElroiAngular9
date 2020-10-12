import { Injectable } from '@angular/core';
import { LogEntry } from 'src/app/_models/logentry';
import { LogPublishersService, LogPublisher, LogWebApi, LogConsole } from './log-publishers.service';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LogLevel } from 'src/app/_models/logConfig';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  // level: LogLevel[] = [LogLevel.All];
  level: LogLevel = LogLevel.All;
  logWithDate: boolean;
  publishers: LogPublisher[];

  constructor(private http: HttpClient,
    private publishersService: LogPublishersService) {
    this.level = environment.logLevel;
    this.publishers = this.publishersService.publishers;
  }

  debug(componentName: string, methodName: string, message: string, ...optionalParams: any[]) {
    this.writeToLog(componentName, methodName, message, LogLevel.Debug, optionalParams);
  }

  info(componentName: string, methodName: string, message: string, ...optionalParams: any[]) {
    this.writeToLog(componentName, methodName, message, LogLevel.Info, optionalParams);
  }

  warn(componentName: string, methodName: string, message: string, ...optionalParams: any[]) {
    this.writeToLog(componentName, methodName, message, LogLevel.Warn, optionalParams);
  }

  error(componentName: string, methodName: string, message: string, ...optionalParams: any[]) {
    this.writeToLog(componentName, methodName, message, LogLevel.Error, optionalParams);
  }

  fatal(componentName: string, methodName: string, message: string, ...optionalParams: any[]) {
    this.writeToLog(componentName, methodName, message, LogLevel.Fatal, optionalParams);
  }

  log(componentName: string, methodName: string, message: string, ...optionalParams: any[]) {
    this.writeToLog(componentName, methodName, message, LogLevel.All, optionalParams);
  }

  private writeToLog(componentName: string, methodName: string, message: string,
    level: LogLevel,
    params: any[]) {
    if (this.shouldLog(level)) {
      const entry: LogEntry = new LogEntry();
      entry.componentName = componentName;
      entry.methodName = methodName;
      entry.message = message;
      entry.level = level;
      entry.extraInfo = params;
      // entry.logWithDate = this.logWithDate;
      for (const logger of this.publishers) {
        if (logger.logLevel.includes(level) ||
          logger.logLevel.includes(LogLevel.All)) {
          if (logger instanceof LogWebApi) {
            if ((navigator.onLine)) {
              logger.log(entry).subscribe();
            }
          } else {
            logger.log(entry);
            // if (logger instanceof LogConsole) {
            //  if (level === LogLevel.Debug) {
            //    logger.log(entry);
            //  }
            // } else {
            //   logger.log(entry);
            // }
          }
        }
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    let ret = false;
    // if ((this.level.includes(level) &&
    //  level !== LogLevel.Off) ||
    //  this.level.includes(LogLevel.All)) {
    //  ret = true;
    // }
    if ((level >= this.level &&
      level !== LogLevel.Off) ||
      this.level === LogLevel.All) {
      ret = true;
    }
    return ret;
  }

  /**
   * Inserts Log Entry
   * @param data LogEntry Model
   * @returns ReturnValue for Status
   */
  angularLog(data: LogEntry) {
    const body = JSON.stringify(data);
    return this.http.post<any>(environment.serviceUrl + 'CommonCore/' + 'AngularLog',
      body, { headers: this.getHttpOptions() });
  }

  /**
   * Gets http options
   * @returns  HttpHeaders with content-type,authorization jwt token
   */
  getHttpOptions() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'Bearer ' + sessionStorage.getItem(this.envKey + 'jwtloginToken'),
      // // appRegion: 'Test'
      // applicationSettings: sessionStorage.getItem(this.envKey + 'applicationSettings')
    });
  }

}
