import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { InvalidDates, EmailAddress, RecentData, LogFiles, TickerCompanies } from 'src/app/_models/commoncore';
import { SelectItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CommoncoreService {
  private serviceURL = environment.serviceUrl + 'CommonCore/';
  private envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';

  constructor(
    private http: HttpClient,
  ) { }

  getHttpOptions() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem(this.envKey + 'jwtloginToken'),
      // appRegion: 'Test'
      applicationSettings: sessionStorage.getItem(this.envKey + 'applicationSettings')
    });
  }

  getHttpOptionsWithOutAuthnetication() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'Bearer ' + sessionStorage.getItem(this.envKey + 'jwtloginToken'),
      // appRegion: 'Test'
      // applicationSettings: sessionStorage.getItem(this.envKey + 'applicationSettings')
    });
  }

  updateModuleTrack(data) {
    const body = JSON.stringify(data);
    if (data.moduleName !== 'Portfolio Analysis') {
      if (sessionStorage.getItem(this.envKey.toString() + 'portfolioTrackData')) {
        sessionStorage.removeItem(this.envKey.toString() + 'portfolioTrackData');
      }
      if (sessionStorage.getItem(this.envKey.toString() + 'portfolioQueryData')) {
        sessionStorage.removeItem(this.envKey.toString() + 'portfolioQueryData');
      }
    }
    if (data.moduleName !== 'Screening') {
      if (sessionStorage.getItem(this.envKey.toString() + 'queryData')) {
        sessionStorage.removeItem(this.envKey.toString() + 'queryData');
      }
    }
    return this.http.post<any>(this.serviceURL + 'UpdateModuleTrack', body, { headers: this.getHttpOptions() });
  }

  getInvalidDates() {
    return this.http.get<InvalidDates[]>(this.serviceURL + 'GetInvalidDates',
      { headers: this.getHttpOptions() });
  }

  getSectorEndDates(folioId: number) {
    const params = new HttpParams()
      .set('folioId', folioId.toString());
    return this.http.get<InvalidDates[]>(this.serviceURL + 'getSectorEndDates',
      { headers: this.getHttpOptions(), params });
  }

  getInvalidDatesSector(folioId: number) {
    const params = new HttpParams()
      .set('folioId', folioId.toString());
    return this.http.get<any[]>(this.serviceURL + 'GetInvalidDatesSector',
      { headers: this.getHttpOptions(), params });
  }

  getMaxDate() {
    return this.http.get<any>(this.serviceURL + 'GetMaxDate', { headers: this.getHttpOptions() });
  }

  getEmailAddresses() {
    return this.http.get<EmailAddress[]>(this.serviceURL + 'GetEmailAddress', { headers: this.getHttpOptions() });
  }

  getRecentData(userId: string, sType: string) {
    const params = new HttpParams()
      .set('userId', userId)
      .set('sType', sType);
    return this.http.get<RecentData[]>(this.serviceURL + 'GetRecentData',
      { headers: this.getHttpOptions(), params });
  }

  getMasterFolders(userId: string) {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.get<SelectItem[]>(this.serviceURL + 'GetMasterFolders',
      { headers: this.getHttpOptions(), params });
  }

  getLogFileNames(userId: string, date: string) {
    const params = new HttpParams()
      .set('userId', userId)
      .set('Date', date);
    return this.http.get<LogFiles[]>(this.serviceURL + 'GetLogFiles',
      { headers: this.getHttpOptions(), params });
  }

  getTickerCompanies(tickers: string, companyids: string) {
    const tickerComp = new TickerCompanies();
    tickerComp.companyIds = companyids;
    tickerComp.tickers = tickers;
    const body = JSON.stringify(tickerComp);
    return this.http.post<TickerCompanies>(this.serviceURL + 'GetTickerCompanies',
      body, { headers: this.getHttpOptions() });
    // const params = new HttpParams()
    //   .set('tickers', tickers)
    //   .set('companyIds', companyids);
    // return this.http.get<TickerCompanies>(this.serviceURL + 'GetTickerCompanies',
    //   { headers: this.getHttpOptions(), params });
  }

}
