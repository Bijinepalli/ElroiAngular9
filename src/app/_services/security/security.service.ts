import { Injectable } from '@angular/core';
import { RoleaccessrightsService } from '../roleaccessrights/roleaccessrights.service';
import { environment } from 'src/environments/environment';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  constructor(
    private accessSvc: RoleaccessrightsService,
    private dataSvc: DataService,
  ) {

  }

  /* security */
  checkPageSecurity(pageName: string) {
    const menuItems = this.dataSvc.lstMenuItems;
    // if (sessionStorage.getItem(this.envKey.toString() + 'UserRole') &&
    //   sessionStorage.getItem(this.envKey.toString() + 'UserRole') !== null) {
    //   const Role = sessionStorage.getItem(this.envKey.toString() + 'UserRole').toString().substring(0, 1);
    //   this.accessSvc.getLeftNavMenu(Role, '0')
    //     .subscribe(
    //       (data) => {
    if (menuItems && menuItems !== null && menuItems.length > 0) {
      const pageNameLis = menuItems.filter(P => P.pageName.toLowerCase() === pageName.toLowerCase());
      if (pageNameLis.length > 0) {
        return true;
      } else {
        return false;
      }
    }
    //       },
    //       (error) => {
    //       }
    //     );
    // }
    return false;
  }
  checkSectionSecurity(sectionName) {
    const pageSections = this.dataSvc.lstPageSections;
    if (pageSections && pageSections !== null && pageSections.length > 0) {
      const pageNameLis = pageSections.filter(P => P.pageName.toLowerCase() === sectionName.toLowerCase());
      if (pageNameLis.length > 0) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  /* end */
}
