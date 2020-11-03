
// #region [Imports]
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { OverlayPanel } from 'primeng/primeng';
import { SelectItem } from 'primeng/api';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleNames, ModelReturn } from 'src/app/_models/commoncore';
import { Items } from 'src/app/_models/alphas';
import { ScreeningService } from 'src/app/_services/screening/screening.service';
import { ExportService } from 'src/app/_services/export/export.service';
import { PortfolioanalysisService } from 'src/app/_services/portfolioanalysis/portfolioanalysis.service';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-decilemodel',
  templateUrl: './decilemodel.component.html',
  styleUrls: ['./decilemodel.component.css']
})
// #endregion

export class DecilemodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [CommonPageProperties]
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string;
  errorMessages: string;
  modelReturn: ModelReturn;
  // #endregion

  // #region [Input/Output Data]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  @Input() selectedDecile: string;
  // #endregion

  // #region [ListProperties]
  lstSeries: SelectItem[];
  lstOperator: SelectItem[];
  lstUniverse: SelectItem[];
  lstItems: Items[];
  selectedItem: Items;
  lstCategories: Items[];
  selectedCategory: Items;
  lstMasterItems: Items[];
  selectedBenchmark: string;
  // #endregion

  // #region [GeneralProperties]
  txtValue: string;
  selectedSeries: string;
  selectedOperator: string;
  // #endregion

  // #region [DateProperties]
  selectedDate: Date;
  invalidDates: Array<Date>;
  maxDate: Date;
  // #endregion

  // #region [SubscriptionProperties]
  subGetBenchmarks: any;
  subCategoryItemsList: any;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private dataSvc: DataService,
    public exportSvc: ExportService,
    private portfolioSvc: PortfolioanalysisService,
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
    this.dataSvc.changeModule(ModuleNames.Screening);
    this.dataSvc.startModule();
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
   * Clears subscriptions-clears all the service subscriptions
   */
  clearSubscriptions() {
    this.subGetBenchmarks ? this.subGetBenchmarks.unsubscribe() : this.clear();
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
    this.selectedOperator = '';
    this.lstOperator = [];
    this.txtValue = '';
    this.lstSeries = [];
    this.lstUniverse = [];
    this.selectedBenchmark = '';
    this.selectedDate = null;
  }
  // #endregion

  // #region [Initializations]
  /**
   * Initializations
   */
  initializations() {
    this.clearAllProperties();
    this.getBenchmarks();
    this.maxDate = new Date();
    this.invalidDates = this.dataSvc.lstInvalidDates;
    this.txtValue = '1';
    this.lstSeries = [
      { label: 'Equal', value: 'Equal' },
      { label: 'Market', value: 'Market' },
    ];
    this.selectedSeries = 'Equal';
    this.lstOperator = [
      { label: '>', value: '>' },
      { label: '<', value: '<' },
      { label: '=', value: '=' },
      { label: '!=', value: '!=' },
      { label: '>=', value: '>=' },
      { label: '<=', value: '<=' },
    ];
    this.selectedOperator = '>';
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
    this.modelReturn = new ModelReturn();
    if (this.selectedBenchmark !== '') {
      if (this.selectedCategory.label !== 'Financial Ratios' && this.selectedCategory.label !== 'Financial Statement') {
        const dateConvert = ((this.selectedDate !== null && this.selectedDate.toString() !== '') ?
          (this.datePipe.transform(this.selectedDate, 'M/d/yyyy')) : 0);
        this.modelReturn.description = '[DECILING^' + this.selectedSeries + '^' + this.selectedBenchmark + '^' + this.selectedItem.label +
          '^' + dateConvert + '^' + this.selectedOperator + '^' + this.txtValue + ']';
        this.modelReturn.value = 'order by (' + this.selectedItem.databaseValue + ') desc$$$DECILING^' + this.selectedSeries + '^' +
          this.selectedBenchmark + '^' + this.selectedItem.label + '^' + dateConvert + '^' + this.selectedOperator + '^' + this.txtValue +
          ',' + this.selectedItem.databaseValue + ' as \'' + this.selectedItem.label + '\'';
        this.modelReturn.mode = '';
        this.popUpSubmit.emit(this.modelReturn);
      } else {
        this.errorMessages = 'Not A Valid Data Item';
        opError.show(event);
      }
    } else {
      this.errorMessages = 'Please Select Valid Universe';
      opError.show(event);
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
        if (this.selectedDecile != null) {
          this.editMode(this.selectedDecile);
        }
      }
    );
  }
  // #endregion

  // #region [GetBenchmarks]
  /**
   * Get Benchmarks list
   */
  getBenchmarks() {
    this.subGetBenchmarks = this.portfolioSvc.getBenchmarks().subscribe(
      (data) => {
        this.lstUniverse = [];
        this.lstUniverse.push({ label: 'Entire Universe', value: '1' });
        if (data !== undefined && data !== null && data.length > 0) {
          for (const dataItem of data) {
            this.lstUniverse.push({ label: dataItem.benchmark, value: dataItem.benchmark });
          }
        }
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

  // #region [EditMode]
  /**
   * Edit mode
   * @param strText Description string from Construct Screen to edit
   */
  editMode(strText: string) {
    const strSeries = strText.split('^');
    this.selectedSeries = strSeries[1];
    this.selectedBenchmark = strSeries[2];
    this.selectedItem = this.lstItems.find(P => P.label === strSeries[3]);
    strSeries[4] !== '0' ? this.selectedDate = new Date(strSeries[4]) : this.selectedDate = null;
    this.selectedOperator = strSeries[5];
    this.txtValue = strSeries[6].replace(/\]/g, '');
  }
  // #endregion

  // #endregion
}
