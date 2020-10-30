// #region [Imports]
import { Component, OnInit, EventEmitter, Output, OnDestroy, } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ExportService } from 'src/app/_services/export/export.service';
import { Items } from 'src/app/_models/alphas';
import { ScreeningService } from 'src/app/_services/screening/screening.service';
import { environment } from 'src/environments/environment';
import { OverlayPanel } from 'primeng/primeng';
import { ModelReturn } from 'src/app/_models/commoncore';
import { DatePipe } from '@angular/common';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-mathmodel',
  templateUrl: './mathmodel.component.html',
  styleUrls: ['./mathmodel.component.css']
})
// #endregion

export class MathmodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [CommonPageProperties]
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string;
  // #endregion

  // #region [Input/Output Data]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  // #endregion

  // #region [ListProperties]
  lstSeries: SelectItem[];
  lstStartPeriod: SelectItem[];
  lstEndPeriod: SelectItem[];
  lstCrossSeries: SelectItem[];
  selectedDate: string;
  lstItems: Items[];
  selectedItem: Items;
  lstCategories: Items[];
  selectedCategory: Items;
  lstMasterItems: Items[];
  // #endregion

  // #region [GeneralProperties]
  modelReturn: ModelReturn;
  selectedSeries: string;
  selectedStartPeriod: string;
  selectedEndPeriod: string;
  selectedCrossSeries: string;
  txtStartPeriod: string;
  txtEndPeriod: string;
  boolSelectTime: boolean;
  selectedTime: string;
  errorMessages: string;
  // #endregion

  // #region [SubscriptionProperties]
  subCategoryItemsList: any;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    public exportSvc: ExportService,
    public datePipe: DatePipe,
    private screeningSvc: ScreeningService, // Service of the corresponding Module
  ) { }
  // #endregion

  // #region [Page Events]

  // #region [ngOnInit]
  /**
   * on init-on page initialization
   */
  ngOnInit() {
    this.initializations();
  }
  // #endregion

  // #region [ngOnDestroy]
  /**
   * on destroy-Clears all the subscriptions and properties
   */
  ngOnDestroy() {
    this.clearSubscriptions();
    this.clearAllProperties();
  }
  // #endregion

  // #region [ClearSubscriptions]
  /**
   * Clear subscriptions-clears all the service subscriptions
   */
  clearSubscriptions() {
    this.subCategoryItemsList ? this.subCategoryItemsList.unsubscribe() : this.clear();
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
    this.lstCrossSeries = [];
    this.lstEndPeriod = [];
    this.lstStartPeriod = [];
    this.lstSeries = [];
    this.selectedSeries = '';
    this.selectedItem = null;
    this.selectedDate = null;
    this.selectedStartPeriod = '';
    this.selectedEndPeriod = '';
    this.selectedCrossSeries = '';
    this.boolSelectTime = false;
    this.selectedTime = '';
    this.txtStartPeriod = '';
    this.txtEndPeriod = '';
  }
  // #endregion

  // #region [Initializations]
  /**
   * Initializations
   */
  initializations() {
    this.clearAllProperties();
    this.boolSelectTime = false;
    this.lstSeries = [
      { label: 'Cross', value: '1' },
      { label: 'Time', value: '2' },
      { label: 'None', value: '0' },
    ];
    this.lstEndPeriod = [
      { label: 'Days', value: 'Days' },
      { label: 'Weeks', value: 'Weeks' },
      { label: 'Months', value: 'Months' },
      { label: 'Quarters', value: 'Quarters' },

    ];
    this.selectedEndPeriod = this.lstEndPeriod[0].value;
    this.lstStartPeriod = [
      { label: 'Days', value: 'Days' },
      { label: 'Weeks', value: 'Weeks' },
      { label: 'Months', value: 'Months' },
      { label: 'Quarters', value: 'Quarters' },
    ];
    this.selectedStartPeriod = this.lstStartPeriod[0].value;
    this.lstCrossSeries = [
      { label: 'AVG', value: 'AVG' },
      { label: 'MIN', value: 'MIN' },
      { label: 'MAX', value: 'MAX' },
    ];
    this.selectedCrossSeries = 'AVG';
    this.selectedSeries = '';
    this.userId = sessionStorage.getItem(this.envKey.toString() + 'userId');
    this.getCategories();
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [lstCategory_Change]
  /**
   * Category change-load Items on selected category
   * @param category null
   */
  lstCategory_Change(category) {
    this.lstItems = [];
    this.selectedItem = null;
    if (category !== null) {
      this.selectedCategory = category.value;
    } else {
      if (this.lstCategories && this.lstCategories !== null && this.lstCategories.length > 0) {
        this.selectedCategory = this.lstCategories[0];
      }
    }
    this.lstItems = this.lstMasterItems.filter(P => P.categoryId === this.selectedCategory.value);
    this.selectedItem = this.lstItems[0];
  }
  // #endregion

  // #region [btnSubmit_Click]
  /**
   * Submit-Build and Submit the Description and Value of selected criteria to Construct Screen
   * @param event overlaypanel properties
   * @param opError overlaypanel for validation
   */
  btnSubmit_Click(event: any, opError: OverlayPanel) {
    if (this.selectedSeries === '2') {
      if (this.txtStartPeriod !== '' && this.txtEndPeriod !== '') {
        if (this.selectedStartPeriod === this.selectedEndPeriod) {
          this.selectedSeries = '1';
          this.boolSelectTime = true;
          this.selectedTime = this.txtStartPeriod + this.selectedStartPeriod + ';' + this.txtEndPeriod + this.selectedEndPeriod;
        } else {
          this.errorMessages = 'Start and End Options should be same';
          opError.show(event);
        }
      } else {
        this.errorMessages = 'Please enter Start and End Periods ';
        opError.show(event);
      }
    } else {
      this.modelReturn = new ModelReturn();
      if (this.selectedCategory.label !== 'Financial Ratios' && this.selectedCategory.label !== 'Financial Statement') {
        const dateConvert = ((this.selectedDate !== null && this.selectedDate.toString() !== '') ?
          (this.datePipe.transform(this.selectedDate, 'MM/dd/yyyy')) : 0);
        this.modelReturn.description = '(' + this.selectedCrossSeries + ';' + this.selectedItem.label.replace(/ /g, '') + ';' +
          (this.selectedTime === '' ? dateConvert : this.selectedTime) + ')';
        this.modelReturn.value = '';
        this.modelReturn.mode = '';
        this.popUpSubmit.emit(this.modelReturn);
      } else {
        this.errorMessages = 'Not A Valid Data Item';
        opError.show(event);
      }
    }
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

  // #region [btnSeries_Change]
  /**
   * Series change
   * @param event Selected Series Value
   */
  btnSeries_Change(event: any) {
    if (event.value === '0') {
      this.initializations();
    }
  }
  // #endregion

  // #endregion

  // #region [Supporting Methods]

  // #region [GetCategories]
  /**
   * Get categories list
   */
  getCategories() {
    this.subCategoryItemsList = this.screeningSvc.getScreeningCategoryItemsList(this.userId).subscribe(
      (data) => {
        this.buildItemValues(data);
      }
    );
  }
  // #endregion

  // #region [BuildItemValues]
  /**
   * Build item values-filter Categories list from Master Categories List
   * @param data categories list
   */
  buildItemValues(data) {
    if (data && data !== null && data.length > 0) {
      if (data[0] && data[0] !== null && data[0].length > 0) {
        this.lstCategories = data[0];
        this.lstCategories.push({ label: 'My DataItems', value: '999' });
      }
    }
    if (data[1] && data[1] !== null && data[1].length > 0) {
      this.lstMasterItems = data[1];
    }
    this.lstCategory_Change(null);
  }
  // #endregion

  // #endregion
}
