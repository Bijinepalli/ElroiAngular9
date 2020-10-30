// #region [Imports]
import { Component, OnInit, ViewChild, Output, EventEmitter, ViewChildren, ElementRef, QueryList, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
// import { Listbox, Button, OverlayPanel } from 'primeng/primeng';
import { Listbox } from 'primeng/listbox';
import { Button } from 'primeng/button';
import { OverlayPanel } from 'primeng/overlaypanel';
import { SelectItem } from 'primeng/api';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleTrack, ModuleNames, RecentDataNames, ModelReturn } from 'src/app/_models/commoncore';
import { CommoncoreService } from 'src/app/_services/common/commoncore.service';
import { Portfolio } from 'src/app/_models/portfolioanalysis';
import { ExistingAlphas } from 'src/app/_models/alphas';
import { AlphasService } from 'src/app/_services/alphas/alphas.service';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-alphamodel',
  templateUrl: './alphamodel.component.html',
  styleUrls: ['./alphamodel.component.css']
})
// #endregion

export class AlphamodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [CommonPageProperties]
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string;
  showSpinner = false;
  isSecure = false;
  errorMessages: string;
  // #endregion

  // #region [ListProperties]
  lstMasterFolders: Portfolio[];
  lstRecentAlphas: ExistingAlphas[];
  lstExistingAlphaItems: ExistingAlphas[];
  lstExistingAlphaDesc: ExistingAlphas[];
  selectedAlpha: ExistingAlphas;
  selectedAlphaValue: any;
  selectedRecentAlpha: any;
  selectedFolder: string;
  lstOperator: SelectItem[];
  selectedOperator: string;
  // #endregion

  // #region [SubscriptionProperties]
  subUpdateModuleTrack: any;
  subGetMasterFolders: any;
  subGetRecentAlphas: any;
  subGetExistingAlphaItems: any;
  subGetExistingAlphas: any;
  subQueryParamSubscribe: any;
  // #endregion

  // #region [ViewChild Properties]
  @ViewChildren('row', { read: ElementRef }) rowElement: QueryList<ElementRef>;
  @ViewChild('hiddenButton') hiddenButton: Button;
  @ViewChild('existingList') existingList: Listbox;
  // #endregion

  // #region [Page Properties]
  txtAlphaValue: string;
  // #endregion

  // #region [Model Properties]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  modelReturn: ModelReturn;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private activeRoute: ActivatedRoute,
    private commonSvc: CommoncoreService,
    private alphaSvc: AlphasService,
    private dataSvc: DataService,
  ) { }
  // #endregion

  // #region [Page Events]

  // #region [ngOnInit]
  /**
   * on init-on page initialization
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
    this.isSecure = true;
    if (this.isSecure) {
      this.initializations();
    }
  }
  // #endregion

  // #region [ngOnDestroy]
  /**
   * on destroy-clears all the subscriptions,properties
   */
  ngOnDestroy() {
    this.clearSubscriptions();
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
      this.subUpdateModuleTrack = this.commonSvc.updateModuleTrack(moduleTrack).subscribe((data) => {
      },
        (error) => {
          console.log(error);
        });
    }
  }
  // #endregion

  // #region [ClearSubscriptions]
  /**
   * Clear subscriptions-clears all the service subscriptions
   */
  clearSubscriptions() {
    this.subQueryParamSubscribe ? this.subQueryParamSubscribe.unsubscribe() : this.clear();
    this.subUpdateModuleTrack ? this.subUpdateModuleTrack.unsubscribe() : this.clear();
    this.subGetMasterFolders ? this.subGetMasterFolders.unsubscribe() : this.clear();
    this.subGetRecentAlphas ? this.subGetRecentAlphas.unsubscribe() : this.clear();
    this.subGetExistingAlphaItems ? this.subGetExistingAlphaItems.unsubscribe() : this.clear();
    this.subGetExistingAlphas ? this.subGetExistingAlphas.unsubscribe() : this.clear();
  }

  /**
   * Clear
   */
  clear() {
  }
  // #endregion

  // #region [Initializations]
  /**
   * Initializations
   */
  initializations() {
    this.showSpinner = true;
    this.userId = sessionStorage.getItem(this.envKey.toString() + 'userId');
    this.lstOperator = [
      { label: '>', value: '>' },
      { label: '<', value: '<' },
      { label: '=', value: '=' },
      { label: '!=', value: '!=' },
      { label: '>=', value: '>=' },
      { label: '<=', value: '<=' },
    ];
    this.selectedOperator = '>';
    this.showSpinner = false;
    this.lstRecentAlphas = [];
    this.lstExistingAlphaItems = [];
    this.lstExistingAlphaDesc = [];
    this.selectedFolder = '';
    this.getFolders();
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [lstAlpha_Click]
  /**
   * Alpha click-Get Description of selected Alpha Item
   */
  lstAlpha_Click() {
    this.selectedAlphaValue = [];
    this.selectedAlphaValue = this.lstExistingAlphaItems.filter(m => m.value === this.selectedAlpha).map(p => p.valDesc)[0];
    this.lstExistingAlphaDesc = [];
    if (this.selectedAlphaValue !== undefined && this.selectedAlphaValue !== null && this.selectedAlphaValue.length > 0) {
      this.lstExistingAlphaDesc = this.selectedAlphaValue.map(m => (
        {
          label: m.label,
          value: m.value
        }
      ));
    }
  }
  // #endregion

  // #region [drpRecentAlpha_Change]
  /**
   * Recent alpha change-Used to load Existing Alpha Items related to selected Recent Alpha Item
   */
  drpRecentAlpha_Change() {
    this.selectedAlpha = null;
    this.selectedFolder = this.selectedRecentAlpha.folder.toString();
    this.lstExistingAlphaItems = [];
    this.lstExistingAlphaDesc = [];
    if (this.selectedFolder === null) {

    } else {
      this.showSpinner = true;
      this.subGetExistingAlphaItems = this.alphaSvc.getExistingAlphaStrategy(this.selectedFolder).subscribe(
        (data) => {
          if (data !== undefined && data !== null && data.length > 0) {
            this.lstExistingAlphaItems = data.map(m => (
              {
                label: m.itemName,
                value: m.itemName,
                folder: m.folder,
                valDesc: m.itemDetails,
                userId: m.userId
              }
            ));
          }
          if (this.lstExistingAlphaItems && this.lstExistingAlphaItems.length > 0) {
            this.selectedAlpha = this.lstExistingAlphaItems.filter(m => m.label === this.selectedRecentAlpha.name).map(P => P.value)[0];
            this.lstAlpha_Click();
            window.setTimeout(function fun() {
              const element = document.getElementById('hiddenButton') as HTMLElement;
              element.click();
            }, 0);
          } else {
            this.selectedAlpha = null;
          }
          this.showSpinner = false;
        });
    }
  }
  // #endregion

  // #region [drpFolder_Change]
  /**
   * On Folder change-Loads Recent Alpha Items and Existing Alpha Items of selected Folder
   */
  drpFolder_Change() {
    this.selectedAlpha = null;
    this.lstExistingAlphaItems = [];
    this.lstExistingAlphaDesc = [];
    if (this.selectedFolder === null) {

    } else {
      this.showSpinner = true;
      this.subGetExistingAlphas = this.alphaSvc.getExistingAlphaStrategy(this.selectedFolder).subscribe(
        (data) => {
          if (data !== undefined && data !== null && data.length > 0) {
            this.lstExistingAlphaItems = data.map(m => (
              {
                label: m.itemName,
                value: m.itemName,
                folder: m.folder,
                valDesc: m.itemDetails,
                userId: m.userId
              }
            ));
          }
          if (this.lstExistingAlphaItems && this.lstExistingAlphaItems.length > 0) {
            this.selectedAlpha = this.lstExistingAlphaItems[0].value;
            this.lstAlpha_Click();
          } else {
            this.selectedAlpha = null;
          }
          this.showSpinner = false;
        });
    }
  }
  // #endregion

  // #region [btnHidden_Click]
  /**
   * Hidden button click-selecting the Existing Alpha Item of selected Recent Alpha Item
   */
  btnHidden_Click() {
    const el = this.rowElement.find(r => r.nativeElement.getAttribute('id') === this.selectedRecentAlpha.name);
    el.nativeElement.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'center' });
  }
  // #endregion

  // #region [btnClose_Click]
  /**
   * Closes model
   */
  btnClose_Click() {
    this.popUpClose.emit('close');
  }
  // #endregion

  // #region [btnSubmit_Click]
  /**
   * Submit-Build and Submit the Description and Value of selected criteria
   * @param event overlaypanel properties
   * @param opError show overlaypanel for validation
   */
  btnSubmit_Click(event: any, opError: OverlayPanel) {
    this.modelReturn = new ModelReturn();
    if (this.txtAlphaValue != null) {
      this.modelReturn.description = '[' + this.selectedAlpha + ']' + this.selectedOperator + this.txtAlphaValue;
      this.modelReturn.value = 'order by _' + this.selectedOperator + '_' + this.txtAlphaValue +
        '_alphascreening$$$[' + this.selectedAlpha + ']_alphascreening';
      this.modelReturn.mode = '';
      this.popUpSubmit.emit(this.modelReturn);
    } else {
      this.errorMessages = 'Enter first value';
      opError.show(event);
    }
  }
  // #endregion

  // #endregion

  // #region [Supporting Methods]

  // #region [Get Folders]
  /**
   * Get folders-Get Folders list of loggedin User
   */
  getFolders() {
    this.showSpinner = true;
    this.subGetMasterFolders = this.commonSvc.getMasterFolders(this.userId.toString()).subscribe(
      (data) => {
        this.lstMasterFolders = [];
        if (data !== undefined && data !== null && data.length > 0) {
          this.lstMasterFolders = data;
        }
        this.getRecentAlphas();
        this.showSpinner = false;
      }
    );
  }
  // #endregion

  // #region [Get Recent Alphas]
  /**
   * Get recent alphas-Get Recent Top 5 ALphas Items
   */
  getRecentAlphas() {
    this.showSpinner = true;
    this.subGetRecentAlphas = this.commonSvc.getRecentData(this.userId.toString(), RecentDataNames.Alphas.toString()).subscribe(
      (data) => {
        this.lstRecentAlphas = [];
        if (data !== undefined && data !== null && data.length > 0) {
          for (const dataItem of data) {
            this.lstRecentAlphas.push({
              label: dataItem.name,
              value: { folder: dataItem.folder, name: dataItem.name }
            });
          }
        }
        this.showSpinner = false;
      }
    );
  }
  // #endregion

  // #endregion

}
