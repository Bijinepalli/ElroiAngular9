import { environment } from 'src/environments/environment';
import { LogLevel } from './logConfig';

export class LogEntry {
  // Public Properties
  entryDate: string = new Date().toLocaleString();
  componentName: string;
  methodName: string;
  message: string;
  level: LogLevel = LogLevel.Debug;
  extraInfo: any[] = [];
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string = sessionStorage.getItem(this.envKey.toString() + 'loginId') || '';

  buildLogString(): string {
    let ret: string;
    ret = 'Date: ' + this.entryDate + '\n';
    ret += 'Type: ' + LogLevel[this.level] + '\n';
    ret += 'Component: ' + this.componentName + '\n';
    ret += 'Method: ' + this.methodName + '\n';
    ret += 'Message: ' + this.message + '\n';
    if (this.extraInfo.length) {
      ret += 'Extra Info: '
        + this.formatParams(this.extraInfo) + '\n';
    }
    return ret;
  }

  private formatParams(params: any[]): string {
    let ret: string = params.join(',');

    // Is there at least one object in the array?
    if (params.some(p => typeof p === 'object')) {
      ret = '';
      // Build comma-delimited string
      for (const item of params) {
        ret += JSON.stringify(item) + ',' + '\t';
      }
    }

    return ret;
  }
}
