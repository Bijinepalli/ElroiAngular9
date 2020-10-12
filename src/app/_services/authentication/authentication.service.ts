import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Authenticate } from 'src/app/_models/authentication';
import { environment } from 'src/environments/environment';
import { RoleaccessrightsService } from '../roleaccessrights/roleaccessrights.service';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json',
//     // appRegion: 'Test'
//     applicationSettings: sessionStorage.getItem(this.envKey + 'applicationSettings')
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {
  jwtToken: string;
  private authurl = environment.serviceUrl;
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  constructor(
    private http: HttpClient,
    public router: Router,
    private accessSvc: RoleaccessrightsService,
  ) { }

  authenticateUser(credentials: Authenticate) {
    const body = JSON.stringify(credentials);
    console.log(credentials);
    return this.http.post<Authenticate>(this.authurl + 'authenticate/authenticatelogin', body, { headers: this.getHttpOptions() });
  }
  checkuserOldPassword(credentials: Authenticate) {
    const body = JSON.stringify(credentials);
    console.log(credentials);
    return this.http.post<Authenticate>(this.authurl + 'authenticate/checkuseroldpassword', body, { headers: this.getHttpOptions() });
  }
  changePassword(credentials: Authenticate) {
    const body = JSON.stringify(credentials);
    console.log(credentials);
    return this.http.post<Authenticate>(this.authurl + 'authenticate/changepassword', body, { headers: this.getHttpOptions() });
  }
  assignregeneratedjwt(credentials: Authenticate) {
    const body = JSON.stringify(credentials);
    console.log(credentials);
    return this.http.post<Authenticate>(this.authurl + 'authenticate/assignregeneratedjwt', body, { headers: this.getHttpOptions() });
  }

  logout() {
    // sessionStorage.removeItem(this.envKey.toString() + 'jwtloginToken');
    // this.jwtToken = undefined;
  }

  isLoggedIn(): boolean {
    this.jwtToken = sessionStorage.getItem(this.envKey.toString() + 'jwtloginToken');
    return (this.jwtToken && this.jwtToken !== null && this.jwtToken.toString() !== '');
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/unauthorized'], { skipLocationChange: false });
      return false;
    } else {
      if (route && route.queryParams && route.queryParams.Id &&
        route.queryParams.Id.toString() !== '' &&
        route.queryParams.Id.toString() !== '-999') {
        const canVisit: Promise<boolean> = this.accessSvc.getPageAccess('', route.queryParams.Id.toString(), '')
          .toPromise()
          .then(
            (data) => {
              if (data && data !== null && data.length > 0) {
                return true;
              } else {
                this.router.navigate(['/unauthorized'], { skipLocationChange: false });
                return false;
              }
            }
          ).catch((err) => {
            return false;
          }) as Promise<boolean>;
        return canVisit;
      } else {
        // this.router.navigate(['/unauthorized'], { skipLocationChange: false });
        // return false;
        return true;
      }
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;

    const rtnLoggedIn = this.isLoggedIn();
    if (!this.isLoggedIn()) {
      this.router.navigate(['/unauthorized'], { skipLocationChange: false, queryParams: { status: 'N' } });
      return false;
    } else {
      return true;
    }
  }

  getHttpOptions() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem(this.envKey + 'jwtloginToken'),
      // applicationSettings:  JSON.stringify({ appRegion: 'Test', userId: null })
      // appRegion: 'Test'
      applicationSettings: sessionStorage.getItem(this.envKey + 'applicationSettings')
    });
  }


}

