import { Injectable } from '@angular/core';
import { LogEntry } from 'src/app/_models/logentry';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import LogPublisherConfigTypes from 'src/assets/log-publishers.json';
import { ReturnValue } from 'src/app/_models/commoncore';
import { LogLevel } from 'src/app/_models/logConfig';

@Injectable({
  providedIn: 'root'
})

export class LogPublishersService {
  publishers: LogPublisher[];

  constructor(private http: HttpClient) {
    this.publishers = [];
    // Build publishers arrays
    this.buildPublishers();
  }

  buildPublishers(): void {
    let logPub: LogPublisher;
    for (const pub of environment.logPublisherConfigTypes.filter(p => p.isActive)) {
      switch (pub.loggerName.toLowerCase()) {
        case 'console':
          logPub = new LogConsole();
          break;
        case 'localstorage':
          logPub = new LogLocalStorage();
          break;
        case 'webapi':
          logPub = new LogWebApi(this.http);
          break;
      }
      // Set location of logging
      // logPub.location = pub.loggerLocation;
      logPub.logLevel = pub.logLevel;
      // Add publisher to array
      this.publishers.push(logPub);
    }
  }
}

export abstract class LogPublisher {
  location: string;
  logLevel: LogLevel[];
  abstract log(record: LogEntry);
  abstract clear();
}

export class LogConsole extends LogPublisher {
  log(entry: LogEntry) {
    // Log to console
    console.log(entry.buildLogString());
  }
  clear() {
    console.clear();
  }
}

export class LogLocalStorage
  extends LogPublisher {
  constructor() {
    // Must call super() from derived classes
    super();
    // Set location
    // this.location = "logging";
  }

  // Append log entry to local storage
  log(entry: LogEntry) {
    let ret = false;
    let values: LogEntry[];

    try {
      // Get previous values from local storage
      values = JSON.parse(
        localStorage.getItem(this.location))
        || [];
      // Add new log entry to array
      values.push(entry);
      // Store array into local storage
      localStorage.setItem(this.location,
        JSON.stringify(values));

      // Set return value
      ret = true;
    } catch (ex) {
      // Display error in console
      console.log(ex);
    }
  }

  // Clear all log entries from local storage
  clear() {
    localStorage.removeItem(this.location);
  }
}

export class LogWebApi extends LogPublisher {
  /**
   * Env key of alphas service-Used to fetch the session data
   */
  private envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';

  constructor(private http: HttpClient) {
    // Must call super() from derived classes
    super();
    // Set location
    // this.location = "/api/log";
  }

  /**
   * Inserts Log Entry
   * @param data LogEntry Model
   * @returns ReturnValue for Status
   */
  log(data: LogEntry) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(environment.serviceUrl + 'CommonCore/' + 'AngularLog',
      body, { headers: this.getHttpOptions() });
  }

  clear() {

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


