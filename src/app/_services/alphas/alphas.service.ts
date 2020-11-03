import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import {
  Alpha, CustomDecile, CustomDecileVal, AlphaItems, Items,
  ViewAlphas, Holdings, Industries, SaveAlphasVal, AlphaReport, AlphaView, AlphaSpanTickers, AlphaDetails
} from 'src/app/_models/alphas';
import { forkJoin } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { ReturnValue } from 'src/app/_models/commoncore';
import { ScreeningReport } from 'src/app/_models/screening';


@Injectable({
  providedIn: 'root'
})
export class AlphasService {
  /**
   * Jwt token of alphas service
   */
  jwtToken: string;
  /**
   * Service url of alphas service
   */
  private serviceURL = environment.serviceUrl + 'alphas/';
  /**
   * Env key of alphas service-Used to fetch the session data
   */
  private envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';

  /**
   * Creates an instance of alphas service.
   * @param http HttpClient
   */
  constructor(
    private http: HttpClient
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
   * Gets category items list
   * @param userId Loggedin User
   * @returns  Combined List Categories + Items of Alpha
   */
  getCategories() {
    return this.http.get<SelectItem[]>(this.serviceURL + 'GetCategoriesList',
      { headers: this.getHttpOptions() });
  }


  /**
   * Gets category items list
   * @param userId Loggedin User
   * @returns  Combined List Categories + Items of Alpha
   */
  getItems(userId: string) {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.get<Items[]>(this.serviceURL + 'GetItemsList',
      { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets category items list
   * @param userId Loggedin User
   * @returns  Combined List Categories + Items of Alpha
   */
  getCategoryItemsList(userId: string) {
    const params = new HttpParams()
      .set('userId', userId);
    const data1 = this.http.get<SelectItem[]>(this.serviceURL + 'GetCategoriesList',
      { headers: this.getHttpOptions() });
    const data2 = this.http.get<Items[]>(this.serviceURL + 'GetItemsList',
      { headers: this.getHttpOptions(), params });
    return forkJoin([data1, data2]);
  }

  /**
   * Gets sgitypes list-Sectors,Groups and Industries
   * @returns Combined List of Sectors Groups and Industries List
   */
  getSGITypesList() {
    const data1 = this.http.get<SelectItem[]>(this.serviceURL + 'GetSectorsList',
      { headers: this.getHttpOptions() });
    const data2 = this.http.get<SelectItem[]>(this.serviceURL + 'GetGroupsList',
      { headers: this.getHttpOptions() });
    const data3 = this.http.get<SelectItem[]>(this.serviceURL + 'GetIndustriesList',
      { headers: this.getHttpOptions() });
    return forkJoin([data1, data2, data3]);
  }

  /**
   * Gets sub industries list
   * @returns  Industries List
   */
  getSubIndustriesList() {
    return this.http.get<Industries[]>(this.serviceURL + 'GetSubIndustries',
      { headers: this.getHttpOptions() });
  }

  /**
   * Gets group by list-Fetch the Industries based on selected group
   * @param groupBy Selected Group
   * @returns  Industries List
   */
  getGroupByList(groupBy: string) {
    const params = new HttpParams()
      .set('groupBy', groupBy);
    return this.http.get<Industries[]>(this.serviceURL + 'GetGroupByList',
      { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets holdingss
   * @param folderId Selected Folder
   * @param userId Selected User
   * @returns Holdings List
   */
  getHoldingss(folderId: string, userId: string) {
    const params = new HttpParams()
      .set('folderId', folderId)
      .set('userId', userId);
    return this.http.get<Holdings[]>(this.serviceURL + 'GetHoldings',
      { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets custom deciles
   * @param userId Loggedin User
   * @param dataItem Selected alpha item
   * @returns CustomDecile List
   */
  getCustomDeciles(userId: string, dataItem: string) {
    const params = new HttpParams()
      .set('userId', userId)
      .set('dataItem', dataItem);
    return this.http.get<CustomDecile[]>(this.serviceURL + 'GetCustomDeciles',
      { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets custom deciles data items
   * @param userId Loggedin User
   * @param dataItem Selected alpha item
   * @returns  CustomDecileValues List
   */
  getCustomDecilesDataItems(userId: string, dataItem: string) {
    const params = new HttpParams()
      .set('userId', userId)
      .set('dataItem', dataItem);
    return this.http.get<CustomDecileVal[]>(this.serviceURL + 'GetCustomDecilesDataItems',
      { headers: this.getHttpOptions(), params });
  }

  /**
   * Inserts custom deciles
   * @param data CustomDecile Model
   * @returns ReturnValue for Status
   */
  insertCustomDeciles(data: CustomDecile[]) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.serviceURL + 'InsertCustomDeciles',
      body, { headers: this.getHttpOptions() });
  }

  /**
   * Gets alpha items
   * @param userId Loggedin User
   * @returns AlphaItems List
   */
  getAlphaItems(userId: string) {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.get<AlphaItems[]>(this.serviceURL + 'GetAlphaItems',
      { headers: this.getHttpOptions(), params });
  }

  /**
   * Inserts alpha item
   * @param data AlphaItems Model
   * @returns ReturnValue for Status
   */
  insertAlphaItem(data: AlphaItems) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.serviceURL + 'InsertAlphaItem',
      body, { headers: this.getHttpOptions() });
  }

  /**
   * Updates alpha item
   * @param data Selected Alpha Item Model
   * @returns ReturnValue for Status
   */
  updateAlphaItem(data: AlphaItems) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.serviceURL + 'UpdateAlphaItem',
      body, { headers: this.getHttpOptions() });
  }


  /**
   * Deletes alpha item
   * @param data Selected Alpha Item
   * @returns ReturnValue for Status
   */
  deleteAlphaItem(data: AlphaItems) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.serviceURL + 'DeleteAlphaItem',
      body, { headers: this.getHttpOptions() });
  }

  /**
   * Gets alpha items
   * @param userId Loggedin User
   * @returns  AlphaItems List
   */
  getAlphaStrategy(userId: string) {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.get<AlphaItems[]>(this.serviceURL + 'GetAlphaStrategy',
      { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets existing alpha items
   * @param folderId Selected folder
   * @returns  Alpha List
   */
  getExistingAlphaStrategy(folderId: string) {
    const params = new HttpParams()
      .set('folderId', folderId);
    return this.http.get<Alpha[]>(this.serviceURL + 'GetExistingAlphaStrategy',
      { headers: this.getHttpOptions(), params });
  }

  /**
   * Gets view alphas
   * @param itemName Selected Alpha Name
   * @returns  ViewAlphas List
   */
  getViewAlphas(itemName: string) {
    const params = new HttpParams()
      .set('itemName', itemName);
    return this.http.get<ViewAlphas[]>(this.serviceURL + 'GetViewAlphas',
      { headers: this.getHttpOptions(), params });
  }

  /**
   * Inserts alpha strategy
   * @param data SaveAlphasVal Model
   * @returns ReturnValue for Status
   */
  insertAlphaStrategy(data: SaveAlphasVal) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.serviceURL + 'InsertAlphaStrategy',
      body, { headers: this.getHttpOptions() });
  }

  /**
   * Deletes alpha strategy
   * @param data Selected Alpha Strategy
   * @returns ReturnValue for Status
   */
  deleteAlphaStrategy(data: Alpha) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.serviceURL + 'DeleteAlphaStrategy',
      body, { headers: this.getHttpOptions() });
  }

  /**
   * Gets Alpha Strategies with Details
   * @param userId Loggedin user
   * @returns Alpha List
   */
  getAlphaStrategyDetails(userId: string) {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.get<Alpha[]>(this.serviceURL + 'GetAlphaStrategyDetails',
      { headers: this.getHttpOptions(), params });
  }

  /**
   * Inserts alpha merges
   * @param data Alpha
   * @returns ReturnValue for Status
   */
  insertAlphaMerges(data: Alpha) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.serviceURL + 'InsertAlphaMerges',
      body, { headers: this.getHttpOptions() });
  }

  getQueryDetails(queryDetail) {
    const body = JSON.stringify(queryDetail);
    return this.http.post<AlphaReport>(this.serviceURL + 'GetAlphaDeciles', body, { headers: this.getHttpOptions() });
  }

  getCombinedAlphaDetails(queryDetail) {
    const body = JSON.stringify(queryDetail);
    return this.http.post<AlphaReport>(this.serviceURL + 'GetCombinedAlphaDeciles', body, { headers: this.getHttpOptions() });
  }

  getAlphaSpanDetails(alphaView: AlphaView) {
    const body = JSON.stringify(alphaView);
    return this.http.post<AlphaSpanTickers[]>(this.serviceURL + 'GetAlphaSpanDeciles', body, { headers: this.getHttpOptions() });
  }
  getAlphaDescriptios(userId: string, dataItem: string) {
    const params = new HttpParams()
      .set('userid', userId)
      .set('dataitem', dataItem);
    return this.http.get<AlphaDetails[]>(this.serviceURL + 'GetAlphaDescription',
      { headers: this.getHttpOptions(), params });
  }
}
