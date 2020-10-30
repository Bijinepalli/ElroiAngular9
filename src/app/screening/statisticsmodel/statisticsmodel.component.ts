// #region [Imports]
import { Component, OnInit, EventEmitter, Output, OnDestroy, } from '@angular/core';
import { SelectItem, Message } from 'primeng/api';
import { ExportService } from 'src/app/_services/export/export.service';
import { DataService } from 'src/app/_services/data/data.service';
import { environment } from 'src/environments/environment';
import { ScreeningService } from 'src/app/_services/screening/screening.service';
import { Items } from 'src/app/_models/alphas';
import { PortfolioanalysisService } from 'src/app/_services/portfolioanalysis/portfolioanalysis.service';
import { AlphasService } from 'src/app/_services/alphas/alphas.service';
import { ModelReturn } from 'src/app/_models/commoncore';
import { DatePipe } from '@angular/common';
import { OverlayPanel } from 'primeng/primeng';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-statisticsmodel',
  templateUrl: './statisticsmodel.component.html',
  styleUrls: ['./statisticsmodel.component.css']
})
// #endregion

export class StatisticsmodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [CommonPageProperties]
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string;
  modelReturn: ModelReturn;
  errorMessages: string;
  boolSelectTime: boolean;
  selectedTime: string;
  txtStartPeriod: string;
  txtEndPeriod: string;
  // #endregion

  // #region [Input/Output Properties]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  // #endregion

  // #region [ListProperties]
  lstSeries: SelectItem[];
  lstStartPeriod: SelectItem[];
  lstEndPeriod: SelectItem[];
  lstItem: SelectItem[];
  lstCrossSeries: SelectItem[];
  lstCrossType: SelectItem[];
  lstSeriesData: SelectItem[];
  lstSectors: SelectItem[];
  lstGroups: SelectItem[];
  lstIndustries: SelectItem[];
  lstItems: Items[];
  selectedItem: Items;
  lstCategories: Items[];
  selectedCategory: Items;
  lstMasterItems: Items[];
  // #endregion

  // #region [GeneralProperties]
  errMsgs: Message[] = [];
  selectedSeries: string;
  selectedStartPeriod: string;
  selectedEndPeriod: string;
  selectedCrossSeries: string;
  selectedCrossType: string;
  selectedSeriesData: SelectItem;
  // #endregion

  // #region [DateProperties]
  selectedDate: Date;
  invalidDates: Array<Date>;
  maximumDate: any;
  maxDate: Date;
  // #endregion

  // #region [SubscriptionProperties]
  subGetMaxDate: any;
  subCategoryItemsList: any;
  subGetBenchmarks: any;
  subGetSGITypes: any;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private dataSvc: DataService,
    public exportSvc: ExportService,
    public portfolioSvc: PortfolioanalysisService,
    private alphaSvc: AlphasService,
    private screeningSvc: ScreeningService,
    public datePipe: DatePipe,
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
   * on destroy-clears all the subscriptions and properties
   */
  ngOnDestroy() {
    this.clearSubscriptions();
    this.clearAllProperties();
  }
  // #endregion

  // #region [ClearSubscriptions]
  /**
   * Clears subscriptions-clear all the service subscriptions
   */
  clearSubscriptions() {
    this.subGetBenchmarks ? this.subGetBenchmarks.unsubscribe() : this.clear();
    this.subGetMaxDate ? this.subGetMaxDate.unsubscribe() : this.clear();
    this.subGetSGITypes ? this.subGetSGITypes.unsubscribe() : this.clear();
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
    this.lstCrossType = [];
    this.lstCrossSeries = [];
    this.lstEndPeriod = [];
    this.lstStartPeriod = [];
    this.lstSeries = [];
    this.lstItem = [];
    this.lstSeriesData = [];
    this.invalidDates = [];
    this.errMsgs = [];
    this.selectedItem = null;
    this.selectedSeries = '';
    this.selectedDate = null;
    this.selectedStartPeriod = '';
    this.selectedEndPeriod = '';
    this.selectedCrossSeries = '';
    this.selectedCrossType = '';
    this.selectedSeriesData = null;
    this.boolSelectTime = false;
    this.selectedTime = '';
    this.txtStartPeriod = '';
    this.txtEndPeriod = '';
  }
  // #endregion

  // #region [initializations]
  /**
   * Initializations
   */
  initializations() {
    this.clearAllProperties();
    this.maxDate = new Date();
    this.invalidDates = this.dataSvc.lstInvalidDates;
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
      { label: 'BenchMarks', value: '1' },
      { label: 'Sectors', value: '2' },
      { label: 'Groups', value: '3' },
      { label: 'Industries', value: '4' },
    ];

    this.lstCrossType = [
      { label: 'Mean', value: 'Mean' },
      { label: 'Median', value: 'Median' },
      { label: 'Mode', value: 'Mode' },
    ];
    this.selectedCrossType = this.lstCrossType[0].value;

    this.selectedSeries = '';
    this.userId = sessionStorage.getItem(this.envKey.toString() + 'userId');
    this.getCategories();
    this.getSGITypes();
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [btnLoadSeriesData_Change]
  /**
   * Loads series data
   */
  btnLoadSeriesData_Change() {
    this.lstSeriesData = [];
    this.selectedSeriesData = null;
    if (this.selectedCrossSeries === '1') {
      this.getBenchmarksData();
    } else if (this.selectedCrossSeries === '2') {
      if (this.lstSectors.length > 0) {
        this.lstSeriesData = this.lstSectors.map(m => (
          {
            label: m.label,
            value: m
          }
        ));
      }
    } else if (this.selectedCrossSeries === '3') {
      if (this.lstGroups.length > 0) {
        this.lstSeriesData = this.lstGroups.map(m => (
          {
            label: m.label,
            value: m
          }
        ));
      }
    } else if (this.selectedCrossSeries === '4') {
      if (this.lstIndustries.length > 0) {
        this.lstSeriesData = this.lstIndustries.map(m => (
          {
            label: m.label,
            value: m
          }
        ));
      }
    }
  }
  // #endregion

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
      if (this.selectedCrossType !== '') {
        if (this.selectedCategory.label !== 'Financial Ratios' && this.selectedCategory.label !== 'Financial Statement') {
          const dateConvert = ((this.selectedDate !== null && this.selectedDate.toString() !== '') ?
            (this.datePipe.transform(this.selectedDate, 'M/d/yyyy')) : 0);
          if (this.selectedSeriesData !== null) {
            let selVal = '';
            if (this.selectedCrossSeries === '2') {
              if (this.lstGroups.findIndex(m => m.label.trim() === this.selectedSeriesData.label.trim()) !== -1) {
                selVal = 'Sector' + this.selectedSeriesData.label.replace(/ /g, '');
              } else if (this.lstIndustries.findIndex(m => m.label.trimRight() === this.selectedSeriesData.label.trim()) !== -1) {
                selVal = 'Sector' + this.selectedSeriesData.label.replace(/ /g, '');
              } else {
                selVal = this.selectedSeriesData.label.replace(/ /g, '');
              }
            } else if (this.selectedCrossSeries === '3') {
              if (this.lstSectors.findIndex(m => m.label.trim() === this.selectedSeriesData.label.trim()) !== -1) {
                selVal = 'Group' + this.selectedSeriesData.label.replace(/ /g, '');
              } else if (this.lstIndustries.findIndex(m => m.label.trim() === this.selectedSeriesData.label.trim()) !== -1) {
                selVal = 'Group' + this.selectedSeriesData.label.replace(/ /g, '');
              } else {
                selVal = this.selectedSeriesData.label.replace(/ /g, '');
              }
            } else if (this.selectedCrossSeries === '4') {
              if (this.lstSectors.findIndex(m => m.label.trim() === this.selectedSeriesData.label.trim()) !== -1) {
                selVal = 'Industry' + this.selectedSeriesData.label.replace(/ /g, '');
              } else if (this.lstGroups.findIndex(m => m.label.trim() === this.selectedSeriesData.label.trim()) !== -1) {
                selVal = 'Industry' + this.selectedSeriesData.label.replace(/ /g, '');
              } else {
                selVal = this.selectedSeriesData.label.replace(/ /g, '');
              }
            } else if (this.selectedCrossSeries === '1') {
              selVal = this.selectedSeriesData.label.replace(/ /g, '');
            }
            this.modelReturn.description = '(' + this.selectedCrossType + ';' + this.selectedItem.label.replace(/ /g, '') + ';' +
              (this.selectedTime === '' ? dateConvert : this.selectedTime) + ';' + selVal + ')';
          } else {
            this.modelReturn.description = '(' + this.selectedCrossType + ';' + this.selectedItem.label.replace(/ /g, '') + ';' +
              (this.selectedTime === '' ? dateConvert : this.selectedTime) + ')';
          }
          this.modelReturn.value = '';
          this.modelReturn.mode = '';
          this.popUpSubmit.emit(this.modelReturn);
        } else {
          this.errorMessages = 'Not A Valid Data Item';
          opError.show(event);
        }
      } else {
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
      this.selectedSeries = '0';
    }
  }
  // #endregion

  // #endregion

  // #region [Supporting Methods]

  // #region [Get SGI Types]
  /**
   * Get Sectors,Groups,Industries list
   */
  getSGITypes() {
    this.subGetSGITypes = this.alphaSvc.getSGITypesList().subscribe(
      (files) => {
        this.lstSectors = files[0];
        this.lstGroups = files[1];
        this.lstIndustries = files[2];
      }
    );
  }
  // #endregion

  // #region [GetBenchmarks]
  /**
   * Get benchmarks data
   */
  getBenchmarksData() {
    this.subGetBenchmarks = this.portfolioSvc.getBenchmarks().subscribe(
      (data) => {
        this.lstSeriesData = [];
        if (data !== undefined && data !== null && data.length > 0) {
          this.lstSeriesData = data.map(m => (
            {
              label: m.benchmark,
              value: { label: m.benchmark, value: m.benchmark }
            }
          ));
        }
      }
    );
  }
  // #endregion

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

  // #region [buildItemValues]
  /**
   * Builds item values-filter Categories list from Master Categories List
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
