import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/_models/usermanagement';
import { RoleaccessrightsService } from 'src/app/_services/roleaccessrights/roleaccessrights.service';
import { DataService } from 'src/app/_services/data/data.service';
import { CommoncoreService } from 'src/app/_services/common/commoncore.service';
import { PageRoutes } from 'src/app/_models/commoncore';
import { ThemeService } from 'src/app/_services/theme/theme.service';
import * as jwt_decode from 'jwt-decode';
import { Authenticate } from 'src/app/_models/authentication';
import { LoggerService } from 'src/app/_services/log/logger.service';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';


@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css'],
  providers: [DatePipe],
})
export class MasterComponent implements OnInit, OnDestroy {

  @ViewChild('bigMenu2') bigMenu2: Menu;
  @ViewChild('smallMenu') smallMenu: Menu;

  public show = false;
  BuildType = '';
  componentName: string;
  fullName = 'Hello';
  title = 'My Master Page...';
  solutionName = '';

  menuItems: MenuItem[];
  dashboard: MenuItem[];
  submenu: MenuItem[];
  visibleSidebar = false;

  userOptions: any;
  changePasswordDialog = false;
  changePasswordButtonClass = 'ui-button-success';
  passwordExpiry = '';

  visibleHelp = false;
  helpText = '';

  loginTime: string;
  ShowBody = false;
  showSpinner = false;

  settings: MenuItem[];
  selectedUser: User;
  changeProfileDialog = false;
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userid: string;
  subPagePath: any;
  subLeftNavMenu: any;
  invalidDates: any;
  themeIcon: string;
  themeTip: string;
  showExpireWindow = false;
  expireMinutes: string;
  tokenExpired = false;
  lstThemes: { label: string; icon: string; command: () => void; }[];

  constructor(
    private router: Router,
    private msgSvc: MessageService,
    private datePipe: DatePipe,
    private accessSvc: RoleaccessrightsService,
    private dataSvc: DataService,
    private commonSvc: CommoncoreService,
    private themeSvc: ThemeService,
    private logger: LoggerService,
    private authSvc: AuthenticationService,
  ) {
    this.componentName = 'Master';
  }

  ngOnInit() {
    this.subPagePath = this.dataSvc.obsPagePath.subscribe(pagePath => {
      if (pagePath && pagePath !== 'New') {
        this.selectInitialMenuItemBasedOnUrl(pagePath);
      }
    });
    this.Initialisations();
  }

  ngOnDestroy() {
    this.clearSubscriptions();
  }

  Initialisations() {
    this.lstThemes = [
      {
        label: 'Light', icon: 'fa fa-sun-o', command: () => {
          this.changeTheme('light');
        }
      },
      {
        label: 'Dark', icon: 'fa fa-moon-o', command: () => {
          this.changeTheme('dark');
        }
      },
      {
        label: 'Classic', icon: 'fa fa-paint-brush', command: () => {
          this.changeTheme('classic');
        }
      },

    ];
    this.checkTokenExpiration();
    setInterval(() => {
      this.checkTokenExpiration();
    }, 60000);
    this.maintainTheme();
    this.showSpinner = true;
    this.ShowBody = false;
    this.menuItems = [];
    this.invalidDates = [];
    this.fullName = 'Hello';
    this.BuildType = environment.envName;
    this.userid = sessionStorage.getItem(this.envKey.toString() + 'userId');
    this.showSpinner = false;
    this.getUserDetails();
    this.getPageSections();
  }

  CheckAuthorisation(): boolean {
    return true;
  }

  getUserDetails() {
    this.fullName = 'Hello ' + sessionStorage.getItem(this.envKey.toString() + 'fullName');
    this.loginTime = this.datePipe.transform(Date(), 'MMM dd, yyyy');
    this.settings = [
      {
        label: 'Change Password',
        queryParams: { Id: '6' },
        command: (event) => this.changePasswordClick(),
      },
      {
        label: 'Change Profile',
        queryParams: { Id: '7' },
        command: (event) => this.changeProfileClick(),
      },
      {
        label: 'Configuration',
        queryParams: { Id: '100' },
        command: (event) => this.navigateByRoute(null, PageRoutes.Configuration)
      },
      {
        label: 'Folder Management',
        queryParams: { Id: '101' },
        command: (event) => this.navigateByRoute(null, PageRoutes.FolderManagement)
      },
      {
        label: 'Log Management',
        queryParams: { Id: '102' },
        command: (event) => this.navigateByRoute(null, PageRoutes.LogManagement)
      }
    ];
    this.getInvalidDates();
  }

