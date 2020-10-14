import { Injectable } from '@angular/core';
import { MasterPages, LeftNavMenu, MasterDetailItem, AppSettings } from 'src/app/_models/masterconfigurations';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TreeNode } from 'primeng/api';
import { ReturnValue } from 'src/app/_models/commoncore';
import { Rating } from 'src/app/_models/screening';

@Injectable({
  providedIn: 'root'
})
export class RoleaccessrightsService {

  private accessrightsurl = environment.serviceUrl + 'accessrights/';
  private envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';

  constructor(
    private http: HttpClient
  ) { }

  getHttpOptions() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem(this.envKey + 'jwtloginToken'),
      // appRegion: 'Test'
      applicationSettings: sessionStorage.getItem(this.envKey + 'applicationSettings')
    });
  }

  getLeftNavMenu(Role: string, PageId: string) {
    const params = new HttpParams()
      .set('Role', Role)
      .set('PageId', PageId);
    const data1 = this.http.get<LeftNavMenu[]>(this.accessrightsurl + 'GetLeftNavMenu', { headers: this.getHttpOptions(), params });
    const data2 = this.http.get<MasterPages[]>(this.accessrightsurl + 'GetPagesByRoleData', { headers: this.getHttpOptions(), params });
    return forkJoin([data1, data2]);
  }

  getMasterPages() {
    return this.http.get<TreeNode[]>(this.accessrightsurl + 'GetMasterPages', { headers: this.getHttpOptions() });
  }
  getDetailPages() {
    return this.http.get<TreeNode[]>(this.accessrightsurl + 'GetDetailPages', { headers: this.getHttpOptions() });
  }
  getPagesbyRoles(Role: string, PageId: string) {
    const params = new HttpParams()
      .set('Role', Role)
      .set('PageId', PageId);
    return this.http.get<TreeNode[]>(this.accessrightsurl + 'GetPagesByRole', { headers: this.getHttpOptions(), params });
  }

  getDetailPagesbyRoles(Role: string, PageId: string) {
    const params = new HttpParams()
      .set('Role', Role)
      .set('PageId', PageId);
    return this.http.get<TreeNode[]>(this.accessrightsurl + 'GetDetailPagesByRole', { headers: this.getHttpOptions(), params });
  }
  getDetailPagesbyRolesData(Role: string, PageId: string) {
    const params = new HttpParams()
      .set('Role', Role)
      .set('PageId', PageId);
    return this.http.get<TreeNode[]>(this.accessrightsurl + 'GetDetailPagesByRoleData', { headers: this.getHttpOptions(), params });
  }

  // getPagesByRoleData(Role: string, PageId: string) {
  //   const params = new HttpParams()
  //     .set('Role', Role)
  //     .set('PageId', PageId);
  //   return this.http.get<MasterPages[]>(this.accessrightsurl + 'GetPagesByRoleData', { headers: this.getHttpOptions(), params });
  // }

  getPageAccess(pageId: string, idPath: string, pagePath: string) {
    const params = new HttpParams()
      .set('role', sessionStorage.getItem(this.envKey.toString() + 'UserRole').toString().substring(0, 1))
      .set('pageId', pageId)
      .set('idPath', idPath)
      .set('pagePath', pagePath);
    return this.http.get<MasterPages[]>(this.accessrightsurl + 'GetPageAccess', { headers: this.getHttpOptions(), params });
  }

  insertAccessRights(data: MasterPages[]) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.accessrightsurl + 'InsertAccessRights', body, { headers: this.getHttpOptions() });
  }
  insertSectionAccessRights(data: MasterPages[]) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.accessrightsurl + 'InsertSectionAccessRights', body, { headers: this.getHttpOptions() });
  }

  getMasterItems() {
    return this.http.get<MasterDetailItem[]>(this.accessrightsurl + 'GetMasterItems', { headers: this.getHttpOptions() });
  }

  getDetailItems(masterId: string) {
    const params = new HttpParams()
      .set('masterId', masterId);
    return this.http.get<MasterDetailItem[]>(this.accessrightsurl + 'GetDetailItems', { headers: this.getHttpOptions(), params });
  }

  insertMasterItem(data) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.accessrightsurl + 'InsertMasterItem', body, { headers: this.getHttpOptions() });
  }

  changeMasterItemStatus(data) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.accessrightsurl + 'ChangeMasterItemStatus', body, { headers: this.getHttpOptions() });
  }

  insertDetailItem(data) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.accessrightsurl + 'InsertDetailItem', body, { headers: this.getHttpOptions() });
  }

  changeDetailItemStatus(data) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.accessrightsurl + 'ChangeDetailItemStatus', body, { headers: this.getHttpOptions() });
  }

  checkFolderAccessRights(folderId: string, access: string) {
    const params = new HttpParams()
      .set('folderId', folderId)
      .set('access', access);
    return this.http.get<any>(this.accessrightsurl + 'CheckFolderAccessRights', { headers: this.getHttpOptions(), params });
  }

  getStaticRatings(item: string) {
    const params = new HttpParams()
      .set('item', item);
    return this.http.get<Rating[]>(this.accessrightsurl + 'GetStaticRatings', { headers: this.getHttpOptions(), params });
  }

  getAppSettings() {
    return this.http.get<AppSettings[]>(this.accessrightsurl + 'GetAppSettings', { headers: this.getHttpOptions() });
  }

  updateAppSettings(data: AppSettings[]) {
    const body = JSON.stringify(data);
    return this.http.post<AppSettings[]>(this.accessrightsurl + 'InsertAppSettings', body, { headers: this.getHttpOptions() });
  }

}
