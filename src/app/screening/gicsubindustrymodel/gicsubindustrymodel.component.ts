// #region [Imports]
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OverlayPanel } from 'primeng/primeng';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleTrack, ModuleNames, ModelReturn } from 'src/app/_models/commoncore';
import { CommoncoreService } from 'src/app/_services/common/commoncore.service';
import { Industries } from 'src/app/_models/alphas';
import { AlphasService } from 'src/app/_services/alphas/alphas.service';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-gicsubindustrymodel',
  templateUrl: './gicsubindustrymodel.component.html',
  styleUrls: ['./gicsubindustrymodel.component.css']
})
// #endregion

export class GicsubindustrymodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [CommonPageProperties]
  showSpinner: boolean;
  isSecure = false;
  subQueryParamSubscribe: any;
  // #endregion

  // #region [ListProperties]
  lstIndustries: Industries[];
  // #endregion

  // #region [Subscription Properties]
  subGetSubIndustriesList: any;
  // #endregion

  // #region [Input / Output Properties]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  @Input() selectedGICSubIndustries: string;
  modelReturn: ModelReturn;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private activeRoute: ActivatedRoute,
    private commonSvc: CommoncoreService,
    private dataSvc: DataService,
    private alphaSvc: AlphasService,
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
   * Clear subscriptions-clear all service subscriptions
   */
  clearSubscriptions() {
    this.subQueryParamSubscribe ? this.subQueryParamSubscribe.unsubscribe() : this.clear();
    this.subGetSubIndustriesList ? this.subGetSubIndustriesList.unsubscribe() : this.clear();
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
    this.lstIndustries = [];
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
    for (const lstIndustry of this.lstIndustries) {
      filteredList = [];
      selectedIndust = [];
      filteredList = lstIndustry.children;
      selectedIndust = filteredList.filter(y => y.isSelected === true);
      for (const industries of selectedIndust) {
        selectIndustIds = selectIndustIds + ',' + industries.value;
        selectIndustLabel = selectIndustLabel + ',' + industries.label;
      }
    }
    if (selectIndustIds !== '') {
      this.modelReturn.description = '[SubIndustry]=' + selectIndustIds.substring(1);
      this.modelReturn.value = '(SubIndustryID in (' + selectIndustIds.substring(1) +
        '))$$$SubIndustryID as ' + '\'' + 'SubIndustry' + '\'';
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
   * Get industries-get GIC SubIndustries list
   */
  getIndustries() {
    this.showSpinner = true;
    this.subGetSubIndustriesList = this.alphaSvc.getSubIndustriesList().subscribe(
      (data) => {
        this.lstIndustries = data;
        this.showSpinner = false;
        if (this.selectedGICSubIndustries != null) {
          this.editMode(this.selectedGICSubIndustries);
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
    for (const industries of this.lstIndustries) {
      filteredList = [];
      selectedIndust = [];
      filteredList = industries.children;
      for (const strItem of str1) {
        const val = filteredList.findIndex(m => m.value === strItem);
        if (val >= 0) {
          industries.children[val].isSelected = true;
          this.chkChildCheck_Change(industries, filteredList);
        }
      }
    }
  }
  // #endregion

  // #endregion
}
