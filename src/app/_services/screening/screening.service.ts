import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { SelectItem } from 'primeng/api';
import { AlphaItems, Industries } from 'src/app/_models/alphas';
import { ScreeningReport, CountryCodes, IndexIndicator, Criteria, Rating } from 'src/app/_models/screening';
import { CompanyMaster } from 'src/app/_models/usermanagement';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreeningService {
  /**
   * Service url of screening service
   */
  private serviceURL = environment.serviceUrl + 'screening/';
  /**
   * Env key of screening service-Used to fetch the session data
   */
  private envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';

  /**
   * Creates an instance of screening service.
   * @param http HttpClient
   */
  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Gets http options
   * @returns  HttpHeaders with content-type,authorization jwt token
   */
  getHttpOptions() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem(this.envKey + 'jwtloginToken'),
      // appRegion: 'Test'
      applicationSettings: sessionStorage.getItem(this.envKey + 'applicationSettings')
    });
  }

  /**
   * Gets screening report
   * @returns  Screening Report Data
   */
  getScreeningReport() {
    return this.http.get<ScreeningReport>(this.serviceURL + 'GetScreeningReport', { headers: this.getHttpOptions() });
  }

  /**
   * Gets screening category items list
   * @param userId Loggedin User
   * @returns  Combined List Categories + Items of Screening
   */
  getScreeningCategoryItemsList(userId: string) {
    const params = new HttpParams()
      .set('userId', userId);
    const data1 = this.http.get<SelectItem[]>(this.serviceURL + 'GetCategoriesList', { headers: this.getHttpOptions() });
    const data2 = this.http.get<any[]>(this.serviceURL + 'GetItemsList', { headers: this.getHttpOptions(), params });
    return forkJoin([data1, data2]);
  }

  /**
   * Inserts screening item
   * @param data AlphaItems Model
   * @returns  ReturnValue for Status
   */
  InsertScreeningItem(data) {
    const body = JSON.stringify(data);
    return this.http.post<any>(this.serviceURL + 'InsertScreeningItem', body, { headers: this.getHttpOptions() });
  }

  /**
   * Updates screening item
   * @param data Selected AlphaItem Model
   * @returns  ReturnValue for Status
   */
  updateScreeningItem(data) {
    const body = JSON.stringify(data);
    return this.http.post<any>(this.serviceURL + 'UpdateScreeningItem', body, { headers: this.getHttpOptions() });
  }

  /**
   * Deletes screening item
   * @param data Selected AlphaItem Model
   * @returns  ReturnValue for Status
   */
  deleteScreeningItem(data) {
    const body = JSON.stringify(data);
    return this.http.post<any>(this.serviceURL + 'DeleteScreeningItem', body, { headers: this.getHttpOptions() });
  }

  /**
   * Gets screening items
   * @param userId Loggedin User
   * @returns  Screening Items List
   */
  GetScreeningItems(userId: string) {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.get<AlphaItems[]>(this.serviceURL + 'GetScreeningItems', { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets country codes
   * @returns  Country Codes List
   */
  getCountryCodes() {
    return this.http.get<CountryCodes[]>(this.serviceURL + 'GetCountryCodes', { headers: this.getHttpOptions() });
  }

  /**
   * Gets index indicators
   * @returns  Index indicators List
   */
  getIndexIndicators() {
    return this.http.get<IndexIndicator[]>(this.serviceURL + 'GetIndexIndicators', { headers: this.getHttpOptions() });
  }

  /**
   * Gets russell industries list
   * @returns  Russell Industries List
   */
  getRussellIndustriesList() {
    return this.http.get<Industries[]>(this.serviceURL + 'GetRussellIndustries', { headers: this.getHttpOptions() });
  }

  /**
   * Searchs tickers
   * @param tickers Entered Tickers
   * @returns  Company Master Model List
   */
  searchTickers(tickers: string) {
    const params = new HttpParams()
      .set('strTickers', tickers);
    return this.http.get<CompanyMaster[]>(this.serviceURL + 'SearchTickers', { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets criterias
   * @param folderId Selected folder
   * @returns  Criterias List
   */
  getCriterias(folderId: string) {
    const params = new HttpParams()
      .set('folderId', folderId);
    return this.http.get<Criteria[]>(this.serviceURL + 'GetCriterias', { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets report criterias
   * @param folderId Selected folder
   * @returns  Criterias List
   */
  getReportCriterias(folderId: string) {
    const params = new HttpParams()
      .set('folderId', folderId);
    return this.http.get<Criteria[]>(this.serviceURL + 'GetReportCriterias', { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets criteria details
   * @param criteriaId Selected Criteria
   * @returns  Criteria Details List
   */
  getCriteriaDetails(criteriaId: string) {
    const params = new HttpParams()
      .set('criteriaId', criteriaId);
    return this.http.get<Criteria[]>(this.serviceURL + 'GetCriteriaDetails', { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets report criteria details
   * @param criteriaId Selected Criteria
   * @returns  Criteria Details List
   */
  getReportCriteriaDetails(criteriaId: string) {
    const params = new HttpParams()
      .set('criteriaId', criteriaId);
    return this.http.get<Criteria[]>(this.serviceURL + 'GetReportCriteriaDetails', { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets report data items
   * @param criteriaId Selected Criteria
   * @returns  Criterias List
   */
  getReportDataItems(criteriaId: string) {
    const params = new HttpParams()
      .set('criteriaId', criteriaId);
    return this.http.get<Criteria[]>(this.serviceURL + 'GetReportDataItems', { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets query details
   * @param queryDetail ScreeningReport Model
   * @returns  Screening report list
   */
  getQueryDetails(queryDetail) {
    const body = JSON.stringify(queryDetail);
    return this.http.post<ScreeningReport>(this.serviceURL + 'GetQueryDetails', body, { headers: this.getHttpOptions() });
  }

  /**
   * Inserts create screen data
   * @param data ScreeningData Model
   * @returns  ReturnValue for Status
   */
  insertCreateScreenData(data) {
    console.log(data);
    const body = JSON.stringify(data);
    console.log(body);
    return this.http.post<any>(this.serviceURL + 'SaveScreeningData', body, { headers: this.getHttpOptions() });
  }

  /**
   * Criterias name check
   * @param userId Loggedin User
   * @param criteriaName Criteria Name for Saving
   * @returns  ReturnValue for Status
   */
  criteriaNameCheck(userId: string, criteriaName: string) {
    const params = new HttpParams()
      .set('userId', userId)
      .set('criteriaName', criteriaName);
    return this.http.get<any>(this.serviceURL + 'CriteriaNameCheck', { headers: this.getHttpOptions(), params });
  }


  /**
   * Criterias name report check
   * @param userId Loggedin User
   * @param criteriaName Criteria Name for Saving
   * @returns  ReturnValue for Status
   */
  criteriaNameReportCheck(userId: string, criteriaName: string) {
    const params = new HttpParams()
      .set('userId', userId)
      .set('criteriaName', criteriaName);
    return this.http.get<any>(this.serviceURL + 'CriteriaNameReportCheck', { headers: this.getHttpOptions(), params });
  }

  /**
   * Deletes existing criteria
   * @param data Selected ScreeningData Model
   * @returns  ReturnValue for Status
   */
  deleteExistingCriteria(data) {
    const body = JSON.stringify(data);
    return this.http.post<any>(this.serviceURL + 'DeleteExistingCriteria', body, { headers: this.getHttpOptions() });
  }

  /**
   * Gets existing criteria details
   * @param criteriaId Selected Criteria
   * @returns  Criteria Details List
   */
  getExistingCriteriaDetails(criteriaId: string) {
    const params = new HttpParams()
      .set('criteriaId', criteriaId);
    return this.http.get<Criteria[]>(this.serviceURL + 'GetExistingCriteriaDetails', { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets stocks count
   * @param dailyDate Latest Date
   * @returns  Stocks Count
   */
  getStocksCount(dailyDate: string) {
    const params = new HttpParams()
      .set('dailyDate', dailyDate);
    return this.http.get<any>(this.serviceURL + 'GetStocksCount', { headers: this.getHttpOptions(), params });
  }

}
