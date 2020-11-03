

import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Table } from 'primeng/table';
import { MessageService, SelectItem, ConfirmationService } from 'primeng/api';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleTrack, ModuleNames, TickerCompanies } from 'src/app/_models/commoncore';
import { CommoncoreService } from 'src/app/_services/common/commoncore.service';
import { CompanyMaster } from 'src/app/_models/usermanagement';
import { PortfolioanalysisService } from 'src/app/_services/portfolioanalysis/portfolioanalysis.service';

@Component({
  selector: 'app-incexcmodel',
  templateUrl: './incexcmodel.component.html',
  styleUrls: ['./incexcmodel.component.css']
})
export class IncexcmodelComponent implements OnInit, OnDestroy {

  /* #region  [EmitterProperties] */
  @Input() presentStocks: string;
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  /* #endregion */

  /* #region  [CommonPageProperties] */
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string;

  showSpinner = false;
  displayDateFormat: string;

  isSecure = false;
  subQueryParamSubscribe: any;
  subGetTickerCompanies: any;
  /* #endregion */

  /* #region  [PageProperties] */
  lstOptionItems: SelectItem[];
  selectedOption: string;
  selectedTicker: string;
  display: boolean;
  first: number;
  errorMsg: string;
  selectedStocks: string;
  /* #endregion */

  /* #region  [ListProperties] */
  lstIncluded: SelectItem[];
  lstExcluded: SelectItem[];
  selectedInclude: SelectItem;
  selectedExclude: SelectItem;
  /* #endregion */

  /* #region  [TableProperties] */
  showReport: boolean;
  cols: any[];
  lstCompanyTickers: CompanyMaster[];
  lstIncludeTickers: CompanyMaster[];
  lstExcludeTickers: CompanyMaster[];

  lstSelectedCompanies: CompanyMaster[];
  pageIndex = 0;
  recordsCount = 0;
  /* #endregion */

  /* #region [SubscriptionProperties] */
  subGetCompanyTickers: any;
  /* #endregion */

  /* #region  [ViewChildProperties] */
  @ViewChild('dt') dt: Table;
  @ViewChild('op') panel: OverlayPanel;
  stocksCount: number;
  note: string;
  /* #endregion */

  /* #region  [Constructor] */
  constructor(
    private activeRoute: ActivatedRoute,
    private commonSvc: CommoncoreService,
    private dataSvc: DataService,
    private msgSvc: MessageService,
    private confirmSvc: ConfirmationService,
    private fb: FormBuilder,
    private portfolioSvc: PortfolioanalysisService
  ) { }
  /* #endregion */

  /* #region  [LifeCycleEvent] */
  ngOnInit() {
    this.showSpinner = true;
    this.isSecure = false;
    this.dataSvc.changeModule(ModuleNames.PortfolioAnalysis); // ModuleName of the corresponding Module
    this.dataSvc.startModule();
    this.subQueryParamSubscribe = this.activeRoute.queryParams.subscribe(params => {
      this.isSecure = false;
      this.checkSecurity();
    });
  }
  /* #endregion */

  /* #region  [CheckSecurity] */
  checkSecurity() {
    this.isSecure = true;
    if (this.isSecure) {
      this.initializations();
    }
  }
  /* #endregion */

  /* #region  [LifeCycleEvent] */
  ngOnDestroy() {
    this.clearSubScriptions();
    this.clearAllProperties();
    this.updateModuleTrack();
  }
  /* #endregion */

  /* #region  [ModuleTrack] */
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
  /* #endregion */

  /* #region  [ClearSubscriptions] */
  clearSubScriptions() {
    this.subQueryParamSubscribe ? this.subQueryParamSubscribe.unsubscribe() : this.clear();
    this.subGetCompanyTickers ? this.subGetCompanyTickers.unsubscribe() : this.clear();
  }
  clear() {
  }
  /* #endregion */