  getInvalidDates() {
    this.showSpinner = true;
    this.commonSvc.getInvalidDates().subscribe((data) => {
      let invalidDates: any[];
      invalidDates = [];
      if (data && data !== null) {
        if (data.length > 0) {
          invalidDates = data.map(m => m && m !== null && m.invaliddate ? this.convertToJSONDate(m.invaliddate.toString()) : '');
        }
      } else {
      }
      this.dataSvc.changeInvalidDates(invalidDates);
      this.showSpinner = false;

      this.getNavItems();
    },
      (error) => {
        this.showSpinner = false;
      },
      () => {
      }
    );
  }

  convertToJSONDate(strDate: string) {
    let splitted: string[];
    splitted = strDate.split('/');
    const dt = new Date(+splitted[2], +splitted[0] - 1, +splitted[1]);
    const newDate = new Date(dt.getFullYear(), +dt.getMonth(), dt.getDate());
    return newDate;
  }

  getNavItems() {
    this.showSpinner = true;
    if (sessionStorage.getItem(this.envKey.toString() + 'UserRole') &&
      sessionStorage.getItem(this.envKey.toString() + 'UserRole') !== null) {
      const Role = sessionStorage.getItem(this.envKey.toString() + 'UserRole').toString().substring(0, 1);
      this.subLeftNavMenu = this.accessSvc.getLeftNavMenu(Role, '0')
        .subscribe(
          (data) => {
            this.showSpinner = false;
            if (data && data !== null && data.length > 0) {
              this.dataSvc.changeMenuItems(data[1]);
              this.buildMenuItems(data[0]);
            }
          },
          (error) => {
            this.showSpinner = false;
          }
        );
    }
  }
  getPageSections() {
    this.showSpinner = true;
    if (sessionStorage.getItem(this.envKey.toString() + 'UserRole') &&
      sessionStorage.getItem(this.envKey.toString() + 'UserRole') !== null) {
      const Role = sessionStorage.getItem(this.envKey.toString() + 'UserRole').toString().substring(0, 1);
      this.accessSvc.getDetailPagesbyRolesData(Role, '0')
        .subscribe(
          (data) => {
            this.showSpinner = false;
            if (data && data !== null && data.length > 0) {
              this.dataSvc.changePageSections(data);
            }
          },
          (error) => {
            this.showSpinner = false;
          }
        );
    }
  }

  buildMenuItems(data: MenuItem[]) {
    this.showSpinner = true;
    this.menuItems = [];
    if (data && data !== null && data.length > 0) {
      this.buildSubMenus(this.menuItems, data, '');
    }
    this.ShowBody = true;
    this.showSpinner = false;
  }

  buildSubMenus(menuItem: MenuItem[], data: any[], parentId: any) {

    for (const item of data) {
      if (item.queryParams && item.queryParams !== null) {
        item.queryParams.id = (parentId !== '' ? parentId + '@' : '') + (item.queryParams.id);
      } else {
        item.queryParams = { id: (parentId !== '' ? parentId + '@' : '') };
      }

      if (item.items && item.items !== null && item.items.length > 0) {
        let submenuItems: MenuItem[];
        submenuItems = [];
        this.buildSubMenus(submenuItems, item.items, item.queryParams.id);
        if (item.routerLink && item.routerLink !== null && item.routerLink !== '') {
          menuItem.push({
            label: item.label,
            queryParams: item.queryParams,
            items: submenuItems,
            command: (event) => this.navigateByRoute(event, item.routerLink),
          });
        } else {
          menuItem.push({
            label: item.label,
            queryParams: item.queryParams,
            items: submenuItems
          });
        }
      } else {
        if (item.routerLink && item.routerLink !== null && item.routerLink !== '') {
          menuItem.push({
            label: item.label,
            queryParams: item.queryParams,
            command: (event) => this.navigateByRoute(event, item.routerLink)
          });
        } else {
          menuItem.push({
            label: item.label,
            queryParams: item.queryParams
          });
        }
      }
    }
  }

  navigateByRoute(event, path) {
    let queryParamsNew: any;
    queryParamsNew = {};
    const np = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
    if (event && event.item && event.item.queryParams && event.item.queryParams !== null) {
      queryParamsNew = { Id: event.item.queryParams.id, TS: np };
    } else {
      queryParamsNew = { Id: -999, TS: np };
    }
    if (this.envKey && this.envKey !== null) {
      if (sessionStorage.getItem(this.envKey.toString() + 'portfolioTrackData')) {
        sessionStorage.removeItem(this.envKey.toString() + 'portfolioTrackData');
      }
    }
    this.dataSvc.changePagePath(queryParamsNew.Id);
    this.router.navigate([path], { queryParams: queryParamsNew, skipLocationChange: false });
    this.selectInitialMenuItemBasedOnUrl(queryParamsNew.Id);
    this.visibleSidebar = false;
  }

