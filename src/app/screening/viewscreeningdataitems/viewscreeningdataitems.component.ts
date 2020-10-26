// #region  [Imports]
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleTrack, ModuleNames, PageRoutes, ReturnValue } from 'src/app/_models/commoncore';
import { CommoncoreService } from 'src/app/_services/common/commoncore.service';
import { ScreeningService } from 'src/app/_services/screening/screening.service';
import { AlphaItems } from 'src/app/_models/alphas';
import { SecurityService } from 'src/app/_services/security/security.service';
// #endregion

// #region  [ComponentDecorator]
@Component({
  selector: 'app-viewscreeningdataitems',
  templateUrl: './viewscreeningdataitems.component.html',
  styleUrls: ['./viewscreeningdataitems.component.css']
})
// #endregion

export class ViewscreeningdataitemsComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [CommonPageProperties]
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string;
  showSpinner = false;
  displayDateFormat: string;
  isSecure = false;
  subQueryParamSubscribe: any;
  // #endregion

  // #region [ListProperties]
  lstScreeningItems: AlphaItems[];
  selectedScreeningItem: AlphaItems;
  selectedScreeningDesc: string;
  // #endregion

  // #region [SubscriptionProperties]
  subGetScreeningItems: any;
  subDeleteScreeningItem: any;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private commonSvc: CommoncoreService,
    private dataSvc: DataService,
    private msgSvc: MessageService,
    private confirmSvc: ConfirmationService,
    private screeningSvc: ScreeningService,
    private securityService: SecurityService,
  ) { }
  // #endregion

  // #region [Page Events]

  // #region [ngOnInit]
  /**
   * on init - on page initilization
   */
  ngOnInit() {
    this.showSpinner = true;
    this.isSecure = false;
    this.dataSvc.changeModule(ModuleNames.Screening);
    this.dataSvc.startModule();
    this.subQueryParamSubscribe = this.activeRoute.queryParams.subscribe(params => {
      this.isSecure = false;
      this.checkSecurity();
    });
  }
  // #endregion

  // #region [CheckSecurity]
  /**
   * Checks security
   */
  checkSecurity() {
    this.isSecure = this.securityService.checkPageSecurity('Edit/View User Screening Items');
    if (this.isSecure) {
      this.initializations();
    } else {
      this.router.navigate(['/unauthorized'], { skipLocationChange: false, queryParams: { status: 'F' } });
    }
  }
  // #endregion

  // #region [ngOnDestroy]
  /**
   * on destroy - Clears all subscriptions and properties
   */
  ngOnDestroy() {
    this.clearSubscriptions();
    this.clearAllProperties();
    this.updateModuleTrack();
  }
  // #endregion

  // #region [ModuleTrack]
  /**
   * Updates module track
   */
  updateModuleTrack() {
    if (this.dataSvc.currentLoginId !== 'New') {
      const timeDiff = this.dataSvc.endModule();
      let moduleTrack: ModuleTrack;
      moduleTrack = {};
      moduleTrack.loginId = this.dataSvc.currentLoginId;
      moduleTrack.moduleName = this.dataSvc.currentModule;
      moduleTrack.totalTime = timeDiff.toString();
      this.commonSvc.updateModuleTrack(moduleTrack).subscribe((data) => {
      },
        (error) => {
          console.log(error);
        });
    }
  }
  // #endregion

  // #region [ClearSubscriptions]
  /**
   * Clears subscriptions
   */
  clearSubscriptions() {
    this.subQueryParamSubscribe ? this.subQueryParamSubscribe.unsubscribe() : this.clear();
    this.subGetScreeningItems ? this.subGetScreeningItems.unsubscribe() : this.clear();
    this.subDeleteScreeningItem ? this.subDeleteScreeningItem.unsubscribe() : this.clear();
  }

  clear() {
  }
  // #endregion

  // #region [ClearAllProperties]
  /**
   * Clears all properties
   */
  clearAllProperties() {
    this.showSpinner = true;
    this.lstScreeningItems = [];
    this.selectedScreeningItem = null;
    this.selectedScreeningDesc = '';
    this.showSpinner = false;
  }
  // #endregion

  // #region [Initializations]
  /**
   * Initializations viewscreeningdataitems component
   */
  initializations() {
    this.clearAllProperties();
    this.showSpinner = true;
    this.userId = sessionStorage.getItem(this.envKey.toString() + 'userId');
    this.displayDateFormat = 'MM/dd/yyyy';
    this.showSpinner = false;
    this.isSecure = true;
    this.getScreeningItems();
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [lstScreeningItem_Click]
  /**
   * Lsts screening item click - load selected item description
   */
  lstScreeningItem_Click() {
    this.selectedScreeningDesc = (this.selectedScreeningItem && this.selectedScreeningItem.itemDesc) ?
      this.selectedScreeningItem.itemDesc : '';
  }
  // #endregion

  // #region [btnEditScreeningItem_Click]
  /**
   * Btns edit screening item click - load selected screening Item Data in Define Screening Data Item Page
   */
  btnEditScreeningItem_Click() {
    if (this.selectedScreeningItem === null) {
      alert('Please select Screening Item');
    } else {
      this.dataSvc.changeScreeningItem(this.selectedScreeningItem);
      this.navigateByRoute(PageRoutes.DefineScreeningDataItem);
    }
  }
  // #endregion

  // #region [btnDeleteScreeningItem_Click]
  /**
   * Btns delete screening item click - Delete the selected Screening Item from Database
   */
  btnDeleteScreeningItem_Click() {
    if (this.userId && this.selectedScreeningItem && this.selectedScreeningItem !== null) {
      let alphaItem: AlphaItems;
      alphaItem = {};
      alphaItem.userId = +this.userId;
      alphaItem.itemName = this.selectedScreeningItem.itemName;
      alphaItem.itemInfo = this.selectedScreeningItem.itemInfo;
      alphaItem.itemDesc = this.selectedScreeningItem.itemDesc;
      this.confirmSvc.confirm({
        message: 'Are you sure that you want to delete - ' + this.selectedScreeningItem.itemName + ' ?',
        accept: () => {
          this.deleteScreeningItemCall(alphaItem);
        }
      });
    } else if (this.selectedScreeningItem === null) {
      alert('Please select Screening Item');
    }
  }
  // #endregion

  // #endregion

  // #region [Supporting Methods]

  // #region [GetScreeningItems]
  /**
   * Gets screening items - Load Screening Items
   */
  getScreeningItems() {
    this.showSpinner = true;
    this.clearAllProperties();
    this.subGetScreeningItems = this.screeningSvc.GetScreeningItems(this.userId).subscribe(
      (data) => {
        this.clearAllProperties();
        if (data !== undefined && data !== null && data.length > 0) {
          this.lstScreeningItems = data;
        }
        this.showSpinner = false;
      }
    );
  }
  // #endregion

  // #region [deleteScreeningItemCall]
  /**
   * Deletes screening item call
   * @param alphaItem Alpha Item
   */
  deleteScreeningItemCall(alphaItem: AlphaItems) {
    this.showSpinner = true;
    this.subDeleteScreeningItem = this.screeningSvc.deleteScreeningItem(alphaItem).subscribe((data) => {
      this.showErrorDetail(data, 'Screening Item deleted');
      this.showSpinner = false;
    },
      (error) => {
        this.showSpinner = false;
      });
  }
  // #endregion

  // #region [showErrorDetail]
  /**
   * Shows error detail
   * @param data Return Value from Database
   * @param Mode Insert/Update/Delete
   */
  showErrorDetail(data: ReturnValue, Mode: string) {
    if (data && data !== null && data.status && data.status.toString() !== '') {
      switch (data.status.toString()) {
        case 'Success':
          this.msgSvc.add({
            key: 'saveSuccess',
            sticky: true,
            severity: 'success',
            summary: 'Info Message',
            detail: Mode + ' successfully'
          });
          this.getScreeningItems();
          break;
        case 'Error':
          this.msgSvc.add({
            key: 'saveError',
            sticky: true,
            severity: 'error',
            summary: 'Error',
            detail: 'Error Occurred'
          });
          break;
        default:
          this.msgSvc.add({
            key: 'saveError',
            sticky: true,
            severity: 'error',
            summary: 'Error',
            detail: data.statusMessage.toString()
          });
          break;
      }
    } else {
      this.msgSvc.add({
        key: 'saveError',
        sticky: true,
        severity: 'error',
        summary: 'Error',
        detail: 'Error Occurred'
      });
    }
  }
  // #endregion

  // #region [navigateByRoute]
  /**
   * Navigates by route
   * @param path Navigate to Page
   */
  navigateByRoute(path) {
    const queryParamsNew: any = this.dataSvc.getQueryParams(path);
    this.dataSvc.changePagePath(queryParamsNew.Id);
    this.router.navigate([path], { queryParams: queryParamsNew, skipLocationChange: false });
  }
  // #endregion

  // #endregion
}