  /* #region  [ClearAllProperties] */
  clearAllProperties() {
    this.showSpinner = true;

    this.errorMsg = '';
    this.selectedOption = '';
    this.selectedInclude = null;
    this.selectedExclude = null;
    this.lstIncluded = [];
    this.lstExcluded = [];

    this.showSpinner = false;
  }
  /* #endregion */

  /* #region  [Initializations] */
  initializations() {
    this.clearAllProperties();
    if (this.presentStocks === undefined) {
      this.presentStocks = '';
    }
    if (this.presentStocks !== '') {
      this.stocksCount = this.presentStocks.split(',').length;
    } else {
      this.presentStocks = '';
      this.stocksCount = 0;
    }
    this.showSpinner = true;
    this.lstOptionItems = [
      { label: 'Include', value: 'I' },
      { label: 'Exclude', value: 'E' }
    ];
    this.userId = sessionStorage.getItem(this.envKey.toString() + 'userId');
    this.displayDateFormat = 'MM/dd/yyyy';
    this.first = 0;
    this.cols = [
      { field: 'tickerSymbol', header: 'Ticker Symbol' },
      { field: 'companyName', header: 'Company Name' },
    ];
    this.selectedOption = 'I';
    this.showSpinner = false;
    this.isSecure = true;
    this.getCompanyTickers();
  }
  /* #endregion */

  /* #region  [ButtonClickEvents] */
  onClickIncDelete() {
    if (this.selectedInclude !== null) {
      const checkList = param => this.lstIncluded.findIndex(({ value }) => value === param);
      this.lstIncluded.splice(checkList(this.selectedInclude), 1);
    }
    this.selectedInclude = null;
  }

  onClickIncClear() {
    this.lstIncluded = [];
  }

  onClickExcDelete() {
    if (this.selectedExclude !== null) {
      const checkList = param => this.lstExcluded.findIndex(({ value }) => value === param);
      this.lstExcluded.splice(checkList(this.selectedExclude), 1);
    }
    this.selectedExclude = null;
  }

  onClickExcClear() {
    this.lstExcluded = [];
  }

  onClickOk() {
    this.showSpinner = true;
    this.errorMsg = '';
    if (this.lstSelectedCompanies.length > 0) {
      if (this.selectedOption === 'I') {
        for (const item of this.lstSelectedCompanies) {
          if (this.lstExcluded.filter(i => i.label === item.tickerSymbol).length > 0) {
            this.errorMsg += item.tickerSymbol + ' already exists in excluded tickers.';
          } else if (this.lstIncluded.filter(i => i.label === item.tickerSymbol).length === 0) {
            this.lstIncluded.push({
              label: item.tickerSymbol,
              value: item.companyID
            });
          }
        }
      } else if (this.selectedOption === 'E') {
        for (const item of this.lstSelectedCompanies) {
          if (this.lstIncluded.filter(i => i.label === item.tickerSymbol).length > 0) {
            this.errorMsg += item.tickerSymbol + ' already exists in included tickers.';
          } else if (this.lstExcluded.filter(i => i.label === item.tickerSymbol).length === 0) {
            this.lstExcluded.push({
              label: item.tickerSymbol,
              value: item.companyID
            });
          }
        }
      }
    }
    this.showSpinner = false;
    this.panel.hide();
  }

  onClickClose() {

  }
  /* #endregion */

  /* #region  OtherMethods */

  getTicker(ticker: any, op: OverlayPanel) {
    this.selectedTicker = ticker.tickerSymbol;
    op.hide();
  }

  searchTickers() {
    this.display = true;
  }

  changeNote() {
    if (this.presentStocks !== '') {
      if (this.selectedOption === 'I') {
        this.note = 'Present stocks will not be included in list';
      } else {
        this.note = 'Only present stocks will be in list';
      }
    }
  }

