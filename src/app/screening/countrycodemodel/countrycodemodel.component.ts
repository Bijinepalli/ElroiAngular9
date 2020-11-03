// #region [Imports]
import { Component, OnInit, Output, EventEmitter, ViewChild, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OverlayPanel } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleTrack, ModuleNames, ModelReturn } from 'src/app/_models/commoncore';
import { CommoncoreService } from 'src/app/_services/common/commoncore.service';
import { CountryCodes } from 'src/app/_models/screening';
import { ScreeningService } from 'src/app/_services/screening/screening.service';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-countrycodemodel',
  templateUrl: './countrycodemodel.component.html',
  styleUrls: ['./countrycodemodel.component.css']
})
// #endregion

export class CountrycodemodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [CommonPageProperties]
  showSpinner = false;
  isSecure = false;
  subQueryParamSubscribe: any;
  // #endregion

  // #region [ListProperties]

  // #endregion

  // #region [TableProperties]
  cols: any;
  recordsCount = 0;
  lstCountryCodes: CountryCodes[];
  selectedCountry: CountryCodes[];
  showReport: boolean;
  // #endregion

  // #region [SubscriptionProperties]
  subGetCountryCodes: any;
  // #endregion

  // #region [ViewChildProperties]
  @ViewChild('dt') pTableRef: Table;
  // #endregion

  // #region [Input/OutputData]
  @Input() selectedcountrycodes: string;
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
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
   * Clear subscriptions-clears all the service subscriptions
   */
  clearSubscriptions() {
    this.subQueryParamSubscribe ? this.subQueryParamSubscribe.unsubscribe() : this.clear();
    this.subGetCountryCodes ? this.subGetCountryCodes.unsubscribe() : this.clear();
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
    if (this.pTableRef) {
      this.pTableRef.reset();
    }
    this.showReport = false;
    this.recordsCount = 0;
    this.lstCountryCodes = [];
    this.selectedCountry = null;
  }
  // #endregion

  // #region [Initializations]
  /**
   * Initializations
   */
  initializations() {
    this.clearAllProperties();
    this.showSpinner = true;
    this.cols = [
      { field: 'countryId', header: 'Country ID', align: 'left', width: '10em' },
      { field: 'countryName', header: 'Country Name', align: 'left', width: '22em' },
    ];
    this.showSpinner = false;
    this.isSecure = true;
    this.getCountryCodes();
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [btnSubmit_Click]
  /**
   * Submit-Build and Submit the Description and Value of selected country values to Construct Screen
   * @param event overlaypanel properties
   * @param opError overlaypanel for validation
   */
  btnSubmit_Click(event: any, opError: OverlayPanel) {
    this.modelReturn = new ModelReturn();
    let countryLbl = '';
    let countryVal = '';
    if (this.selectedCountry !== null) {
      this.selectedCountry.sort(function fun(a, b) {
        return (+a.countryId) - (+b.countryId);
      });
      for (const country of this.selectedCountry) {
        countryLbl += country.countryId + ', ';
        countryVal += country.countryId + ',';
      }

      this.modelReturn.description = '[CountryCode]=' + countryLbl.replace(/,\s*$/, '');
      this.modelReturn.value = '(CountryCode in (' + countryVal.replace(/,\s*$/, '') + '))$$$CountryCode as ' + '\'CountryCode\'';
      this.modelReturn.mode = '';
      this.popUpSubmit.emit(this.modelReturn);
    } else {
      opError.show(event);
    }
  }
  // #endregion

  // #region [Close Modal]
  /**
   * Closes model
   */
  btnClose_Click() {
    this.popUpClose.emit('close');
  }
  // #endregion

  // #endregion

  // #region [Supporting Methods]

  // #region [GetCountryCodes]
  /**
   * Get country codes list
   */
  getCountryCodes() {
    this.showSpinner = true;
    this.clearTableProperties();
    this.showReport = false;
    this.subGetCountryCodes = this.screeningSvc.getCountryCodes().subscribe(
      (data) => {
        this.clearTableProperties();
        this.buildTableData(data);
        this.showSpinner = false;
        if (this.selectedcountrycodes != null) {
          this.editModeSelection(this.selectedcountrycodes);
        }
      }
    );
  }
  // #endregion

  // #region [Edit Mode Selection]
  /**
   * Edit mode
   * @param strText Description string from Construct Screen to edit
   */
  editModeSelection(strText: string) {
    if (strText) {
      let str1 = (strText.split('=')[1]);
      str1 = str1.replace(/ /g, '');
      const str = str1.split(',');
      this.selectedCountry = this.lstCountryCodes.filter(m => str.includes(m.countryId.toString()));
    }
  }
  // #endregion

  // #region [BuildTableData]
  /**
   * Builds table data
   * @param data country codes list
   */
  buildTableData(data: CountryCodes[]) {
    if (data !== undefined && data !== null && data.length > 0) {
      this.lstCountryCodes = data;
    }
    this.recordsCount = this.lstCountryCodes.length;
    this.showReport = true;
  }
  // #endregion

  // #endregion
}
