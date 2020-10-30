// #region [Imports]
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { OverlayPanel } from 'primeng/primeng';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleTrack, ModuleNames, ModelReturn } from 'src/app/_models/commoncore';
import { CommoncoreService } from 'src/app/_services/common/commoncore.service';
import { ScreeningService } from 'src/app/_services/screening/screening.service';
import { Items } from 'src/app/_models/alphas';
import { CompanyMaster } from 'src/app/_models/usermanagement';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-stocksmodel',
  templateUrl: './stocksmodel.component.html',
  styleUrls: ['./stocksmodel.component.css']
})
// #endregion

export class StocksmodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [CommonPageProperties]
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string;
  selectedTicker: string;
  modelReturn: ModelReturn;
  errorMessages: string;
  // #endregion

  // #region [List Properties]
  lstItems: Items[];
  selectedItem: Items;
  lstCategories: Items[];
  selectedCategory: Items;
  lstMasterItems: Items[];
  lstCompanyTickers: CompanyMaster[];
  // #endregion

  // #region [SubscriptionProperties]
  subCategoryItemsList: any;
  subGetCompanyTickers: any;
  // #endregion

  // #region [Input / Output Properties]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  // #endregion

  // #region [DateProperties]
  selectedDate: Date;
  invalidDates: Array<Date>;
  maxDate: Date;
  // #endregion

  // #endregion

  // #region [constructor]
  constructor(
    private commonSvc: CommoncoreService,
    private dataSvc: DataService,
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
    this.dataSvc.changeModule(ModuleNames.Screening); // ModuleName of the corresponding Module
    this.dataSvc.startModule();
    this.initializations();
  }
  // #endregion

  // #region [initializations]
  /**
   * Initializations
   */
  initializations() {
    this.clearAllProperties();
    this.userId = sessionStorage.getItem(this.envKey.toString() + 'userId');
    this.getCategories();
    this.maxDate = new Date();
    this.invalidDates = this.dataSvc.lstInvalidDates;
  }
  // #endregion

  // #region [clearAllProperties]
  /**
   * Clears all properties
   */
  clearAllProperties() {
    this.userId = '';
    this.selectedTicker = '';
    this.modelReturn = new ModelReturn();
    this.lstItems = [];
    this.selectedItem = new Items();
    this.lstCategories = [];
    this.selectedCategory = new Items();
    this.lstMasterItems = [];
    this.selectedDate = undefined;
    this.invalidDates = [];
  }
  // #endregion

  // #region [ngOnDestroy]
  /**
   * on destroy-clears all the Subscriptions and Properties
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
   * Clears subscriptions-Clears all the service subscriptions
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

  // #endregion

  // #region [Control Events]

  // #region [btnSubmit_Click]
  /**
   * Submit-Build and Submit the Description and Value of selected criteria to Construct Screen
   * @param event overlaypanel properties
   * @param opError ovelaypanel for validation
   */
  btnSubmit_Click(event: any, opError: OverlayPanel) {
    this.modelReturn = new ModelReturn();
    const tickers = this.selectedTicker;
    this.subGetCompanyTickers = this.screeningSvc.searchTickers(tickers).subscribe(
      (data) => {
        this.lstCompanyTickers = data;
        if (this.selectedTicker !== '') {
          if (this.selectedCategory.label !== 'Financial Ratios' && this.selectedCategory.label !== 'Financial Statement') {
            if (this.lstCompanyTickers.length === 0) {
              const dateConvert = ((this.selectedDate !== undefined && this.selectedDate !== null && this.selectedDate.toString() !== '') ?
                (this.datePipe.transform(this.selectedDate, 'M/d/yyyy')) : 0);
              this.modelReturn.description = '(stocks;' + this.selectedTicker + ';' + this.selectedItem.label + ';' + dateConvert + ')';
              this.modelReturn.value = '';
              this.modelReturn.mode = '';
              this.popUpSubmit.emit(this.modelReturn);
            } else {
              this.errorMessages = 'No such company exists, please check';
              opError.show(event);
            }
          } else {
            this.errorMessages = 'Not A Valid Data Item';
            opError.show(event);
          }
        } else {
          this.errorMessages = 'Please enter ticker';
          opError.show(event);
        }
      }
    );
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

  // #region [lstCategoryItem_Change]
  /**
   * Category item change-loads the data on selected Item
   * @param catItem Category item
   */
  lstCategoryItem_Change(catItem) {
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

  // #region [getCategories]
  /**
   * Gets categories list
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
   * Builds item values-filter Categories list from Master Categories list
   * @param data catergories list
   */
  buildItemValues(data) {
    if (data && data !== null && data.length > 0) {
      if (data[0] && data[0] !== null && data[0].length > 0) {
        this.lstCategories = data[0];
        this.lstCategories = this.lstCategories.filter(
          P => P.label !== 'Identity Data'
            && P.label !== 'Liquidity'
            && P.label !== 'Ratings Profile Data'
            && P.label !== 'Reward/Risk Data-3 Month'
            && P.label !== 'Short Term Data'
        );
      }
    }
    if (data[1] && data[1] !== null && data[1].length > 0) {
      this.lstMasterItems = data[1];
    }
    this.lstCategory_Change(null);
  }
  // #endregion

  // #region [getTicker]
  /**
   * Gets ticker
   * @param ticker selected ticker
   * @param op show overlaypanel
   */
  getTicker(ticker: any, op: OverlayPanel) {
    this.selectedTicker = ticker.tickerSymbol;
    op.hide();
  }
  // #endregion

  // #endregion
}