  onOverlayShow() {
    // this.getCompanyTickers();
    if (this.selectedOption === 'I') {
      this.lstCompanyTickers = this.lstIncludeTickers;
      this.recordsCount = this.lstCompanyTickers.length;
    } else {
      this.lstCompanyTickers = this.lstExcludeTickers;
      this.recordsCount = this.lstCompanyTickers.length;
    }
    if (this.presentStocks !== '') {
      if (this.selectedOption === 'I') {
        this.note = 'Present stocks will not be included in list';
      } else {
        this.note = 'Only present stocks will be in list';
      }
    }
  }

  setValues() {
    const lstInc = '3AAIR,3ABXA'; // Input Included List
    const lstExc = '3ACCO,3ACCP'; // Input Excluded List

  }

  /* #endregion */

  /* #region  [ModalEvents] */
  submit() {
    let lstInc = '';
    let lstIncLabel = '';
    let lstExc = '';
    let lstExcLabel = '';
    for (const incItem of this.lstIncluded) {
      lstInc += incItem.value + ',';
      lstIncLabel += incItem.label + ',';
    }
    for (const excItem of this.lstExcluded) {
      lstExc += excItem.value + ',';
      lstExcLabel += excItem.label + ',';
    }
    this.popUpSubmit.emit(lstInc.replace(/,\s*$/, '') + '~' + lstIncLabel.replace(/,\s*$/, '') + '@'
      + lstExc.replace(/,\s*$/, '') + '~' + lstExcLabel.replace(/,\s*$/, ''));
  }
  closeModel() {
    this.popUpClose.emit('close');
  }
  /* #endregion */

  /* #region  [GetCalls] */
  /* #region [GetCompanyTickers] */
  getCompanyTickers() {
    this.showSpinner = true;
    this.clearTableProperties();
    this.subGetCompanyTickers = this.portfolioSvc.getCompanyTickers().subscribe(
      (data) => {
        this.buildTableData(data);
        this.showSpinner = false;
      }
    );
  }
  /* #endregion */
  /* #endregion */

  /* #region [ClearTableProperties] */
  clearTableProperties() {
    if (this.dt) {
      this.dt.reset();
    }
    this.showReport = false;
    this.lstCompanyTickers = [];
    this.lstSelectedCompanies = [];
    this.pageIndex = 0;
    this.recordsCount = 0;
  }
  /* #endregion */

  /* #region [BuildTableData] */
  buildTableData(data: any) {
    if (data !== undefined && data !== null && data.length > 0) {
      this.lstCompanyTickers = data;
      this.lstIncludeTickers = data;
      this.lstExcludeTickers = [];
      if (this.presentStocks !== '') {
        for (const ticker of this.presentStocks.split(',')) {
          const tickerExist = this.lstCompanyTickers.filter(f => f.tickerSymbol === ticker);
          if (tickerExist.length > 0) {
            this.lstExcludeTickers.push(tickerExist[0]);
          }
          this.lstIncludeTickers = this.lstIncludeTickers.filter(P => P.tickerSymbol !== ticker);
        }
        if (this.selectedOption === 'I') {
          this.lstCompanyTickers = this.lstIncludeTickers;
        } else {
          this.lstCompanyTickers = this.lstExcludeTickers;
        }
      } else {
        this.lstIncludeTickers = this.lstCompanyTickers;
        this.lstExcludeTickers = this.lstCompanyTickers;
        this.note = '';
      }
      this.recordsCount = this.lstCompanyTickers.length;
    }
    this.recordsCount = this.lstCompanyTickers.length;
    this.showReport = true;
    this.setValues();
  }
  /* #endregion */

  /* #region [Paginate] */
  paginate(event) {
    this.pageIndex = event.first / event.rows + 1; // Index of the new page if event.page not defined.

  }
  /* #endregion */
  onStocksClick(event, overlaypanel: OverlayPanel) {
    this.selectedStocks = this.presentStocks;
    overlaypanel.toggle(event);
  }
}
