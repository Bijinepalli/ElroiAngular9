// #region [Imports]
import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleTrack, ModuleNames } from 'src/app/_models/commoncore';
import { CommoncoreService } from 'src/app/_services/common/commoncore.service';
import { CompanyMaster } from 'src/app/_models/usermanagement';
import { PortfolioanalysisService } from 'src/app/_services/portfolioanalysis/portfolioanalysis.service';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-searchtickers',
  templateUrl: './searchtickers.component.html',
  styleUrls: ['./searchtickers.component.css']
})
// #endregion

export class SearchtickersComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [CommonPageProperties]
  first: number;
  show = false;
  showSpinner = false;
  isSecure = false;
  subQueryParamSubscribe: any;
  // #endregion

  // #region [TableProperties]
  showReport = false;
  cols: any[];
  lstCompanyTickers: CompanyMaster[];
  selectedCompany: CompanyMaster[];
  pageIndex = 0;
  recordsCount = 0;
  // #endregion

  // #region [SubscriptionProperties]
  subGetCompanyTickers: any;
  // #endregion

  // #region [Output]
  @Output() dialogEvent = new EventEmitter();
  @Output() selectedComp = new EventEmitter();
  // #endregion

  // #region [ViewChildProperties]
  @ViewChild('dt') dt: Table;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private dataSvc: DataService,
    private activeRoute: ActivatedRoute,
    private commonSvc: CommoncoreService,
    private portfolioSvc: PortfolioanalysisService
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
   * on destroy - Clears all Subscriptions and Properties
   */
  ngOnDestroy() {
    this.clearSubScriptions();
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
   * Clears sub scriptions
   */
  clearSubScriptions() {
    this.subQueryParamSubscribe ? this.subQueryParamSubscribe.unsubscribe() : this.clear();
    this.subGetCompanyTickers ? this.subGetCompanyTickers.unsubscribe() : this.clear();

  }
  clear() {
  }
  // #endregion

  // #region [ClearAllProperties]
  /**
   * Clears all properties
   */
  clearAllProperties() {

  }
  // #endregion

  // #region [ClearTableProperties]
  /**
   * Clears table properties
   */
  clearTableProperties() {
    if (this.dt) {
      this.dt.reset();
    }
    this.showReport = false;
    this.lstCompanyTickers = [];
    this.selectedCompany = [];
    this.pageIndex = 0;
    this.recordsCount = 0;
  }
  // #endregion

  // #region [Initialization]
  /**
   * Initializations searchtickers component
   */
  initializations() {
    this.showSpinner = true;
    this.first = 0;
    this.cols = [
      { field: 'tickerSymbol', header: 'Ticker Symbol' },
      { field: 'companyName', header: 'Company Name' },
    ];
    this.showSpinner = false;
    this.getCompanyTickers();
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #endregion

  // #region [Supporting Methods]

  // #region [GetCompanyTickers]
  /**
   * Gets company tickers - Load Tickers
   */
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
  // #endregion

  // #region [BuildTableData]
  /**
   * Builds table data - Load Tickers Data
   * @param data Tickers Array
   */
  buildTableData(data: any) {
    if (data !== undefined && data !== null && data.length > 0) {
      this.lstCompanyTickers = data;
      this.recordsCount = this.lstCompanyTickers.length;
      this.show = true;
    }
    this.recordsCount = this.lstCompanyTickers.length;
    this.showReport = true;
  }
  // #endregion

  // #region [Paginate]
  /**
   * Paginates searchtickers component
   * @param event Table Data
   */
  paginate(event) {
    // event.first: Index of first record being displayed
    // event.rows: Number of rows to display in new page
    // event.page: Index of the new page
    // event.pageCount: Total number of pages
    this.pageIndex = event.first / event.rows + 1; // Index of the new page if event.page not defined.
  }
  // #endregion

  // #region [submit]
  /**
   * Submits searchtickers component - returns selected tickers data
   */
  submit() {
    if (this.selectedCompany.length > 0) {
      this.selectedComp.emit(this.selectedCompany);
    }
  }
  // #endregion

  // #region [selectRow]
  /**
   * Selects row
   * @param ticker tickers Data
   */
  selectRow(ticker: any) {
    this.selectedComp.emit(ticker.data);
  }
  // #endregion

  // #endregion
}