  selectInitialMenuItemBasedOnUrl(Id) {
    const splitVals = Id.toString().split('@');
    const MainCnt = 0;

    if (this.bigMenu2 && this.bigMenu2 !== null) {
      if (this.bigMenu2.model && this.bigMenu2.model !== null && this.bigMenu2.model.length > 0) {
        this.bigMenu2.model.forEach(m => {
          if (m && m !== null) {
            if (MainCnt > 0) {
              m.expanded = false;
            }
            if (m.items && m.items !== null && m.items.length > 0) {
              for (const mItem of m.items) {
                let smm: any;
                smm = mItem;
                smm.expanded = false;
                smm.styleClass = '';
                if (m.expanded === true) {
                  if (smm.queryParams && smm.queryParams !== null) {
                    if (smm.queryParams.id === splitVals[0] + '@' + splitVals[1]) {
                      smm.expanded = true;
                      if (smm.items && smm.items !== null && smm.items.length > 0) {
                      } else {
                        smm.styleClass = 'ActiveRouteLink';
                      }
                    }
                  }
                  if (smm.items && smm.items !== null && smm.items.length > 0) {
                    for (const smmmItem of smm.items) {
                      let smmm: any;
                      smmm = smmmItem;
                      smmm.expanded = false;
                      smmm.styleClass = '';
                      if (smm.expanded === true) {
                        if (smmm.queryParams && smmm.queryParams !== null) {
                          if (smmm.queryParams.id === splitVals[0] + '@' + splitVals[1] + '@' + splitVals[2]) {
                            smmm.expanded = true;
                            smmm.styleClass = 'ActiveRouteLink'; // ActiveRouteLink
                          }
                        }
                      }
                    }
                  }
                } else {
                  if (smm.items && smm.items !== null && smm.items.length > 0) {
                    for (const smmItem of smm.items) {
                      let smmm: any;
                      smmm = smmItem;
                      smmm.expanded = false;
                      smmm.styleClass = '';
                    }
                  }
                }
              }
            }
          }
        });
      }
    }

    if (this.smallMenu && this.smallMenu !== null) {
      if (this.smallMenu.model && this.smallMenu.model !== null && this.smallMenu.model.length > 0) {
        this.smallMenu.model.forEach(m => {
          if (m && m !== null) {
            if (MainCnt > 0) {
              m.expanded = false;
            }
            if (m.items && m.items !== null && m.items.length > 0) {
              for (const mItem of m.items) {
                let smm: any;
                smm = mItem;
                smm.expanded = false;
                smm.styleClass = '';
                if (m.expanded === true) {
                  if (smm.queryParams && smm.queryParams !== null) {
                    if (smm.queryParams.id === splitVals[0] + '@' + splitVals[1]) {
                      smm.expanded = true;
                      if (smm.items && smm.items !== null && smm.items.length > 0) {
                      } else {
                        smm.styleClass = 'ActiveRouteLink';
                      }
                    }
                  }
                  if (smm.items && smm.items !== null && smm.items.length > 0) {
                    for (const smmItem of smm.items) {
                      let smmm: any;
                      smmm = smmItem;
                      smmm.expanded = false;
                      smmm.styleClass = '';
                      if (smm.expanded === true) {
                        if (smmm.queryParams && smmm.queryParams !== null) {
                          if (smmm.queryParams.id === splitVals[0] + '@' + splitVals[1] + '@' + splitVals[2]) {
                            smmm.expanded = true;
                            smmm.styleClass = 'ActiveRouteLink'; // ActiveRouteLink
                          }
                        }
                      }
                    }
                  }
                } else {
                  if (smm.items && smm.items !== null && smm.items.length > 0) {
                    for (const smmItem of smm.items) {
                      let smmm: any;
                      smmm = smmItem;
                      smmm.expanded = false;
                      smmm.styleClass = '';
                    }
                  }
                }
              }
            }
          }
        });
      }
    }

  }

