import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { User, Folder, UserReport } from 'src/app/_models/usermanagement';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsermanagementService {

  /**
   * Service url  of usermanagement service
   */
  private url = environment.serviceUrl + 'users/';
  /**
   * Env key of usermanagement service-used to fetch session data
   */
  private envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';

  /**
   * Creates an instance of usermanagement service.
   * @param http HttpClient
   */
  constructor(private http: HttpClient) { }

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
   * Gets users
   * @returns  Users List
   */
  getUsers() {
    return this.http.get<User[]>(this.url + 'GetUsers', { headers: this.getHttpOptions() });
  }

  /**
   * Gets foldersby firm
   * @param firm selected firm value
   * @param userid Loggedin user
   * @returns Folders List by selected firm value
   */
  getFoldersbyFirm(firm: string, userid: string) {
    const params = new HttpParams()
      .set('firm', firm)
      .set('userid', userid);
    return this.http.get<Folder[]>(this.url + 'GetFoldersbyFirm', {
      headers: this.getHttpOptions(), params
    });
  }

  /**
   * Gets usersby firm
   * @param firm firm value
   * @returns Users List by selected firm value
   */
  getUsersbyFirm(firm: string) {
    const params = new HttpParams()
      .set('firm', firm);
    return this.http.get<User[]>(this.url + 'GetUsersbyFirm', {
      headers: this.getHttpOptions(), params
    });
  }

  /**
   * Gets organizations
   * @returns Organizations List
   */
  getOrganizations() {
    return this.http.get<User[]>(this.url + 'GetOrganizations', { headers: this.getHttpOptions() });
  }

  /**
   * Gets user profile
   * @param userid Loggedin User
   * @returns User Profile Data
   */
  getUserProfile(userid: number) {
    const params = new HttpParams()
      .set('userid', userid.toString());
    return this.http.get<User[]>(this.url + 'GetUserProfile', {
      headers: this.getHttpOptions(), params
    });
  }

  /**
   * Inserts user
   * @param inputData User Model
   * @returns success/error status
   */
  insertUser(inputData: User) {
    const body = JSON.stringify(inputData);
    return this.http.post<any>(this.url + 'InsertUser', body, { headers: this.getHttpOptions() });
  }

  /**
   * Updates user
   * @param inputData User Model
   * @returns success/error status
   */
  updateUser(inputData: User) {
    const body = JSON.stringify(inputData);
    return this.http.post<any>(this.url + 'UpdateUser', body, { headers: this.getHttpOptions() });
  }

  /**
   * Updates user status
   * @param user User Model
   * @returns success/error status
   */
  updateUserStatus(user: User) {
    const body = JSON.stringify(user);
    return this.http.post<any>(this.url + 'UpdateUserStatus', body, { headers: this.getHttpOptions() });
  }

  /**
   * Gets day wise report
   * @returns Day Wise Report List
   */
  getDayWiseReport() {
    return this.http.get<UserReport[]>(this.url + 'GetDayWiseReport', { headers: this.getHttpOptions() });
  }

  /**
   * Gets date wise user report
   * @param selectedDate Seleted Date
   * @param UserId Loggedin User
   * @returns Date Wise User Report List
   */
  getDateWiseUserReport(selectedDate: string, UserId: string) {
    const params = new HttpParams()
      .set('selectedDate', selectedDate)
      .set('UserId', UserId.toString());
    return this.http.get<UserReport[]>(this.url + 'GetDateWiseReport', {
      headers: this.getHttpOptions(), params
    });
  }

  /**
   * Gets module wise user report
   * @param selectedModule selected Module
   * @returns Module Wise User Report List
   */
  getModuleWiseUserReport(selectedModule: string) {
    const params = new HttpParams()
      .set('selectedModule', selectedModule);
    return this.http.get<UserReport[]>(this.url + 'GetModuleWiseReport', {
      headers: this.getHttpOptions(), params
    });
  }

  /**
   * Gets date wise module report
   * @param selectedDate Selected Module
   * @param UserId Loggedin User
   * @returns Date Wise Module Report List
   */
  getDateWiseModuleReport(selectedDate: string, UserId: number) {
    const params = new HttpParams()
      .set('selectedDate', selectedDate)
      .set('UserId', UserId.toString());
    return this.http.get<UserReport[]>(this.url + 'GetDateWiseModuleReport', {
      headers: this.getHttpOptions(), params
    });
  }

  /**
   * Gets user wise module report
   * @param UserId Loggedin User
   * @returns User Wise Module Report List
   */
  getUserWiseModuleReport(UserId: number) {
    const params = new HttpParams()
      .set('UserId', UserId.toString());
    return this.http.get<UserReport[]>(this.url + 'GetUserWiseModuleReport', {
      headers: this.getHttpOptions(), params
    });
  }

  /**
   * Gets day wise user report
   * @param selectedModule Selected Module
   * @param UserId Loggedin User
   * @returns Day Wise Users Report List
   */
  getDayWiseUserReport(selectedModule: string, UserId: number) {
    const params = new HttpParams()
      .set('selectedModule', selectedModule)
      .set('UserId', UserId.toString());
    return this.http.get<UserReport[]>(this.url + 'GetDayWiseUserReport', {
      headers: this.getHttpOptions(), params
    });
  }

  /**
   * Gets dateof access
   * @param UserId Loggedin User
   * @returns Date of Access List
   */
  getDateofAccess(UserId: number) {
    const params = new HttpParams()
      .set('UserId', UserId.toString());
    return this.http.get<UserReport[]>(this.url + 'GetDateofAccess', {
      headers: this.getHttpOptions(), params
    });
  }

}
