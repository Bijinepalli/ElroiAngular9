// #region [Imports]
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OverlayPanel } from 'primeng/primeng';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleTrack, ModuleNames, ModelReturn } from 'src/app/_models/commoncore';
import { CommoncoreService } from 'src/app/_services/common/commoncore.service';
import { Industries } from 'src/app/_models/alphas';
import { ScreeningService } from 'src/app/_services/screening/screening.service';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-russellindustrymodel',
  templateUrl: './russellindustrymodel.component.html',
  styleUrls: ['./russellindustrymodel.component.css']
})
// #endregion

export class RussellindustrymodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [CommonPageProperties]
  showSpinner: boolean;
  isSecure = false;
  subQueryParamSubscribe: any;
  // #endregion

  // #region [ListProperties]
  lstRussellIndustries: Industries[];
  // #endregion

  // #region [Subscription Properties]
  subGetRussellIndustriesList: any;
  // #endregion

  // #region [Input / Output Properties]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  @Input() selectedRusselIndustry: string;
  modelReturn: ModelReturn;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private activeRoute: ActivatedRoute,
    private commonSvc: CommoncoreService,
    private dataSvc: DataService,
    private screeningSvc: ScreeningService,
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
    this.dataSvc.changeModule(ModuleNames.UserManagement);
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
   * on destroy-clears all the subscriptions and properties
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
   * Clears subscriptions-clear all service subscriptions
   */
  clearSubscriptions() {
    this.subQueryParamSubscribe ? this.subQueryParamSubscribe.unsubscribe() : this.clear();
    this.subGetRussellIndustriesList ? this.subGetRussellIndustriesList.unsubscribe() : this.clear();
  }
  /**
   * Clear
   */
  clear() {
  }
  // #endregion

  // #region [ClearAllProperties]
  /**
   * Clears all properties
   */
  clearAllProperties() {
    this.showSpinner = true;
    this.clearTableProperties();
    this.showSpinner = false;
  }
  // #endregion

  // #region [clearTableProperties]
  /**
   * Clears table properties
   */
  clearTableProperties() {
    this.lstRussellIndustries = [];
  }
  // #endregion

  // #region [Initializations]
  /**
   * Initializations
   */
  initializations() {
    this.clearAllProperties();
    this.isSecure = true;
    this.getIndustries();
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [chkParentCheck_Change]
  /**
   * Parent check-used to check all the child checkboxes when parent checkbox is checked
   * @param parentObj Industries model
   */
  chkParentCheck_Change(parentObj: Industries) {
    for (const parentChild of parentObj.children) {
      parentChild.isSelected = parentObj.isSelected;
    }
  }
  // #endregion

  // #region [chkChildCheck_Change]
  /**
   * Child check-used to check parent checkbox when all the child checkboxes are checked
   * @param parentObj Industries model
   * @param childObj child checkbox value
   */
  chkChildCheck_Change(parentObj, childObj) {
    parentObj.isSelected = childObj.every(function fun(children: any) {
      return children.isSelected === true;
    });
  }
  // #endregion

  // #region [btnSubmit_Click]
  /**
   * Submit-Build and Submit the Description and Value of selected criteria to Construct Screen
   * @param event overlaypanel properties
   * @param opError overlaypanel for validation
   */
  btnSubmit_Click(event: any, opError: OverlayPanel) {
    this.modelReturn = new ModelReturn();
    let filteredList: any[];
    let selectedIndust: any[];
    let selectIndustIds = '';
    let selectIndustLabel = '';
    for (const russellIndustry of this.lstRussellIndustries) {
      filteredList = [];
      selectedIndust = [];
      filteredList = russellIndustry.children;
      selectedIndust = filteredList.filter(y => y.isSelected === true);
      for (const industry of selectedIndust) {
        selectIndustIds = selectIndustIds + ',' + industry.value;
        selectIndustLabel = selectIndustLabel + ',' + industry.label;
      }
    }
    if (selectIndustIds !== '') {
      this.modelReturn.description = '[RusselIndustry]=' + selectIndustIds.substring(1);
      this.modelReturn.value = '(RusselIndustryId in (' + selectIndustIds.substring(1) + '))$$$RusselIndustryId as ' +
        '\'' + 'RusselIndustry' + '\'';
      this.modelReturn.mode = '';
      this.popUpSubmit.emit(this.modelReturn);
    } else {
      opError.show(event);
    }
  }
  // #endregion

  // #region [btnClose_Click]
  /**
   * Closes modal
   */
  btnClose_Click() {
    this.popUpClose.emit('close');
  }
  // #endregion

  // #endregion

  // #region [Supporting Methods]

  // #region [GetIndustries]
  /**
   * Get industries-get Russell Industries list
   */
  getIndustries() {
    this.showSpinner = true;
    this.subGetRussellIndustriesList = this.screeningSvc.getRussellIndustriesList().subscribe(
      (data) => {
        this.lstRussellIndustries = data;
        this.showSpinner = false;
        if (this.selectedRusselIndustry != null) {
          this.editMode(this.selectedRusselIndustry);
        }
      }
    );
  }
  // #endregion

  // #region [EditMode]
  /**
   * Edit mode
   * @param strText Description string from Construct Screen to edit
   */
  editMode(strText: string) {
    let filteredList: any[];
    let selectedIndust: any[];
    const str = strText.split('=')[1];
    const str1 = str.split(',');
    for (const russellIndustry of this.lstRussellIndustries) {
      filteredList = [];
      selectedIndust = [];
      filteredList = russellIndustry.children;
      for (const strItem of str1) {
        const val = filteredList.findIndex(m => m.value === strItem);
        if (val >= 0) {
          russellIndustry.children[val].isSelected = true;
          this.chkChildCheck_Change(russellIndustry, filteredList);
        }
      }
    }
  }
  // #endregion

  // #endregion
}