  OpenMenu() {
    this.visibleSidebar = true;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  maintainTheme() {
    const theme = sessionStorage.getItem(this.envKey.toString() + 'theme');
    console.log(theme);
    if (theme === 'light') {
      this.themeIcon = 'fa fa-sun-o';
      this.themeTip = 'Switch theme';
      sessionStorage.setItem(this.envKey.toString() + 'theme', 'light');
      this.themeSvc.setLightTheme();
    } else if (theme === 'dark') {
      this.themeIcon = 'fa fa-moon-o';
      this.themeTip = 'Switch theme';
      sessionStorage.setItem(this.envKey.toString() + 'theme', 'dark');
      this.themeSvc.setDarkTheme();
    } else {
      this.themeIcon = 'fa fa-paint-brush';
      this.themeTip = 'Switch theme';
      sessionStorage.setItem(this.envKey.toString() + 'theme', 'classic');
      this.themeSvc.setClassicTheme();
    }
  }

  changeTheme(mode: string) {
    const theme = mode; // sessionStorage.getItem(this.envKey.toString() + 'theme');
    if (theme === 'light') {
      this.themeIcon = 'fa fa-sun-o';
      this.themeTip = 'Switch theme';
      sessionStorage.setItem(this.envKey.toString() + 'theme', 'light');
      this.themeSvc.setLightTheme();
    } else if (theme === 'dark') {
      this.themeIcon = 'fa fa-moon-o';
      this.themeTip = 'Switch theme';
      sessionStorage.setItem(this.envKey.toString() + 'theme', 'dark');
      this.themeSvc.setDarkTheme();
    } else {
      this.themeIcon = 'fa fa-paint-brush';
      this.themeTip = 'Switch theme';
      sessionStorage.setItem(this.envKey.toString() + 'theme', 'classic');
      this.themeSvc.setClassicTheme();
    }
  }


  checkTokenExpiration() {
    let decode: any;
    if (sessionStorage.getItem(this.envKey.toString() + 'jwtloginToken')) {
      const token = sessionStorage.getItem(this.envKey.toString() + 'jwtloginToken');
      decode = jwt_decode(token);
      const date = new Date(0);
      date.setUTCSeconds(decode.exp);
      const diff = date.valueOf() - new Date().valueOf();
      const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);
      console.log(diffMins);
      if (diffMins === 5 || diffMins === 4 || diffMins === 3 || diffMins === 2) {
        // alert('token expiring soon');
        this.expireMinutes = diffMins.toString();
        this.showExpireWindow = true;
      } else if (diffMins === 1) {
        this.showExpireWindow = true;
        this.expireMinutes = diffMins.toString();
        this.tokenExpired = true;
      }
    }
  }

  navigateTo() {
    this.selectInitialMenuItemBasedOnUrl(-1);
    this.navigateByRoute(null, [PageRoutes.Dashboard]);
  }

  changeProfileClick() {
    this.selectedUser = new User();
    this.selectedUser.actionType = 'Update';
    this.changeProfileDialog = true;
  }

  changeProfileClose($event) {
    this.changeProfileDialog = $event;
  }

  changePasswordClick() {
    this.changePasswordDialog = true;
  }

  changePasswordClose($event) {
    this.changePasswordDialog = $event;
  }

  onReject() {
    this.msgSvc.clear('alert');
  }

  onRejectException() {
    this.msgSvc.clear('exception');
  }

  clearSubscriptions() {
    this.subPagePath ? this.subPagePath.unsubscribe() : this.clear();
    this.subLeftNavMenu ? this.subLeftNavMenu.unsubscribe() : this.clear();
  }

  clear() {
  }
  contiune() {
    const req: Authenticate = {
      userId: sessionStorage.getItem(this.envKey.toString() + 'userId'),
    };
    this.logger.debug(this.componentName, 'contiune', 'assignjwttocontinue Service Call Entry');
    this.authSvc.assignregeneratedjwt(req).subscribe(
      (data) => {
        this.logger.debug(this.componentName, 'contiune', 'assignjwttocontinue Service Call Success');
        if (data !== undefined && data != null) {
          if (data.errorMsg != null && data.errorMsg !== '') {
            this.logger.debug(this.componentName, 'contiune', 'Login Failed! Invalid Credentials');
            this.msgSvc.add({
              key: 'alert',
              sticky: true,
              severity: 'error',
              summary: 'Unknown User',
              detail: 'Invalid User'
            });
          } else {
            this.logger.debug(this.componentName, 'contiune', 'Login Success! JWT Token Regenerated');
            sessionStorage.setItem(this.envKey.toString() + 'jwtloginToken', data.token);
          }
        }
        this.showExpireWindow = false;
      }
    );
  }
}
