// #region [Imports]
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MessageService, ConfirmationService, SelectItem, Message } from 'primeng/api';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleTrack, ModuleNames, PageRoutes, ReturnValue, TickerCompanies } from 'src/app/_models/commoncore';
import { CommoncoreService } from 'src/app/_services/common/commoncore.service';
import { ScreeningService } from 'src/app/_services/screening/screening.service';
import { QueryData, ScreeningData, Criteria, ScreeningReport } from 'src/app/_models/screening';
import { DatePipe } from '@angular/common';
import { AlphaStrategy } from 'src/app/_models/alphas';
import { RoleaccessrightsService } from 'src/app/_services/roleaccessrights/roleaccessrights.service';
import { SecurityService } from 'src/app/_services/security/security.service';
import { Tickers } from 'src/app/_models/portfolioanalysis';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-constructscreen',
  templateUrl: './constructscreen.component.html',
  styleUrls: ['./constructscreen.component.css'],
  encapsulation: ViewEncapsulation.None,
})
// #endregion

export class ConstructscreenComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [CommonPage Properties]
  envKey: string;
  showSpinner: boolean;
  subQueryParamSubscribe: any;
  isSecure: boolean;
  userId: string;
  errMsgs: Message[] = [];
  // #endregion

  // #region [List Properties]
  lstDomicileTypes: SelectItem[];
  selectedDomicileType: string;
  lstModes: SelectItem[];
  selectedMode: string;
  lstCategories: SelectItem[];
  selectedCategory: string;
  lstItems: any[];
  selectedItem: any;
  lstMasterItems: any[];
  lstFolders: any[];
  selectedFolder: string;
  screeningReportData: ScreeningReport;
  tickerCompanyIds: TickerCompanies;
  selectedTickers: string;
  lstTickers: Tickers[] = [];
  lstIncExcValues: { label: string, value: string }[] = [];
  // #endregion

  // #region [Table Properties]
  stocksCount: number;
  lstStrategies: AlphaStrategy[];
  lstStrategiesCopy: AlphaStrategy[];
  // #endregion

  // #region [Modal Properties]
  stocksModelOpen: boolean;
  benchmarksModelOpen: boolean;
  subindModelOpen: boolean;
  statisticsModelOpen: boolean;
  mathModelOpen: boolean;
  growthModelOpen: boolean;
  alphaModelOpen: boolean;
  boolModelOpen: boolean;
  decileModelOpen: boolean;
  middleModelOpen: boolean;
  rankModelOpen: boolean;
  ntileModelOpen: boolean;
  countryCodeModelOpen: boolean;
  incExcModelOpen: boolean;
  indexIndicatorModelOpen: boolean;
  ersModelOpen: boolean;
  strModelOpen: boolean;
  russellIndModelOpen: boolean;
  gicsubindModelOpen: boolean;
  displayDatesDialog: boolean;
  displayDatesGridDialog: boolean;
  selectedcountrycodes: string;
  selectedBoolean: string;
  selectedIndexIndicators: string;
  selectedGICSubIndustries: string;
  selectedRusselIndustry: string;
  selectedDecile: string;
  itemInput: string;
  selectedMiddle: string;
  selectedRank: string;
  selectedERSModel: string;
  selectedSTR: string;
  selectedERS: string;
  // #endregion

  // #region [Subscription Properties]
  subUpdateModuleTrack: any;
  subGetCategoryItems: any;
  subGetMasterFolders: any;
  subGetMaxDate: any;
  subGetStocksCount: any;
  subGetScreeningItems: any;
  subGetTickerCompanies: any;
  // #endregion

  // #region [Input Properties]

  selectedFormulaText: string;
  criteriaName: string;
  selectedBackScreeningSwitched: boolean;
  selectedDate: Date;
  lstInvalidDates: Array<Date>;
  maxDate: Date;
  saveLabelText: string;

  // #endregion

  // #region [PageLevel Properties]
  masterItemsArray: string[];
  finalString: string;
  hidstock: string;
  msg: string;
  editedStartegy: number;
  datesStrategy: number;
  yearValidation: string;
  queryData: QueryData;
  displaySaveDialog: boolean;
  returnVal: string;
  screeningData: ScreeningData;
  editCriteriaName: string;
  editSaveFolder: number;
  criteriaId: number;
  maximumDate: string;
  companyIds: string;
  companiesCount: number;
  compPassed: boolean;
  displayStocksPassed: boolean;
  includeCount: number;
  excludeCount: number;
  incExcVal: string;
  includedStocks: string;
  excludedStocks: string;
  screeningViewCondition: QueryData;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private commonSvc: CommoncoreService,
    private datePipe: DatePipe,
    private dataSvc: DataService,
    private msgSvc: MessageService,
    private confirmSvc: ConfirmationService,
    private screeningSvc: ScreeningService,
    private accessRightsSvc: RoleaccessrightsService,
    private securityService: SecurityService,
    private route: ActivatedRoute,
  ) { }
  // #endregion

  // #region [Page Events]

  // #region [ngOnInit]
  /**
   * on init - on page initialization
   */
  ngOnInit() {
    this.errMsgs = [];
    this.showSpinner = true;
    this.isSecure = false;
    this.dataSvc.changeModule(ModuleNames.Screening);
    this.dataSvc.startModule();
    this.subQueryParamSubscribe = this.activeRoute.queryParams.subscribe(params => {
      this.isSecure = false;
      this.checkSecurity();
    });
    this.route.queryParams
      .subscribe(params => {
        if (params.status !== '' && params.status === 'I') {
          this.errMsgs.push({
            severity: 'error',
            summary: 'Error',
            detail: 'You have accessed the page in unauthorized way.'
          });
        }
      });
  }
  // #endregion

  // #region [CheckSecurity]
  /**
   * Checks security
   */
  checkSecurity() {
    this.isSecure = this.securityService.checkPageSecurity('Create New Screen');
    if (this.isSecure) {
      this.initializations();
    } else {
      this.router.navigate(['/unauthorized'], { skipLocationChange: false, queryParams: { status: 'F' } });
    }
  }
  // #endregion

  // #region [ngOnDestroy]
  /**
   * on destroy-clears all the subscriptions,properties
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
      this.subUpdateModuleTrack = this.commonSvc.updateModuleTrack(moduleTrack).subscribe((data) => {
      },
        (error) => {

        });
    }
  }
  // #endregion

  // #region [ClearSubscriptions]
  /**
   * Clears sub scriptions - Clear all Subscriptions
   */
  clearSubScriptions() {
    this.subQueryParamSubscribe ? this.subQueryParamSubscribe.unsubscribe() : this.clear();
    this.subUpdateModuleTrack ? this.subUpdateModuleTrack.unsubscribe() : this.clear();
    this.subGetCategoryItems ? this.subGetCategoryItems.unsubscribe() : this.clear();
    this.subGetMasterFolders ? this.subGetMasterFolders.unsubscribe() : this.clear();
    this.subGetMaxDate ? this.subGetMaxDate.unsubscribe() : this.clear();
    this.subGetStocksCount ? this.subGetStocksCount.unsubscribe() : this.clear();
    this.subGetScreeningItems ? this.subGetScreeningItems.unsubscribe() : this.clear();
    this.subGetTickerCompanies ? this.subGetTickerCompanies.unsubscribe() : this.clear();
  }
  clear() {
  }
  // #endregion

  // #region [ClearAllProperties]
  /**
   * Clears all properties
   */
  clearAllProperties() {
    this.criteriaName = null;
    this.selectedFolder = null;
    this.incExcVal = '';
    this.dataSvc.clearScreeningCriteria();
  }
  // #endregion

  // #region [Initializations]
  /**
   * Initializations constructscreen component
   */
  initializations() {
    this.stocksCount = 0;
    this.envKey = environment.appName.toString() + '_' + environment.envName.toString() + '_';
    this.userId = sessionStorage.getItem(this.envKey.toString() + 'userId');
    this.lstDomicileTypes = [
      { label: 'US Stocks And ADRs', value: '0' },
      { label: 'US Stocks Only', value: '1' },
      { label: 'ADRs Only', value: '2' }
    ];
    this.selectedDomicileType = '0';
    this.lstModes = [{ label: 'Universe', value: '1' }];
    this.selectedCategory = '1';
    this.lstStrategies = [];
    this.lstStrategiesCopy = [];
    this.selectedBackScreeningSwitched = false;
    this.selectedFormulaText = '';
    this.finalString = '';
    this.hidstock = '';
    this.msg = '';
    this.editedStartegy = 0;
    this.datesStrategy = 0;
    this.displayDatesDialog = false;
    this.displayDatesGridDialog = false;
    this.yearValidation = null;
    this.selectedBoolean = null;
    this.selectedDecile = null;
    this.selectedMiddle = null;
    this.selectedRank = null;
    this.selectedERSModel = null;
    this.selectedSTR = null;
    this.displaySaveDialog = false;
    this.selectedERS = null;
    this.criteriaName = '';
    this.selectedFolder = null;
    this.editCriteriaName = '';
    this.editSaveFolder = null;
    this.criteriaId = null;
    this.getCategoryItems();
    this.maxDate = new Date();
    this.lstInvalidDates = this.dataSvc.lstInvalidDates;
    this.companyIds = '';
    this.screeningReportData = {};
    this.tickerCompanyIds = {};
    this.compPassed = false;
    this.companiesCount = 0;
    this.displayStocksPassed = false;
    this.incExcVal = '';
    this.includedStocks = '';
    this.excludedStocks = '';
    this.includeCount = 0;
    this.excludeCount = 0;
    this.showSpinner = false;
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [lstCategories_Click]
  /**
   * Categories list click - Get Description of Selected Category
   * @param event Category Properties
   */
  lstCategories_Click(event: any) {
    this.lstItems = this.lstMasterItems.filter(P => P.categoryId === event.value);
    if (this.lstItems && this.lstItems.length > 0) {
      this.selectedItem = this.lstItems[0];
    }
  }
  // #endregion

  // #region [btnAddItem_Click]
  /**
   * Btns add item click - Adds selected Item to List
   */
  btnAddItem_Click() {
    if (this.selectedCategory === '6' || this.selectedCategory === '12') {
      alert('Not A Valid Data Item');
      return;
    } else {
      const selcri = this.selectedItem.label;
      const builtcri = this.selectedFormulaText;
      if (this.selectedFormulaText !== '') {
        if ((builtcri.indexOf('[TOP ') !== -1) || (builtcri.indexOf('[MIDDLE ') !== -1) || (builtcri.indexOf('[BOTTOM ') !== -1)) {
          const newexp = new RegExp(selcri, 'i');
          const r = builtcri.match(newexp);
          if (r != null) {
            alert('[' + selcri + ']' + ' already exists in Criteria ');
            return;
          }
        }
      }
      if (this.showRatings()) {
        this.funTrimString(this.selectedFormulaText);
        if (this.selectedFormulaText.toLowerCase().indexOf('[top') >= 0 ||
          this.selectedFormulaText.toLowerCase().indexOf('[bottom') >= 0 ||
          this.selectedFormulaText.toLowerCase().indexOf('[middle') >= 0) {
          this.selectedFormulaText = this.selectedFormulaText + '[' + this.selectedItem.label + ']';
        } else {
          const arstr = this.selectedFormulaText.charCodeAt(this.selectedFormulaText.length - 1);
          if (arstr === 42 || arstr === 43 || arstr === 45 || arstr === 47 || isNaN(arstr) === true ||
            arstr === 60 || arstr === 61 || arstr === 62 ||
            (arstr === 93 && (this.selectedFormulaText.substring(this.selectedFormulaText.length - 5).toLowerCase() === '[and]')) ||
            (arstr === 93 && (this.selectedFormulaText.substring(this.selectedFormulaText.length - 4).toLowerCase() === '[or]'))) {
            this.selectedFormulaText = this.selectedFormulaText + '[' + this.selectedItem.label + ']';
          } else if (this.selectedFormulaText.substring(this.selectedFormulaText.length - 3).toLowerCase() === 'and' ||
            this.selectedFormulaText.substring(this.selectedFormulaText.length - 2).toLowerCase() === 'or') {
            alert('Place the Operators \'AND\',\'OR\' in Square Brackets');
          } else {
            alert('Data Item can be added only after an Operator');
          }
        }
      }
    }
  }
  // #endregion

  // #region [btnAddCriteria_Click]
  /**
   * Btns add criteria click - Adds selected criteria to list
   */
  btnAddCriteria_Click() {
    let flag;
    let strtxt;
    let spos = 0;
    let epos;
    let searchText;
    let IntFlagForReturn = 0;
    this.funTrimString(this.selectedFormulaText);
    if (this.funReplace(this.selectedFormulaText, ' ', '') === '') {
      alert('Build Criteria');
      IntFlagForReturn = 1;
    }
    if (this.selectedFormulaText.length > 2000) {
      alert('Criteria should be less than 2000 characters');
      IntFlagForReturn = 1;
    }
    if ((this.funReplace(this.selectedFormulaText, ' ', '').toLowerCase().indexOf('[top') >= 0 ||
      this.funReplace(this.selectedFormulaText, ' ', '').toLowerCase().indexOf('[bottom') >= 0 ||
      this.funReplace(this.selectedFormulaText, ' ', '').toLowerCase().indexOf('[middle') >= 0) && IntFlagForReturn === 0) {
      IntFlagForReturn = 1;
      if (this.funTopBottomExists(2) === true) {
        this.funCheckTopBottomBeforeAdd();
      } else {
        alert('Only one TOP or one BOTTOM or one MIDDLE is allowed');
        flag = 1;
      }
    }

    if (IntFlagForReturn === 0) {
      if (!(this.bracketsAndSpCheck())) {
        IntFlagForReturn = 1;
        flag = 1;
      } else {
        let subsearch;
        strtxt = this.funReplaceAndOr();
        strtxt = '(' + strtxt + ')';
        for (let i = 0; i < strtxt.length; i++) {
          if (strtxt.charAt(i) === '[' || strtxt.charAt(i) === '(') {
            subsearch = strtxt.substring(spos + 1, i);
            if (subsearch.length > 0) {
              if (subsearch.indexOf(']') < 0 && subsearch.indexOf(')') < 0) {
                if (this.checkOperatorNumeric(subsearch, 0) === false) {
                  if (this.hidstock !== '1') {
                    alert('Check dataitem at \'' + this.funReplaceOperators(subsearch) + '\'\n' + this.msg);
                    IntFlagForReturn = 1;
                    flag = 1;
                    break;
                  }
                }
              } else {
                const insubsearch = strtxt.substring(epos + 1, i);
                if (this.hidstock !== '1') {
                  if (this.checkOperatorNumeric(insubsearch.substring(0, insubsearch.length - 1), 1) === false) {
                    alert('Check data item at \'' + this.funReplaceOperators(subsearch) + '\'\n' + this.msg);
                    IntFlagForReturn = 1;
                    flag = 1;
                    break;
                  }
                  if (this.checkOperatorNumeric(insubsearch.substring(1, insubsearch.length), 0) === false) {
                    alert('Check data item at \'' + this.funReplaceOperators(subsearch) + '\'\n' + this.msg);
                    IntFlagForReturn = 1;
                    flag = 1;
                    break;
                  }
                }
              }
            }
            spos = i;
          } else if (strtxt.charAt(i) === ']' || strtxt.charAt(i) === ')') {
            epos = i;
            if (spos !== epos && spos < epos) {
              searchText = strtxt.substring(spos + 1, epos);
              if (searchText.indexOf(']') >= 0 || searchText.indexOf(')') >= 0) {
                subsearch = searchText.substring(searchText.indexOf(']') + 1, searchText.length);
                if (subsearch.length > 0) {
                  if (this.checkOperatorNumeric(subsearch, 1) === false) {
                    if (this.hidstock !== '1') {
                      alert('Check data item at \'' + this.funReplaceOperators(subsearch) + '\'\n' + this.msg);
                      IntFlagForReturn = 1;
                      flag = 1;
                      break;
                    }
                  }
                }
                searchText = searchText.substring(0, searchText.indexOf(']'));
              }
              if ((strtxt.indexOf('[' + searchText + ']') < 0) && IntFlagForReturn === 0) {
                if (this.hidstock !== '1') {
                  alert('Place dataitem \'' + searchText + '\' in Square[] Brackets. \nDon\'t use Brackets for Numeric Values');
                  IntFlagForReturn = 1;
                  flag = 1;
                  break;
                }
              }
              if (IntFlagForReturn === 0) {
                if (this.checkDataItem(searchText) === false) {
                  if (this.hidstock !== '1') {
                    alert('[' + searchText + '] is not a valid Data Item.');
                    IntFlagForReturn = 1;
                    flag = 1;
                    break;
                  }
                }
              }
            }
          }
        }
        spos = 0;
        if (IntFlagForReturn === 0) {
          for (let i = 0; i < strtxt.length; i++) {
            if (strtxt.charAt(i) === '[') {
              if (this.checkDataItem(strtxt.substring(i + 1, strtxt.indexOf(']', i))) === false) {
                alert('Use \'[]\' Square Brackets only for DataItems');
                IntFlagForReturn = 1;
                flag = 1;
                break;
              }
            }
            if (strtxt.charAt(i) === '+' || strtxt.charAt(i) === '-' || strtxt.charAt(i) === '*' || strtxt.charAt(i) === '/' ||
              strtxt.charAt(i) === '&' || strtxt.charAt(i) === '|' || strtxt.charAt(i) === '<' || strtxt.charAt(i) === '>' ||
              strtxt.charAt(i) === '!') {
              spos = i;
              epos = strtxt.length;
              if (strtxt.indexOf('+', i + 1) < epos && strtxt.indexOf('+', i + 1) !== -1) {
                epos = strtxt.indexOf('+', i + 1);
              }
              if (strtxt.indexOf('-', i + 1) < epos && strtxt.indexOf('-', i + 1) !== -1) {
                epos = strtxt.indexOf('-', i + 1);
              }
              if (strtxt.indexOf('*', i + 1) < epos && strtxt.indexOf('*', i + 1) !== -1) {
                epos = strtxt.indexOf('*', i + 1);
              }
              if (strtxt.indexOf('/', i + 1) < epos && strtxt.indexOf('/', i + 1) !== -1) {
                epos = strtxt.indexOf('/', i + 1);
              }
              if (strtxt.indexOf('&', i + 1) < epos && strtxt.indexOf('&', i + 1) !== -1) {
                epos = strtxt.indexOf('&', i + 1);
              }
              if (strtxt.indexOf('|', i + 1) < epos && strtxt.indexOf('|', i + 1) !== -1) {
                epos = strtxt.indexOf('|', i + 1);
              }
              if (strtxt.indexOf('<', i + 1) < epos && strtxt.indexOf('<', i + 1) !== -1) {
                epos = strtxt.indexOf('<', i + 1);
              }
              if (strtxt.indexOf('>', i + 1) < epos && strtxt.indexOf('>', i + 1) !== -1) {
                epos = strtxt.indexOf('>', i + 1);
              }
              if (strtxt.indexOf('!', i + 1) < epos && strtxt.indexOf('!', i + 1) !== -1) {
                epos = strtxt.indexOf('!', i + 1);
              }
              if (strtxt.charAt(epos) !== '-') {
                if (epos === spos + 1) {
                  alert('Use of Operators in succession is not allowed');
                  IntFlagForReturn = 1;
                  flag = 1;
                  break;
                }
              }
            }
          }
        }
      }
    }
    if (IntFlagForReturn === 0) {
      if (this.funCheckRanges(this.funReplace(strtxt, '|', '&'), '&') === true) {
        this.frameItemInfo('(' + this.selectedFormulaText + ')');
        this.funAddCriteriaToList(this.selectedFormulaText, this.finalString);
        this.hidstock = '';
      }
    }
  }
  // #endregion

  // #region [btnAddOperator_Click]
  /**
   * Btns add operator click - Adds selected operator to Criteria
   * @param sign ex(+,-,/,*,...)
   */
  btnAddOperator_Click(sign) {
    // this.funTrimString(this.selectedFormulaText);
    let arstr = this.funReplaceAndOr();
    if ((sign.toLowerCase().indexOf('[top') >= 0 || sign.toLowerCase().indexOf('[bottom') >= 0 ||
      sign.toLowerCase().indexOf('[middle') >= 0) && (this.funTopBottomExists(0) === true)) {
      if (arstr.length === 0) {
        this.selectedFormulaText = sign;
      } else {
        alert('Enter \'[TOP ##][DataItem1][DataItem2]...\' as Criteria');
      }
    } else {
      arstr = arstr.charCodeAt(arstr.length - 1);
      if ((arstr >= 65 && arstr <= 90) || (arstr >= 97 && arstr <= 122)) {
        alert('Place DataItem in \'[]\' Brackets');
      } else if (arstr === 93 || arstr === 41 || ('1234567890'.indexOf(String.fromCharCode(arstr)) >= 0)) {
        if ((sign.toLowerCase().indexOf('[top') >= 0 || sign.toLowerCase().indexOf('[bottom') >= 0 ||
          sign.toLowerCase().indexOf('[middle') >= 0) && (this.funTopBottomExists(0) === false)) {

        } else if (this.funTopBottomExists(1) === false) {
          alert('Operators are not allowed with Top/Bottom\nEnter \'[TOP ##][DataItem1][DataItem2]...\' as Criteria');
        } else {
          this.selectedFormulaText = this.selectedFormulaText + sign;
        }
      }
    }
  }
  // #endregion

  // #region [btnEditStrategy_Click]
  /**
   * Btns edit strategy click - Load Values of Edited Strategy
   * @param event Selected Strategy
   */
  btnEditStrategy_Click(event: any) {
    this.lstStrategiesCopy = [];
    this.lstStrategies.map(val => this.lstStrategiesCopy.push(Object.assign({}, val)));
    this.editedStartegy = event.strategyId;
    const itemIndex = this.lstStrategies.findIndex(item => item.strategyId === event.strategyId);
    const strDataDesc = event.strategy;
    if (strDataDesc.toLowerCase().indexOf('stocks') >= 0 || strDataDesc.toLowerCase().indexOf('benchmark') >= 0 ||
      strDataDesc.toLowerCase().indexOf('mean') >= 0 || strDataDesc.toLowerCase().indexOf('median') >= 0 ||
      strDataDesc.toLowerCase().indexOf('mode') >= 0 || strDataDesc.toLowerCase().indexOf('industry') >= 0 ||
      strDataDesc.toLowerCase().indexOf('subindustry') >= 0 || strDataDesc.toLowerCase().indexOf('avg') >= 0 ||
      strDataDesc.toLowerCase().indexOf('min') >= 0 || strDataDesc.toLowerCase().indexOf('max') >= 0 ||
      strDataDesc.toLowerCase().indexOf('oneyear') >= 0 || strDataDesc.toLowerCase().indexOf('threeyear') >= 0 ||
      strDataDesc.toLowerCase().indexOf('fiveyear') >= 0) {
      this.hidstock = '1';
    }
    const strDataItem = strDataDesc.substring(1, strDataDesc.indexOf(']'));
    if (strDataItem.toLowerCase().indexOf('subindustry') >= 0) {
      this.selectedGICSubIndustries = strDataDesc.split(':')[0];
      this.lstStrategies[itemIndex].strategy = '';
      this.lstStrategies[itemIndex].strategyValue = '';
      this.btnModelOpen_Click('gicsubind');
      return;
    } else if (strDataItem.toLowerCase().indexOf('russelindustry') >= 0) {
      this.selectedRusselIndustry = strDataDesc.split(':')[0];
      this.lstStrategies[itemIndex].strategy = '';
      this.lstStrategies[itemIndex].strategyValue = '';
      this.btnModelOpen_Click('russellInd');
      return;
    } else if (strDataItem.toLowerCase().indexOf('countrycode') >= 0) {
      this.selectedcountrycodes = strDataDesc.split(':')[0];
      this.lstStrategies[itemIndex].strategy = '';
      this.lstStrategies[itemIndex].strategyValue = '';
      this.btnModelOpen_Click('countryCode');
      return;
    } else if (strDataItem.toLowerCase().indexOf('index indicator') >= 0) {
      this.selectedIndexIndicators = strDataDesc.split(':')[0];
      this.lstStrategies[itemIndex].strategy = '';
      this.lstStrategies[itemIndex].strategyValue = '';
      this.btnModelOpen_Click('indexIndicator');
      return;
    } else if (strDataItem.toLowerCase().indexOf('elroi stock rating') >= 0 || strDataItem.toLowerCase().indexOf('technical risk') >= 0 ||
      strDataItem.toLowerCase().indexOf('trading alert') >= 0 || strDataItem.toLowerCase().indexOf('long-term trend') >= 0 ||
      strDataItem.toLowerCase().indexOf('portfolio weighting') >= 0) {
      this.lstStrategies[itemIndex].strategy = '';
      this.lstStrategies[itemIndex].strategyValue = '';
      this.itemInput = strDataItem.replace(/ /g, '');
      this.selectedSTR = strDataDesc;
      this.btnModelOpen_Click('str');
      return;
    } else if (strDataItem.toLowerCase().indexOf('domicile') >= 0) {
      alert('OPEN - ScreeningDomiciles Dialog');
      return;
    } else if (strDataItem.indexOf('MIDDLE') >= 0) {
      const datadesc = strDataDesc.split(':');
      datadesc[0] = datadesc[0].replace('%', '*');
      this.lstStrategies[itemIndex].strategy = '';
      this.lstStrategies[itemIndex].strategyValue = '';
      this.selectedMiddle = strDataDesc;
      this.btnModelOpen_Click('middle');
      return;
    } else if ((strDataDesc.substring(0, 6)) === 'Decile') {
      const selectedval = event.strategyValue;
      const splitdes = strDataDesc.split(';');
      const splitval = selectedval.split('^');
      const uval = splitval[1].split(';');
      const ls = splitdes[1].lastIndexOf(']');
      const strf = splitdes[1].substring(0, parseInt(ls + 1, 12));
      if (uval[0] === '2' || uval[0] === '1' || uval[0] === '3') {
        alert('OPEN - NewAlpha Dialog');
        return;
      }
    } else if (strDataItem.toLowerCase().indexOf('deciling') >= 0) {
      const dcat = '';
      const datadesc = strDataDesc.split('^');
      this.lstStrategies[itemIndex].strategy = '';
      this.lstStrategies[itemIndex].strategyValue = '';
      this.selectedDecile = strDataItem;
      this.btnModelOpen_Click('decile');
      return;
    } else if (strDataItem.toLowerCase().indexOf('ers reason indicator') >= 0 ||
      strDataItem.toLowerCase().indexOf('1 Week ERS Change') >= 0 ||
      strDataItem.toLowerCase().indexOf('2 Week ERS Change') >= 0 || strDataItem.toLowerCase().indexOf('3 Week ERS Change') >= 0 ||
      strDataItem.toLowerCase().indexOf('1 Month ERS Change') >= 0 || strDataItem.toLowerCase().indexOf('2 Month ERS Change') >= 0) {
      this.lstStrategies[itemIndex].strategy = '';
      this.lstStrategies[itemIndex].strategyValue = '';
      this.selectedERS = strDataDesc;
      this.btnModelOpen_Click('ers');
      return;
    } else if (strDataItem.toLowerCase().indexOf('short term rating') >= 0 ||
      strDataItem.toLowerCase().indexOf('15 day trend') >= 0 || strDataItem.toLowerCase().indexOf('breakout type') >= 0) {
      this.lstStrategies[itemIndex].strategy = '';
      this.lstStrategies[itemIndex].strategyValue = '';
      this.itemInput = strDataItem.replace(/ /g, '');
      this.selectedSTR = strDataDesc;
      this.btnModelOpen_Click('str');
      return;
    } else if (strDataItem.toLowerCase().indexOf('rank') >= 0) {
      this.lstStrategies[itemIndex].strategy = '';
      this.lstStrategies[itemIndex].strategyValue = '';
      this.selectedRank = strDataItem;
      this.btnModelOpen_Click('rank');
      return;
    } else if (strDataItem.toLowerCase().indexOf('isna=') >= 0) {
      this.lstStrategies[itemIndex].strategy = '';
      this.lstStrategies[itemIndex].strategyValue = '';
      this.selectedBoolean = strDataDesc;
      this.btnModelOpen_Click('bool');
      return;
    } else if (strDataItem.toLowerCase().indexOf('value') >= 0 && strDataDesc.toLowerCase().indexOf('[value]') >= 0) {
      this.lstStrategies[itemIndex].strategy = '';
      this.lstStrategies[itemIndex].strategyValue = '';
      this.selectedBoolean = strDataDesc;
      this.btnModelOpen_Click('bool');
      return;
    } else {
      let strName;
      let strname1;
      strName = '';
      let strLength;
      strLength = '';
      strLength = this.lstStrategies.length;
      if (this.selectedFormulaText === '') {
        strName = event.strategy;
        strname1 = strName.split(':');
        this.lstStrategies[itemIndex].strategy = '';
        this.lstStrategies[itemIndex].strategyValue = '';
        this.selectedFormulaText = strname1[0];
      }
    }
  }
  // #endregion

  // #region [btnDeleteStrategy_Click]
  /**
   * Btns delete strategy click - Delete Selected Strategy
   * @param event Selected Strategy
   */
  btnDeleteStrategy_Click(event: any) {
    this.confirmSvc.confirm({
      message: 'Do you want to delete from the list?',
      accept: () => {
        this.lstStrategies = this.lstStrategies.filter(order => order.strategyId !== event);
      },
      reject: () => {

      }
    });
  }
  // #endregion

  // #region [btnModelOpen_Click]
  /**
   * Btns model open click - Opens Model Dialog
   * @param modelName ex(alphas,bool etc)
   */
  btnModelOpen_Click(modelName: string) {
    this.modelToggle(modelName, true);
  }
  // #endregion

  // #region [btnDatesStrategy_Click]
  /**
   * Btns dates strategy click - Open Date Dialog
   * @param event Strategy
   */
  btnDatesStrategy_Click(event: any) {
    const itemIndex = this.lstStrategies.findIndex(item => item.strategyId === event.strategyId);
    if (this.lstStrategies.length > 0) {
      if (this.lstStrategies[itemIndex].strategy.indexOf('~') > 0) {
        alert('Dates are already Selected');
        return false;
      } else {
        if ((this.lstStrategies[itemIndex].strategy.indexOf('stocks;') > 0) ||
          (this.lstStrategies[itemIndex].strategy.indexOf('Industry;') > 0) ||
          (this.lstStrategies[itemIndex].strategy.indexOf('BenchMark;') > 0) ||
          (this.lstStrategies[itemIndex].strategy.indexOf('Subindustry;') > 0) ||
          (this.lstStrategies[itemIndex].strategy.indexOf('Mean;') > 0) ||
          (this.lstStrategies[itemIndex].strategy.indexOf('Median;') > 0) ||
          (this.lstStrategies[itemIndex].strategy.indexOf('Mode') > 0) ||
          (this.lstStrategies[itemIndex].strategy.indexOf('oneyear;') > 0) ||
          (this.lstStrategies[itemIndex].strategy.indexOf('threeyear;') > 0) ||
          (this.lstStrategies[itemIndex].strategy.indexOf('fiveyear;') > 0)) {
          alert('Dates cannot be added here');
          return false;
        } else {
          this.datesStrategy = event.strategyId;
          this.btnModelOpen_Click('datesGrid');
        }
      }
    } else {
      alert('Please Select Atleast One Criteria');
      return false;
    }
  }
  // #endregion

  // #region [btnNavSub_Click]
  /**
   * Btns nav sub click - Navigates to Corresponding page
   * @param str Button Type
   * @param page Navigation Page
   */
  btnNavSub_Click(str: string, page: string) {
    sessionStorage.setItem(this.envKey.toString() + 'formedString', '');
    this.queryData = new QueryData();
    let tooltip = '';
    if (str === 'view' || str === 'Portfolio' || str === 'Run' || str === 'Decile' || str === 'Calc' || str === 'Combined') {
      if (this.lstStrategies.length > 0) {
        for (const strategyItem of this.lstStrategies) {
          if ((strategyItem.strategy) === '') {
            alert('One of the criteria row is removed\n delete it or enter new criteria');
            return;
          }
        }
      }
      let crit = '';
      for (const strategyItem of this.lstStrategies) {
        crit = crit + strategyItem.strategy + ';';
      }
      this.queryData.actualCriteria = crit;
      if (this.lstStrategies.length === 0) {
        alert('Add Criteria');
      } else if (this.lstStrategies.length === 1 && this.lstStrategies[0].strategy.indexOf('Domicile') > 0) {
        alert('Add Criteria');
      } else {
        let StrDescription = '';
        let StrInformation = '';
        let StrSecondInformation = '';
        let StrColumns = '';
        let StrOrderBy = '';
        let StrCriteriaForModify = '';
        let intFoundTopBottom = 0;
        let ArrColumns;
        ArrColumns = '';
        tooltip = '';
        // this loop fills the necessary variables by taking values from criteria list box
        // differentiates criteria build upto top/bottom with that of cirteria build after top/bottom
        for (const strategyItem of this.lstStrategies) {
          ArrColumns = strategyItem.strategyValue.split('$$$')[1].split(',');
          for (let j = 0; j < ArrColumns.length; j++) {
            if (ArrColumns[j].length > 0) {
              if (ArrColumns[j].toLowerCase().indexOf('top ') >= 0 || ArrColumns[j].toLowerCase().indexOf('middle ') >= 0 ||
                ArrColumns[j].toLowerCase().indexOf('bottom ') >= 0) {
                StrColumns = this.funReplace(ArrColumns[j].toLowerCase(), 'bottom', 'Top') + ',' + StrColumns;
                ArrColumns[j + 1] = this.funReplace(ArrColumns[j + 1], 'case ', 'caes ');
                ArrColumns[j + 1] = this.funReplace(ArrColumns[j + 1], 'chase', 'chaes');
                const temp = ArrColumns[j + 1].split('as');
                temp[1] = this.funReplace(temp[1], '\'', '');
                temp[1] = this.funReplace(temp[1], ' ', '');
                temp[1] = this.funReplace(temp[1], 'case ', 'caes ');
                temp[1] = this.funReplace(temp[1], 'chaes', 'chase');
                ArrColumns[j + 1] = this.funReplace(ArrColumns[j + 1], 'caes ', 'case ');
                ArrColumns[j + 1] = this.funReplace(ArrColumns[j + 1], 'chaes', 'chase');
                this.queryData.hidName = temp[1];
                tooltip = tooltip + ArrColumns[j + 1] + ',';
              } else if (this.funReplace(StrColumns, '$', ',').indexOf(ArrColumns[j] + ',') < 0) {
                StrColumns = StrColumns + ArrColumns[j] + ',';
                tooltip = tooltip + ArrColumns[j] + ',';
              }
            }
            const re1 = new RegExp('[\']', 'gi');
            tooltip = tooltip.replace(re1, '');
          }
          if (strategyItem.strategyValue.split('$$$')[0].indexOf('order by') < 0) {
            if (intFoundTopBottom === 1) {
              StrSecondInformation = StrSecondInformation + strategyItem.strategyValue.split('$$$')[0] + '  and  ';
            } else {
              StrInformation = StrInformation + strategyItem.strategyValue.split('$$$')[0] + '  and  ';
            }
          } else {
            intFoundTopBottom = 1;
            const arrOrderBy = strategyItem.strategyValue.split('$$$')[0].split(',');
            for (const arrOrder of arrOrderBy) {
              if (StrOrderBy.indexOf(arrOrder) < 0) {
                StrOrderBy = StrOrderBy + arrOrder + ',';
              }
            }
          }
          StrCriteriaForModify = StrCriteriaForModify + strategyItem.strategyValue + '~~' + strategyItem.strategy + '@@';
          StrDescription = StrDescription + strategyItem.strategy + '@';
          if (StrColumns.charAt(StrColumns.length - 1) !== '$' && StrColumns.length > 0) {
            StrColumns = StrColumns.substring(0, StrColumns.length - 1) + '$';
          }
        }
        this.queryData.screeningColumn = StrColumns.substring(0, StrColumns.length - 1);
        if (StrOrderBy.length > 0) {
          StrInformation = StrInformation.substring(0, StrInformation.length - 7) + ' ' + StrOrderBy.substring(0, StrOrderBy.length - 1);
        } else {
          StrInformation = StrInformation.substring(0, StrInformation.length - 7);
        }
        if (StrInformation.indexOf('order by') !== 1) {
          StrInformation = '  and  ' + StrInformation;
        }
        if (StrSecondInformation.length > 0) {
          StrSecondInformation = StrSecondInformation.substring(0, StrSecondInformation.length - 7);
          StrSecondInformation = '  and  ' + StrSecondInformation;
        }
        const cols = '';
        const a = '';
        const b = a.split(':');
        const c = '(' + b[1] + ')';
        const bdat = '';
        let r;
        let re;
        let optcnt = 0;
        // to maintain the minimum backdate **
        // const rdat = '<%=rd(0)%>';
        const rdat = '';
        // Check if the string matches with the S&P Pattern **
        re = new RegExp('sp500|sp400|sp600|s&p', 'i');
        r = cols.match(re);
        if (r == null) {
          optcnt = optcnt + 0;
        } else {
          optcnt = optcnt + 1;
        }
        // Check if the string matches with the Russell pattern **
        re = new RegExp('R1000|R2000|R3000|RMID|RTOP|Russell', 'i');
        r = cols.match(re);
        if (r == null) {
          optcnt = optcnt + 0;
        } else {
          optcnt = optcnt + 2;
        }
        // Getting the months of the selected backscreening date and **
        // also the min of the backdate available from backscreeningdata3 **
        if (c.length > 0) {
          const c1 = c.substr(1, 8);
          // to store the minimum of data available backscreenign date
          const backscreeningdate = new Date(c1);
          backscreeningdate.setMonth(backscreeningdate.getMonth() + 1);
          // to store the backscreeningdate selected by the user
          const backscreeningdate1 = new Date(rdat);
          backscreeningdate1.setMonth(backscreeningdate1.getMonth() + 1);
        }
        if (bdat.length > 0) {
          // to store the minimum of data available backscreenign date
          // to store the backscreeningdate selected by the user
          const backscreeningdate1 = new Date(rdat);
          backscreeningdate1.setMonth(backscreeningdate1.getMonth() + 1);
        }

        if (str === 'Portfolio') {
        } else {
        }
        if (str === 'Decile') {
        } else {
        }
        if (str === 'Calc') {
        } else {
        }
        if (str === 'Run') {
        } else {
        }
        let d = '';
        for (const strategyItem of this.lstStrategies) {
          d = d + strategyItem.strategy + '@';
        }
        this.queryData.strInformation = StrInformation;
        this.queryData.strCriteriaForModify = StrCriteriaForModify;
        this.queryData.listData = d;
        this.queryData.groupType = 'All';
        this.queryData.backScreening = this.selectedBackScreeningSwitched;
        if (this.selectedBackScreeningSwitched) {
          this.queryData.backScreeningDate = this.datePipe.transform(this.selectedDate, 'MM/dd/yyyy');
        }
        if (this.selectedMode && this.selectedMode.length > 0) {
          this.queryData.elroiUniverse = this.selectedMode[0];
        } else {
          this.queryData.elroiUniverse = '0';
        }
        this.queryData.strReferer = this.router.url;
        this.queryData.domicile = this.selectedDomicileType;
        this.dataSvc.setScreeningViewCondition(this.queryData);
        sessionStorage.setItem(this.envKey.toString() + 'queryData', JSON.stringify(this.queryData));
        switch (page) {
          case 'View':
            this.navigateByRoute(PageRoutes.ScreeningViewReport, 'View');
            break;
          case 'Combined':
            console.log(page);
            this.getQueryDetails(PageRoutes.ViewCombinedAlphas, 'View', 'Combined');
            break;
          case 'Alphas':
            this.dataSvc.setScreeningAlphaCondition('srcScreening');
            sessionStorage.setItem(this.envKey.toString() + 'queryRtnData', JSON.stringify(this.queryData));
            this.getQueryDetails(PageRoutes.ViewAlphaStrategy, 'View', 'Alphas');
            break;
          case 'Portfolio':
            this.getQueryDetails(PageRoutes.Constraints, 'View', 'Portfolio');
            break;
          case 'Report':
            this.getQueryDetails(PageRoutes.ScreeningReportOptions, 'View', 'Report');
            break;
          case 'Run':
            this.getQueryDetails('', 'Run', 'Run');
            break;
          default:
            break;
        }
      }
    }
    // when opts for updation of previously selected criteria
    if (str === 'updt') {
      let a1 = '';
      for (const strategyItem of this.lstStrategies) {
        a1 = a1 + strategyItem.strategy + '@';
      }
      if (this.lstStrategies.length > 0) {
        for (const strategyItem of this.lstStrategies) {
          if ((strategyItem.strategyValue) === 'null') {
            alert('One of the criteria row is removed\n delete it or enter new criteria');
            return;
          }
        }
      }
      if (this.lstStrategies.length === 0) {
        alert('No Criteria to update');
      } else {
        let strxitem = '';
        let str1;
        tooltip = '';
        for (const strategyItem of this.lstStrategies) {
          str1 = strategyItem.strategyValue.split('$$$')[1].split(',');
          for (const strVal of str1) {
            tooltip = tooltip + strVal + ',';
            const re1 = new RegExp('[\']', 'gi');
            tooltip = tooltip.replace(re1, '');
          }
          strxitem = strxitem + strategyItem.strategyValue + '~~' + strategyItem.strategy + '@@';
        }
      }
    }
  }
  // #endregion

  // #region [btnSave_Click]
  /**
   * Btns save click - Validate Criterias and Opens Save Dialog
   * @returns Error Message
   */
  btnSave_Click() {
    if (this.lstStrategies.length <= 0) {
      alert('Add Criteria To Save');
      return false;
    }
    for (const strategyItem of this.lstStrategies) {
      if (strategyItem.strategy === '') {
        alert('One of the criteria row is removed\n delete it or enter new criteria');
        return false;
      }
    }
    this.getFoldersList();
  }
  // #endregion

  // #region [btnSaveScreeningData_Click]
  /**
   * Btns save screening data click - Validates Criteria Name and Save Criterias to Database
   * @param strBtnClick Buytton type 'Save' and 'Save & View'
   * @returns Status Message
   */
  btnSaveScreeningData_Click(strBtnClick: string) {
    this.screeningData = new ScreeningData();
    let strCriteria = '';
    if (this.criteriaName.trim() === '') {
      alert('Enter the Criteria Name');
      return false;
    }
    if (this.selectedFolder === null) {
      alert('Please select a folder name');
      return false;
    }
    this.accessRightsSvc.checkFolderAccessRights(this.selectedFolder, '#' + this.userId + '#').subscribe(
      (data) => {
        if (data === 1) {
          strCriteria = '';
          for (const strategyItem of this.lstStrategies) {
            strCriteria = strCriteria + strategyItem.strategyValue + '~~' + strategyItem.strategy + '@@';
          }
          this.screeningData.userId = +this.userId;
          this.screeningData.criteriaName = this.criteriaName;
          this.screeningData.saveOption = 0;
          this.screeningData.viewId = '';
          this.screeningData.folder = +this.selectedFolder;
          this.screeningData.domicile = +this.selectedDomicileType;
          this.screeningData.createdOn = this.datePipe.transform(Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
          this.screeningData.rViewId = '';
          this.screeningData.includeIds = '';
          this.screeningData.excludeIds = '';
          this.screeningData.criteria = strCriteria;
          this.screeningData.isReportData = false;
          if (this.saveLabelText === 'Save') {
            this.screeningSvc.criteriaNameCheck(this.userId, this.criteriaName).subscribe(
              (checkData) => {
                if (checkData.errorMessage !== '') {
                  alert('Criteria Name already exists');
                } else {
                  this.screeningSvc.insertCreateScreenData(this.screeningData).subscribe(
                    (saveData) => {
                      this.displaySaveDialog = false;
                      if (strBtnClick === 'saveView') {
                        this.btnNavSub_Click('view', 'View');
                      }
                      this.showErrorDetail(saveData, 'Your Criteria Saved');
                    });
                }
              }
            );
          } else if (this.saveLabelText === 'Update') {
            if (this.editCriteriaName === this.criteriaName) {
              let criteriaItem: Criteria;
              criteriaItem = {};
              criteriaItem.userId = +this.userId;
              criteriaItem.criteriaName = this.criteriaName;
              criteriaItem.criteriaId = this.criteriaId;
              criteriaItem.isDeleteYN = 0;
              this.screeningSvc.deleteExistingCriteria(criteriaItem).subscribe(
                (deleteData) => {
                  this.screeningSvc.insertCreateScreenData(this.screeningData).subscribe(
                    (saveData) => {
                      this.displaySaveDialog = false;
                      if (strBtnClick === 'saveView') {
                        this.btnNavSub_Click('view', 'View');
                      }
                      this.showErrorDetail(saveData, 'Your Criteria Updated');
                    });
                }
              );
            } else {
              this.screeningSvc.criteriaNameCheck(this.userId, this.criteriaName).subscribe(
                (checkData) => {
                  if (checkData.errorMessage !== '') {
                    alert('Criteria Name already exists');
                  } else {
                    this.screeningSvc.insertCreateScreenData(this.screeningData).subscribe(
                      (saveData) => {
                        this.displaySaveDialog = false;
                        if (strBtnClick === 'saveView') {
                          this.btnNavSub_Click('view', 'View');
                        }
                        this.showErrorDetail(saveData, 'Your Criteria Saved');
                      });
                  }
                });
            }
          }
        } else {
          alert('You dont have privileges to add to this Folder');
          return false;
        }
      }
    );
  }
  // #endregion

  // #region [btnCloseScreeningSave_Click]
  /**
   * Btns close screening save click - Closes Save Dialog
   */
  btnCloseScreeningSave_Click() {
    this.displaySaveDialog = false;
  }
  // #endregion

  // #region [btnStockesPassedOK_Click]
  /**
   * Btns stockes passed ok click - Closes Stocks Passed Dialog
   */
  btnStockesPassedOK_Click() {
    this.displayStocksPassed = false;
  }
  // #endregion

  // #endregion

  // #region [Supporting Methods]

  // #region [GetCategoryItems ]
  /**
   * Gets category items - Loads Categories and Items Dropdowns
   */
  getCategoryItems() {
    this.masterItemsArray = [];
    this.subGetCategoryItems = this.screeningSvc.getScreeningCategoryItemsList(this.userId).subscribe(
      (files) => {
        this.lstCategories = files[0];
        this.lstCategories.push({ label: 'My DataItems', value: '999' });
        this.lstMasterItems = files[1];
        if (this.lstCategories && this.lstCategories.length > 0 && this.lstMasterItems && this.lstMasterItems.length > 0) {
          for (const category of this.lstCategories) {
            const filteredItems = this.lstMasterItems.filter(m => m.categoryId === category.value);
            this.masterItemsArray.push(filteredItems.map(m => m.databaseValue + '^' + m.label).join('^N@') + '^N@');
          }
        }
        this.lstItems = files[1].filter(P => P.categoryId === this.selectedCategory);
        if (this.lstItems && this.lstItems.length > 0) {
          this.selectedItem = this.lstItems[0];
        }
        const editData = this.dataSvc.currentScreeningCriteria;
        if (editData !== 'New') {
          this.saveLabelText = 'Update';
          this.criteriaId = editData;
          this.pageEdit(editData);
        } else {
          this.saveLabelText = 'Save';
        }
        this.getMaxDate();
        this.activeRoute.queryParams.subscribe(params => {
          if (params.Mode && params.Mode !== '' && params.Mode === 'Modify') {
            this.screeningViewCondition = new QueryData();
            this.screeningViewCondition = JSON.parse(sessionStorage.getItem(this.envKey.toString() + 'queryData'));
            this.lstStrategies = [];
            if (this.screeningViewCondition) {
              for (let i = 0; i < this.screeningViewCondition.listData.split('@').length - 1; i++) {
                this.lstStrategies.push({
                  strategyId: i + 1,
                  strategy: this.screeningViewCondition.listData.split('@')[i],
                  strategyValue: this.screeningViewCondition.strCriteriaForModify.split('@@')[i].split('~~')[0],
                });
              }
            }
          }
          if (params.Mode && params.Mode !== '' && params.Mode === 'Back') {
            this.screeningViewCondition = new QueryData();
            this.screeningViewCondition = JSON.parse(sessionStorage.getItem(this.envKey.toString() + 'queryRtnData'));
            this.lstStrategies = [];
            if (this.screeningViewCondition) {
              for (let i = 0; i < this.screeningViewCondition.listData.split('@').length - 1; i++) {
                this.lstStrategies.push({
                  strategyId: i + 1,
                  strategy: this.screeningViewCondition.listData.split('@')[i],
                  strategyValue: this.screeningViewCondition.strCriteriaForModify.split('@@')[i].split('~~')[0],
                });
              }
            }
          }
        });

      }
    );
  }
  // #endregion

  // #region [GetMaxDate]
  /**
   * Gets max date-Fetch the latest date from data base for which the data is loaded
   */
  getMaxDate() {
    this.showSpinner = true;
    this.subGetMaxDate = this.commonSvc.getMaxDate().subscribe(
      (data) => {
        if (data && data != null && data.maxDate && data.maxDate !== null) {
          this.maximumDate = this.datePipe.transform(data.maxDate, 'MM/dd/yyyy');
          this.getStocksCount(this.maximumDate);
        }
        this.showSpinner = false;
      }
    );
  }
  // #endregion

  // #region [getStocksCount]
  /**
   * Gets stocks count - Get Stocks Count as per the Latest Date from Database
   * @param displayDate Latest Date
   */
  getStocksCount(displayDate: string) {
    this.showSpinner = true;
    this.subGetStocksCount = this.screeningSvc.getStocksCount(displayDate).subscribe(
      (data) => {
        this.stocksCount = data;
        this.showSpinner = false;
      }
    );

  }
  // #endregion

  // #region [Show Ratings]
  /**
   * Shows ratings - Opens Dialog to the corresponding Ratings
   */
  showRatings() {
    let selectedCategoryLabel = '';
    selectedCategoryLabel = this.lstCategories.filter(m => m.value === this.selectedCategory).map(m => m.label)[0];
    const builtcri = this.selectedFormulaText;
    const len = (builtcri.length);
    if ((selectedCategoryLabel === 'Ratings Profile Data') ||
      (selectedCategoryLabel === 'Miscellaneous Data' && this.selectedItem.label === 'S&P Index Indicator')) {
      if (this.selectedItem.label === 'S&P Index Indicator') {
        if (this.checkRatingsAndIndustries('S&P Index Indicator') === false) {
          return false;
        }
      } else {
        if (this.checkRatingsAndIndustries(this.selectedItem.label) === false) {
          return false;
        }
      }
      const StrQueryItem = this.funReplace(this.funReplace(this.selectedItem.label, '&', '3'), ' ', '2');
      if (len === 0) {
        this.itemInput = this.selectedItem.label.replace(/ /g, '');
        this.btnModelOpen_Click('str');
        return false;
      } else {
        alert('Please Add the Criteria');
        return false;
      }
    }
    if ((selectedCategoryLabel === 'Ratings Profile Data') ||
      (selectedCategoryLabel === 'Identity Data' && this.selectedItem.label === 'Index Indicator')) {
      if (this.selectedItem.label === 'Index Indicator') {
        if (this.checkRatingsAndIndustries('Index Indicator') === false) {
          return false;
        }
      } else {
        if (this.checkRatingsAndIndustries(this.selectedItem.label) === false) {
          return false;
        }
      }
      if (len === 0) {
        this.selectedIndexIndicators = null;
        this.btnModelOpen_Click('indexIndicator');
        return false;
      } else {
        alert('Please Add the Criteria');
        return false;
      }
    } else if (this.selectedItem.label === 'GIC SubIndustry') {
      if (this.checkRatingsAndIndustries('GIC SubIndustry') === false) {
        return false;
      }
      if (len === 0) {
        this.selectedGICSubIndustries = null;
        this.btnModelOpen_Click('gicsubind');
        return false;
      } else {
        alert('Please Add the Criteria');
        return false;
      }
    } else if (this.selectedItem.label === 'RussellIndustry') {
      if (this.checkRatingsAndIndustries('RussellIndustry') === false) {
        return false;
      }
      if (len === 0) {
        this.selectedRusselIndustry = null;
        this.btnModelOpen_Click('russellInd');
        return false;
      } else {
        alert('Please Add the Criteria');
        return false;
      }
    } else if (this.selectedItem.label === 'CountryCode') {
      if (this.checkRatingsAndIndustries('CountryCode') === false) {
        return false;
      }
      if (len === 0) {
        this.selectedcountrycodes = null;
        this.btnModelOpen_Click('countryCode');
        return false;
      } else {
        alert('Please Add the Criteria');
        return false;
      }
    } else if (this.selectedItem.label === 'ERS Reason Indicator') {
      if (this.checkRatingsAndIndustries('ERS Reason Indicator;') === false) {
        return false;
      }
      if (len === 0) {
        let disitem = '';
        disitem = this.selectedItem.label;
        this.selectedERSModel = this.selectedItem.label;
        this.btnModelOpen_Click('ers');
        return false;
      } else {
        alert('Please Add the Criteria');
        return false;
      }
    } else if (this.selectedItem.label === '1 Week ERS Change' || this.selectedItem.label === '2 Week ERS Change' ||
      this.selectedItem.label === '3 Week ERS Change' || this.selectedItem.label === '1 Month ERS Change' ||
      this.selectedItem.label === '2 Month ERS Change') {
      if (len === 0) {
        let disitem;
        disitem = this.selectedItem.label;
        this.selectedERSModel = this.selectedItem.label;
        this.btnModelOpen_Click('ers');
        return false;
      } else {
        alert('Please Add the Criteria');
        return false;
      }
    } else if (this.selectedItem.label === 'Short Term Rating' || this.selectedItem.label === '15 Day Trend' ||
      this.selectedItem.label === 'BreakOut Type') {
      const StrQueryItem = this.funReplace(this.funReplace(this.selectedItem.label, '&', '3'), ' ', '2');
      if (len === 0) {
        this.itemInput = this.selectedItem.label.replace(/ /g, '');
        this.btnModelOpen_Click('str');
        return false;
      } else {
        alert('Please Add the Criteria');
        return false;
      }
    }
    return true;
  }
  // #endregion

  // #region [Replace Function]
  /**
   * Funs replace - Replace
   * @param strReplaceText Original String
   * @param strFind Find Text
   * @param strReplaceWith Replace Text
   */
  funReplace(strReplaceText, strFind, strReplaceWith) {
    let strReturnText;
    const splitArr = strReplaceText.split(strFind);
    strReturnText = splitArr.join(strReplaceWith);
    return strReturnText;
  }
  // #endregion

  // #region [Check Ratings And Industries]
  /**
   * Checks ratings and industries
   * @param strCheckItem Added Item
   */
  checkRatingsAndIndustries(strCheckItem) {
    for (const strategyItem of this.lstStrategies) {
      if (strategyItem.strategy.indexOf(strCheckItem) >= 0) {
        alert('Criteria relating to this dataitem already exists\nRepetition is not allowed');
        return false;
      }
    }
    return true;
  }
  // #endregion

  // #region [Trim String]
  /**
   * Funs trim string - Removes Spaces and Enter
   * @param objStr Input String
   */
  funTrimString(objStr) {
    if (objStr.charCodeAt(0) === 32 || objStr.charCodeAt(0) === 13 || objStr.charCodeAt(0) === 10) {
      objStr = objStr.substr(1, objStr.length);
      this.funTrimString(objStr);
    } else if (objStr.charCodeAt(objStr.length - 1) === 32 || objStr.charCodeAt(objStr.length - 1) === 13 ||
      objStr.charCodeAt(objStr.length - 1) === 10) {
      if (objStr.charCodeAt(objStr.length - 1) === 10) {
        objStr = objStr.substr(0, objStr.length - 2);
      } else {
        objStr = objStr.substr(0, objStr.length - 1);
      }
      this.funTrimString(objStr);
    }
  }
  // #endregion

  // #region [funTopBottomExists]
  /**
   * Funs top bottom exists - Check for TOP and BOTTOM Keywords
   * @param intOperator Input Vaue
   */
  funTopBottomExists(intOperator) {
    if (this.lstStrategies.length !== 0 && (intOperator === 0 || intOperator === 2)) {
      for (const strategyItem of this.lstStrategies) {
        if (strategyItem.strategy.toLowerCase().indexOf('[top') >= 0 ||
          strategyItem.strategy.toLowerCase().indexOf('[middle') >= 0 ||
          strategyItem.strategy.toLowerCase().indexOf('[bottom') >= 0) {

        }
      }
    }
    if ((this.funReplace(this.selectedFormulaText, ' ', '').toLowerCase().indexOf('[top') >= 0 ||
      this.funReplace(this.selectedFormulaText, ' ', '').toLowerCase().indexOf('[middle') >= 0 ||
      this.funReplace(this.selectedFormulaText, ' ', '').toLowerCase().indexOf('[bottom') >= 0) && intOperator !== 2) {
      return false;
    }
    return true;
  }
  // #endregion

  // #region [ReplaceAndOr]
  /**
   * Funs replace and or
   */
  funReplaceAndOr() {
    let strCriteria;
    strCriteria = this.funReplace(this.selectedFormulaText.toLowerCase(), '[and]', '&');
    strCriteria = this.funReplace(strCriteria, '[or]', '|');
    return strCriteria;
  }
  // #endregion

  // #region [CheckTopBottomBeforeAdd]
  /**
   * Funs check top bottom before add
   */
  funCheckTopBottomBeforeAdd() {
    const strCriteria = this.selectedFormulaText;
    let IntOpeningBracketsCount = 0;
    let IntClosingBracketsCount = 0;
    let intCount;
    let intFlagForExec = 0;
    for (intCount = 0; intCount < strCriteria.length; intCount++) {
      if (strCriteria.charAt(intCount) === '[') {
        IntOpeningBracketsCount = IntOpeningBracketsCount + 1;
      } else if (strCriteria.charAt(intCount) === ']') {
        IntClosingBracketsCount = IntClosingBracketsCount + 1;
      }
    }
    if (IntOpeningBracketsCount === IntClosingBracketsCount && IntOpeningBracketsCount >= 2 && IntClosingBracketsCount >= 2) {
      const ArrCriteria = strCriteria.split(']');
      for (intCount = 0; intCount < ArrCriteria.length; intCount++) {
        if (intCount === 0) {
          if (ArrCriteria[0].split(' ').length === 1 || (this.funReplace(ArrCriteria[0].split(' ')[1], ' ', '').length === 0)) {
            alert('Check whether Numeric Value is entered after TOP/BOTTOM\nKeep one space between TOP/BOTTOM and Numeric Value');
            intFlagForExec = 1;
            break;
          } else if ((ArrCriteria[0].split(' ').length > 2) ||
            (ArrCriteria[0].toLowerCase().indexOf('top') < 0 && ArrCriteria[0].toLowerCase().indexOf('bottom') < 0 &&
              ArrCriteria[0].toLowerCase().indexOf('middle') < 0)) {
            alert('Enter \'[TOP/BOTTOM ##][DataItem1][DataItem2]... as Criteria\'');
            intFlagForExec = 1;
            break;
          } else if (parseInt(ArrCriteria[0].split(' ')[1], 32) > 4000000000) {
            alert('\'' + ArrCriteria[0].split(' ')[1] + '\' is not a valid Numeric Value for TOP/BOTTOM');
            intFlagForExec = 1;
            break;
          }
        } else {
          if (ArrCriteria[intCount].length > 0) {
            if (this.checkDataItem(ArrCriteria[intCount].substring(1)) === false) {
              alert('Check Criteria at \'' + ArrCriteria[intCount].substring(0) + '\'\nNot a Valid Dataitem');
              intFlagForExec = 1;
              break;
            }
          }
        }
      }
    } else {
      alert('Enter \'[TOP/BOTTOM ##][DataItem1][DataItem2]... as Criteria\'');
      intFlagForExec = 1;
    }
    if (intFlagForExec === 0) {
      const StrForFinal = this.funReplace(strCriteria.substring(strCriteria.indexOf(']') + 1), ']', '],');
      this.frameItemInfo(StrForFinal.substring(0, StrForFinal.length - 1));
      if (strCriteria.substring(1, strCriteria.indexOf(']')).toLowerCase().indexOf('top') >= 0 ||
        strCriteria.substring(1, strCriteria.indexOf(']')).toLowerCase().indexOf('middle') >= 0) {
        if (strCriteria.substring(1, strCriteria.indexOf(']')).toLowerCase().indexOf('middle') >= 0) {
          const arrMiddle = strCriteria.split(' ');
          const arrMiddleval = arrMiddle[1].split(';');
          if (parseInt(arrMiddleval[0], 10) < 0) {
            this.funAddCriteriaToList(strCriteria, 'order by ' + this.funReplace(this.finalString.split('$$$')[0], ',', ' asc,') +
              ' asc' + '$$$' + strCriteria.substring(1, strCriteria.indexOf(']')) + ',' + this.finalString.split('$$$')[1]);
          } else {
            this.funAddCriteriaToList(strCriteria, 'order by ' + this.funReplace(this.finalString.split('$$$')[0], ',', ' desc,') +
              ' desc' + '$$$' + strCriteria.substring(1, strCriteria.indexOf(']')) + ',' + this.finalString.split('$$$')[1]);
          }
        } else {
          this.funAddCriteriaToList(strCriteria, 'order by ' + this.funReplace(this.finalString.split('$$$')[0], ',', ' desc,') +
            ' desc' + '$$$' + strCriteria.substring(1, strCriteria.indexOf(']')) + ',' + this.finalString.split('$$$')[1]);
        }
      } else {
        this.funAddCriteriaToList(strCriteria, 'order by ' + this.funReplace(this.finalString.split('$$$')[0], ',', ' asc,') +
          ' asc' + '$$$' + strCriteria.substring(1, strCriteria.indexOf(']')) + ',' + this.finalString.split('$$$')[1]);
      }
    }
  }
  // #endregion

  // #region [BracketsAndSpCheck]
  /**
   * Brackets and sp check - Checks for Special Characters
   */
  bracketsAndSpCheck() {
    let strtxt = this.funReplace(this.selectedFormulaText, ' ', '');
    let OpenBrack1 = 0;
    let CloseBrack1 = 0;
    let OpenBrack2 = 0;
    let CloseBrack2 = 0;
    let str = '';
    if (this.hidstock === '1') {
      str = '][ () [] ,) )( )[ ]_ _] $ ^ ? ~ ` \\ , [[ ]] } { : @ " | +)';
      str += '-) *) /) +] -] *] /] ]( (+ (- (* (/ [+ [- [* [/ (% [% .. [( )] => =< == =! =* =/ *= /= /0';
    } else {
      str = '][ () [] ,) )( )[ ]_ _] $ ^ ? & ~ ` \\ , [[ ]] } { : ; @ " | +)';
      str += '-) *) /) +] -] *] /] ]( (+ (- (* (/ [+ [- [* [/ (% [% .. [( )] => =< == =! =* =/ *= /= /0';
    }
    if (strtxt.indexOf('[') !== 0 && strtxt.indexOf('(') !== 0 && ((strtxt.charCodeAt(0)) < 48 || (strtxt.charCodeAt(0)) > 57)) {
      alert('DataItem must start with \'[\' bracket or \'(\' bracket or with numeric value');
      return false;
    }
    if ((strtxt.lastIndexOf(']') !== strtxt.length - 1) && (strtxt.lastIndexOf(')') !== strtxt.length - 1) &&
      ((strtxt.charCodeAt(strtxt.length - 1)) < 48 || (strtxt.charCodeAt(strtxt.length - 1)) > 57)) {
      alert('DataItem must end with \']\' bracket or \')\' bracket or with numeric value');
      return false;
    }
    for (let i = 0; i < strtxt.length; i++) {
      if (strtxt.charAt(i) === '[') {
        OpenBrack1 = OpenBrack1 + 1;
      }
      if (strtxt.charAt(i) === ']') {
        CloseBrack1 = CloseBrack1 + 1;
      }
      if (strtxt.charAt(i) === '(') {
        OpenBrack2 = OpenBrack2 + 1;
      }
      if (strtxt.charAt(i) === ')') {
        CloseBrack2 = CloseBrack2 + 1;
      }
      if (strtxt.charAt(i) === '.' && (isNaN(strtxt.charAt(i - 1)) || isNaN(strtxt.charAt(i + 1)))) {
        if (strtxt.indexOf('stocks;') > 0) {

        } else {
          alert('Dot \'.\' should be placed between Numeric Values');
          return false;
        }
      }
      if (strtxt.charAt(i) === '#' && strtxt.charAt(i + 1).toLowerCase() !== 'd'.toString() &&
        strtxt.charAt(i - 1).toLowerCase() !== 'e'.toString()) {
        alert('Check your Data Item at \'#\'');
        return false;
      }
    }
    if (OpenBrack1 !== CloseBrack1) {
      alert('Check Opening \'[\' and Closing \']\' Brackets');
      return false;
    }
    if (OpenBrack2 !== CloseBrack2) {
      alert('Check Opening \'(\' and Closing \')\' Brackets');
      return false;
    }
    const strarray = str.split(' ');
    strtxt = this.funReplace(strtxt.toLowerCase(), '[and]', '<');
    strtxt = this.funReplace(strtxt.toLowerCase(), '[or]', '>');
    for (const strItem of strarray) {
      if (strtxt.indexOf(strItem) >= 0) {
        if (strItem === '[[' || strItem === ']]' || strItem === '[(' || strItem === ')]') {
          alert('Use \'()\' brackets for Combining Data items. \'[[\' or \']]\' or \'[(\' or \')]\' is not allowed');
        } else if (strItem === '][' || strItem === '](' || strItem === ')[') {
          alert('There Must be Operators between dataitems');
        } else {
          if (strItem === '~') {
            break;
          } else {
            alert('Check your Data Item at  \'' + strItem + '\'');
          }
        }
        return false;
      }
    }
    if (strtxt.indexOf('<') < 0 && strtxt.indexOf('>') < 0 && strtxt.indexOf('=') < 0) {
      alert('Invalid Criteria\nComparision Operators(< > = != <= >=) are not used');
      return false;
    }
    if ((strtxt.indexOf('+') < 0 && strtxt.indexOf('-') < 0 && strtxt.indexOf('*') < 0 && strtxt.indexOf('/') < 0 &&
      strtxt.indexOf('<') < 0 && strtxt.indexOf('>') < 0 && strtxt.indexOf('=') < 0) && (OpenBrack1 > 1 || CloseBrack2 > 1)) {
      alert('There Must be Operators between dataitems');
      return false;
    }
    return true;
  }
  // #endregion

  // #region [Check Numeric Operators]
  /**
   * Checks operator numeric
   * @param txt Input String
   * @param ptxt Input Value
   */
  checkOperatorNumeric(txt, ptxt) {
    let snumb = -1;
    if (ptxt === 2) {
      if (isNaN(txt)) {
        return false;
      } else {
        return true;
      }
    }
    for (let f = 0; f < txt.length; f++) {
      if ((txt.charCodeAt(f) >= 48 && txt.charCodeAt(f) <= 57) || txt.charCodeAt(f) === 46) {
        if (snumb === -1) {
          snumb = f;
        }
        if (f === 0 && ptxt === 1) {
          this.msg = 'Numeric Values after dataitems should be Preceeded by Operators';
          return false;
        }
        if (snumb !== -1 && f === txt.length - 1) {
          if (ptxt === 0) {
            this.msg = 'Numeric Values before dataitems should be Succeded by Operators';
            return false;
          }
          if (isNaN(txt.substring(snumb, txt.length))) {
            this.msg = 'Not a valid Numeric Value';
            return false;
          }
        }
      } else if (snumb !== -1) {
        if (this.checkOperatorNumeric(txt.substring(snumb, f), 2)) {
          snumb = -1;
        } else {
          this.msg = 'Not a valid Numeric Value';
          return false;
        }
      }
      if ((txt.charCodeAt(f) >= 65 && txt.charCodeAt(f) <= 90) || (txt.charCodeAt(f) >= 97 && txt.charCodeAt(f) <= 122)) {
        this.msg = 'Not a valid Numeric Value';
        return false;
      }
      if ((txt.charCodeAt(f) >= 48 && txt.charCodeAt(f) <= 57) &&
        (txt.charCodeAt(f - 1) < 48 || txt.charCodeAt(f - 1) > 57) && ptxt === 1) {
        if (txt.charAt(f - 1) !== '+' && txt.charAt(f - 1) !== '-' && txt.charAt(f - 1) !== '*' && txt.charAt(f - 1) !== '/' &&
          txt.charAt(f - 1) !== '.' && txt.charAt(f - 1) !== '&' && txt.charAt(f - 1) !== '|' && txt.charAt(f - 1) !== '<' &&
          txt.charAt(f - 1) !== '>' && txt.charAt(f - 1) !== '=') {
          this.msg = 'Numeric Values should be Preceeded by Operators';
          return false;
        }
      }
      if ((txt.charCodeAt(f) >= 48 && txt.charCodeAt(f) <= 57) &&
        (txt.charCodeAt(f + 1) < 48 || txt.charCodeAt(f + 1) > 57) && ptxt === 0) {
        if (txt.charAt(f + 1) !== '+' && txt.charAt(f + 1) !== '-' && txt.charAt(f + 1) !== '*' && txt.charAt(f + 1) !== '/' &&
          txt.charAt(f + 1) !== '.' && txt.charAt(f + 1) !== '&' && txt.charAt(f + 1) !== '|' && txt.charAt(f + 1) !== '<' &&
          txt.charAt(f + 1) !== '>' && txt.charAt(f + 1) !== '=') {
          this.msg = 'Numeric Values should be Succeeded by Operators';
          return false;
        }
      }
      if (txt.charAt(f) === '%') {
        this.msg = 'Not a valid Numeric Value';
        return false;
      }
    }
    return true;
  }
  // #endregion

  // #region [Replace Operators]
  /**
   * Funs replace operators - Replaces &,| characters
   * @param strPopupText Input String
   */
  funReplaceOperators(strPopupText) {
    return this.funReplace(this.funReplace(strPopupText, '&', '[AND]'), '|', '[OR]');
  }
  // #endregion

  // #region [CheckDataItem]
  /**
   * Checks data item
   * @param txtDatItem Input Criteria
   */
  checkDataItem(txtDatItem) {
    let txtDatItem1;
    if (txtDatItem.indexOf('~') > 0) {
      txtDatItem1 = txtDatItem;
      txtDatItem = txtDatItem.substr(0, txtDatItem.indexOf('~'));
    }
    let pos;
    for (let j = 0; j < this.masterItemsArray.length; j++) {
      pos = (this.masterItemsArray[j].toLowerCase()).indexOf('^' + txtDatItem.toLowerCase() + '^');
      if (pos >= 0) {
        if (j === 17 || txtDatItem.toLowerCase().indexOf('gic subindustry') >= 0) {
          return false;
        } else {
          return true;
        }
      }
      if (pos >= 0) {
        if (j === 6 || txtDatItem.toLowerCase().indexOf('russellindustry') >= 0) {
          return false;
        } else {
          return true;
        }
      }
      if (pos >= 0) {
        if (j === 6 || txtDatItem.toLowerCase().indexOf('countrycode') >= 0) {
          return false;
        } else {
          return true;
        }
      }
    }
    if (pos < 0) {
      return false;
    }
  }
  // #endregion

  // #region [Check Ranges]
  /**
   * Funs check ranges
   * @param StrForRanges Input Criteria
   * @param SplitValue Input Split Character
   */
  funCheckRanges(StrForRanges, SplitValue) {
    let flag;
    StrForRanges = this.funReplace(this.funReplace(this.funReplace(StrForRanges, '!=', '!'), '<=', '@'), '>=', '$');
    const StrArrayForRanges = StrForRanges.split(SplitValue);
    for (const arrayRange of StrArrayForRanges) {
      if (arrayRange.indexOf('<') < 0 && arrayRange.indexOf('>') < 0 && arrayRange.indexOf('=') < 0 &&
        arrayRange.indexOf('!') < 0 && arrayRange.indexOf('$') < 0 && arrayRange.indexOf('@') < 0) {
        if (this.hidstock !== '1') {
          alert('Invalid use of Range Operators [AND],[OR]');
          flag = 1;
          return false;
        }
      }
      for (let j = 0; j < arrayRange.length; j++) {
        if (arrayRange.charAt(j) === '@' || arrayRange.charAt(j) === '$' || arrayRange.charAt(j) === '!' ||
          arrayRange.charAt(j) === '<' || arrayRange.charAt(j) === '>' || arrayRange.charAt(j) === '=') {
          let epos = arrayRange.length;
          if (arrayRange.indexOf('@', j + 1) !== -1) {
            epos = arrayRange.indexOf('@', j + 1);
          }
          if (arrayRange.indexOf('$', j + 1) !== -1) {
            epos = arrayRange.indexOf('$', j + 1);
          }
          if (arrayRange.indexOf('!', j + 1) !== -1) {
            epos = arrayRange.indexOf('!', j + 1);
          }
          if (arrayRange.indexOf('<', j + 1) !== -1) {
            epos = arrayRange.indexOf('<', j + 1);
          }
          if (arrayRange.indexOf('>', j + 1) !== -1) {
            epos = arrayRange.indexOf('>', j + 1);
          }
          if (arrayRange.indexOf('=', j + 1) !== -1) {
            epos = arrayRange.indexOf('=', j + 1);
          }
          if (epos !== arrayRange.length) {
            alert('Only one Comparision Operator should be used');
            flag = 1;
            return false;
          }
        }
      }
    }
    return true;
  }
  // #endregion

  // #region [AddCriteriaToList]
  /**
   * Funs add criteria to list
   * @param StrItemDesc Criteria Item Description
   * @param StrItemInfo Criteria
   */
  funAddCriteriaToList(StrItemDesc, StrItemInfo) {
    let i = 0;
    if (this.lstStrategies.length > 0) {
      for (i = 0; i < this.lstStrategies.length; i++) {
        if (this.lstStrategies[i].strategy.toLowerCase() === StrItemDesc.toLowerCase()) {
          alert('Criteria already Exists');
          i = 111;
          break;
        }
      }
    }

    const stratID = Math.max.apply(Math, this.lstStrategies.map(function fun(o) { return o.strategyId; }));
    if (i !== 111) {
      if (StrItemDesc === '') {
        if (this.lstStrategies.length === 0) {
          this.lstStrategies.push({
            strategyId: 1,
            strategy: StrItemDesc,
            strategyValue: StrItemInfo
          });
        } else if (this.lstStrategies.length > 0) {
          if (this.editedStartegy !== 0) {
            const itemIndex = this.lstStrategies.findIndex(item => item.strategyId === this.editedStartegy);
            this.lstStrategies[itemIndex].strategy = StrItemDesc;
            this.lstStrategies[itemIndex].strategyValue = StrItemInfo;
            this.editedStartegy = 0;
          } else {
            this.lstStrategies.push({
              strategyId: stratID + 1,
              strategy: StrItemDesc,
              strategyValue: StrItemInfo
            });
          }
        }
      } else {
        if (this.lstStrategies.length === 0) {
          this.lstStrategies.push({
            strategyId: 1,
            strategy: StrItemDesc,
            strategyValue: StrItemInfo
          });
        } else if (this.lstStrategies.length > 0) {
          if (this.editedStartegy !== 0) {
            const itemIndex = this.lstStrategies.findIndex(item => item.strategyId === this.editedStartegy);
            this.lstStrategies[itemIndex].strategy = StrItemDesc;
            this.lstStrategies[itemIndex].strategyValue = StrItemInfo;
            this.editedStartegy = 0;
          } else {
            this.lstStrategies.push({
              strategyId: stratID + 1,
              strategy: StrItemDesc,
              strategyValue: StrItemInfo
            });
          }
        }
        this.selectedFormulaText = '';
      }
      this.finalString = '';
    }
  }
  // #endregion

  // #region [FrameItemInfo]
  /**
   * Frames item info
   * @param finaltxt Input Criteria
   */
  frameItemInfo(finaltxt) {
    let finalitem;
    let eindex;
    let sindex;
    let strSelectList = '';
    for (let i = 0; i < finaltxt.length; i++) {
      if (finaltxt.charAt(i) === '[') {
        if (finaltxt.substring(i + 1, finaltxt.indexOf(']', i + 1)).indexOf('~') > 0) {
          let finaltxt1;
          finaltxt1 = finaltxt.substring(i + 1, finaltxt.indexOf(']', i + 1));
          finaltxt1 = finaltxt1.substr(0, finaltxt1.indexOf('~'));
          finalitem = '^' + finaltxt1 + '^';
        } else {
          finalitem = '^' + finaltxt.substring(i + 1, finaltxt.indexOf(']', i + 1)) + '^';
        }
        if (finalitem.toLowerCase() === '^and^' || finalitem.toLowerCase() === '^or^') {
          i = finaltxt.indexOf(']', i + 1);
          this.finalString = this.finalString + ' ' + finalitem.substring(1, finalitem.length - 1) + ' ';
        } else {
          i = finaltxt.indexOf(']', i + 1);
          for (let r = 0; r < this.masterItemsArray.length; r++) {
            if ((this.masterItemsArray[r].toLowerCase()).indexOf(finalitem.toLowerCase()) >= 0) {
              const eDindex = this.masterItemsArray[r].indexOf('@', (this.masterItemsArray[r].toLowerCase())
                .indexOf(finalitem.toLowerCase()));
              eindex = (this.masterItemsArray[r].toLowerCase()).indexOf(finalitem.toLowerCase());
              if ((this.masterItemsArray[r].substring(0, eDindex)).lastIndexOf('@') < 0) {
                sindex = 0;
              } else {
                sindex = ((this.masterItemsArray[r].substring(0, eDindex)).lastIndexOf('@')) + 1;
              }
              if (r === 25) {
                this.finalString = this.finalString + '(' + this.masterItemsArray[r].substring(sindex, eindex).split('$$$')[0] + ')';
                if (strSelectList.indexOf(this.masterItemsArray[r].substring(sindex, eindex).split('$$$')[1]) < 0) {
                  strSelectList = strSelectList + this.masterItemsArray[r].substring(sindex, eindex).split('$$$')[1] + ',';
                }
              } else {
                this.finalString = this.finalString + this.masterItemsArray[r].substring(sindex, eindex);
                if (strSelectList.indexOf(this.masterItemsArray[r].substring(sindex, eindex) + ',') < 0) {
                  strSelectList = strSelectList + this.masterItemsArray[r].substring(sindex, eindex) + ' as \'' +
                    finalitem.substring(1, finalitem.length - 1) + '\',';
                }
              }
              break;
            }
          }
        }
      } else {
        this.finalString = this.finalString + finaltxt.charAt(i);
      }
    }
    this.finalString = this.finalString + '$$$' + strSelectList.substring(0, strSelectList.length - 1);
  }
  // #endregion

  // #region [modelClose]
  /**
   * Models close
   * @param event  Close
   * @param modelName ex(alphas,bool etc)
   */
  modelClose(event: any, modelName: string) {
    this.editedStartegy = 0;
    this.selectedDecile = null;
    this.selectedBoolean = null;
    this.selectedMiddle = null;
    this.selectedRank = null;
    this.selectedSTR = null;
    this.selectedERS = null;
    if (this.lstStrategiesCopy.length > 0) {
      this.lstStrategies = this.lstStrategiesCopy;
    }
    this.lstStrategiesCopy = [];
    this.modelToggle(modelName, false);
  }
  // #endregion

  // #region [modelToggle]
  /**
   * Models toggle
   * @param modelName Ex(Alphas, bool etc)
   * @param modalToggle Show,Close
   */
  modelToggle(modelName: string, modalToggle: boolean) {
    switch (modelName) {
      case 'stocks': {
        if (modalToggle) {
          modalToggle = this.openDialog('stocks');
        }
        this.stocksModelOpen = modalToggle;
        break;
      }
      case 'benchmarks': {
        if (modalToggle) {
          modalToggle = this.openDialog('benchmarks');
        }
        this.benchmarksModelOpen = modalToggle;
        break;
      }
      case 'subind': {
        if (modalToggle) {
          modalToggle = this.openDialog('subind');
        }
        this.subindModelOpen = modalToggle;
        break;
      }
      case 'statistics': {
        if (modalToggle) {
          modalToggle = this.openDialog('statistics');
        }
        this.statisticsModelOpen = modalToggle;
        break;
      }
      case 'math': {
        if (modalToggle) {
          modalToggle = this.openDialog('math');
        }
        this.mathModelOpen = modalToggle;
        break;
      }
      case 'growth': {
        if (modalToggle) {
          modalToggle = this.openDialog('growth');
        }
        this.growthModelOpen = modalToggle;
        break;
      }
      case 'alpha': {
        this.alphaModelOpen = modalToggle;
        break;
      }
      case 'bool': {
        this.boolModelOpen = modalToggle;
        break;
      }
      case 'decile': {
        this.decileModelOpen = modalToggle;
        break;
      }
      case 'middle': {
        this.middleModelOpen = modalToggle;
        break;
      }
      case 'rank': {
        this.rankModelOpen = modalToggle;
        break;
      }
      case 'ntile': {
        this.ntileModelOpen = modalToggle;
        break;
      }
      case 'countryCode': {
        this.countryCodeModelOpen = modalToggle;
        break;
      }
      case 'incExc': {
        this.incExcModelOpen = modalToggle;
        break;
      }
      case 'indexIndicator': {
        this.indexIndicatorModelOpen = modalToggle;
        break;
      }
      case 'ers': {
        this.ersModelOpen = modalToggle;
        break;
      }
      case 'str': {
        this.strModelOpen = modalToggle;
        break;
      }
      case 'russellInd': {
        this.russellIndModelOpen = modalToggle;
        break;
      }
      case 'gicsubind': {
        this.gicsubindModelOpen = modalToggle;
        break;
      }
      case 'dates': {
        if (modalToggle) {
          modalToggle = this.getDates();
        }
        this.displayDatesDialog = modalToggle;
        break;
      }
      case 'datesGrid': {
        this.yearValidation = 'yearValidation';
        this.displayDatesGridDialog = modalToggle;
        break;
      }
      default: {
        break;
      }
    }
  }
  // #endregion

  // #region [modelSubmit]
  /**
   * Models submit
   * @param event ModalPopup Data
   * @param modelName Ex(Alphas, Bool etc)
   */
  modelSubmit(event: any, modelName: string) {
    switch (modelName) {
      case 'stocks': {
        this.hidstock = '1';
        this.selectedFormulaText = this.selectedFormulaText + event.description;
        this.stocksModelOpen = false;
        break;
      }
      case 'benchmarks': {
        this.hidstock = '1';
        this.selectedFormulaText = this.selectedFormulaText + event.description;
        this.benchmarksModelOpen = false;
        break;
      }
      case 'subind': {
        this.hidstock = '1';
        this.selectedFormulaText = this.selectedFormulaText + event.description;
        this.subindModelOpen = false;
        break;
      }
      case 'statistics': {
        this.hidstock = '1';
        this.selectedFormulaText = this.selectedFormulaText + event.description;
        this.statisticsModelOpen = false;
        break;
      }
      case 'math': {
        this.hidstock = '1';
        this.selectedFormulaText = this.selectedFormulaText + event.description;
        this.mathModelOpen = false;
        break;
      }
      case 'growth': {
        this.hidstock = '1';
        this.selectedFormulaText = this.selectedFormulaText + event.description;
        this.growthModelOpen = false;
        break;
      }
      case 'alpha': {
        this.funAddCriteriaToList(event.description, event.value);
        this.alphaModelOpen = false;
        break;
      }
      case 'bool': {
        this.funAddCriteriaToList(event.description, event.value);
        this.selectedBoolean = null;
        this.boolModelOpen = false;
        break;
      }
      case 'decile': {
        this.funAddCriteriaToList(event.description, event.value);
        this.selectedDecile = null;
        this.decileModelOpen = false;
        break;
      }
      case 'middle': {
        this.funAddCriteriaToList(event.description, event.value);
        this.selectedMiddle = null;
        this.middleModelOpen = false;
        break;
      }
      case 'rank': {
        this.funAddCriteriaToList(event.description, event.value);
        this.selectedRank = null;
        this.rankModelOpen = false;
        break;
      }
      case 'ntile': {
        this.ntileModelOpen = false;
        break;
      }
      case 'countryCode': {
        this.funAddCriteriaToList(event.description, event.value);
        this.countryCodeModelOpen = false;
        break;
      }
      case 'incExc': {
        this.incExcPopupClose(event);
        this.incExcModelOpen = false;
        break;
      }
      case 'indexIndicator': {
        this.funAddCriteriaToList(event.description, event.value);
        this.indexIndicatorModelOpen = false;
        break;
      }
      case 'ers': {
        this.funAddCriteriaToList(event.description, event.value);
        this.ersModelOpen = false;
        break;
      }
      case 'str': {
        this.funAddCriteriaToList(event.description, event.value);
        this.strModelOpen = false;
        break;
      }
      case 'russellInd': {
        this.funAddCriteriaToList(event.description, event.value);
        this.russellIndModelOpen = false;
        break;
      }
      case 'gicsubind': {
        this.funAddCriteriaToList(event.description, event.value);
        this.gicsubindModelOpen = false;
        break;
      }
      case 'dates': {
        let openerdate: string;
        openerdate = this.selectedFormulaText;
        openerdate = openerdate.substr(0, openerdate.length - 1);
        this.selectedFormulaText = openerdate + '~' + event + ']';
        this.displayDatesDialog = false;
        break;
      }
      case 'datesGrid': {
        const itemIndex = this.lstStrategies.findIndex(item => item.strategyId === this.datesStrategy);
        let openerdate: string;
        openerdate = this.lstStrategies[itemIndex].strategy;
        const splitDate = openerdate.split(':')[0];
        this.lstStrategies[itemIndex].strategy = splitDate + ':' + event;
        this.displayDatesGridDialog = false;
        this.yearValidation = null;
        break;
      }
      default: {
        break;
      }
    }
  }
  // #endregion

  // #region [incExcPopupClose]
  /**
   * Incs exc popup close
   * @param event Inc/Exc Popup Data
   */
  incExcPopupClose(event) {
    this.lstIncExcValues = [];
    let lstIncExc: any = [];
    this.incExcVal = event;
    if (this.incExcVal !== '' && this.incExcVal.indexOf('@') > -1) {
      if (this.incExcVal.split('@')[0] !== '' && this.incExcVal.split('@')[0].split('~')[1].split(',')[0] !== '') {
        this.includedStocks = this.incExcVal.split('@')[0].split('~')[1];
        lstIncExc.label = 'Include';
        lstIncExc.value = this.includedStocks;
        this.lstIncExcValues.push(lstIncExc);
        this.includeCount = this.incExcVal.split('@')[0].split('~')[1].split(',').length;
      } else {
        this.includeCount = 0;
      }
      if (this.incExcVal.split('@')[1] !== '' && this.incExcVal.split('@')[1].split('~')[1].split(',')[0] !== '') {
        this.excludedStocks = this.incExcVal.split('@')[1].split('~')[1];
        lstIncExc = [];
        lstIncExc.label = 'Exclude';
        lstIncExc.value = this.excludedStocks;
        this.lstIncExcValues.push(lstIncExc);
        this.excludeCount = this.incExcVal.split('@')[1].split('~')[1].split(',').length;
      } else {
        this.excludeCount = 0;
      }
    } else {
    }
    this.incExcModelOpen = false;
  }
  // #endregion

  // #region [Modal Dialog]
  /**
   * Opens dialog
   * @param srcFrom Stocks, benchmarks
   */
  openDialog(srcFrom: string) {
    const textval = this.selectedFormulaText;
    if (textval === '') {
      alert('Please add item');
      return false;
    }
    if (textval !== '') {
      if (srcFrom === 'stocks') {
        if (textval.toLowerCase().indexOf('benchmark;') > 0) {
          alert('Only stocks or benchmarks allowed ');
          return false;
        }
      } else if (srcFrom === 'benchmarks') {
        if (textval.toLowerCase().indexOf('stocks;') > 0) {
          alert('Only stocks or benchmarks allowed ');
          return false;
        }
      }
    }
    const arstr = this.selectedFormulaText.charAt(this.selectedFormulaText.length - 1);
    if (arstr === '+' || arstr === '-' || arstr === '*' || arstr === '/' || arstr === '=' ||
      arstr === '!=' || arstr === '>=' || arstr === '<=' || arstr === '>' || arstr === '<') {
      return true;
    } else {
      alert('Add operator');
      return false;
    }
  }
  // #endregion

  // #region [Get Dates]
  /**
   * Gets dates - Checks for ']'
   */
  getDates() {
    const arstr = this.selectedFormulaText.charAt(this.selectedFormulaText.length - 1);
    if (arstr !== ']') {
      alert('Dates cannot be added here');
      return false;
    } else {
      return true;
    }
  }
  // #endregion

  // #region [navigateByRoute]
  /**
   * Navigates by route
   * @param path Page Navigate to
   * @param mode for handing View/Edit
   */
  navigateByRoute(path, mode: string) {
    const queryParamsNew: any = this.dataSvc.getQueryParams(path);
    this.dataSvc.changePagePath(queryParamsNew.Id);
    queryParamsNew.Mode = mode;
    queryParamsNew.Source = 'ConstructScreen';
    this.router.navigate([path], { queryParams: queryParamsNew, skipLocationChange: false });
  }
  // #endregion

  // #region [Get Folders List]
  /**
   * Gets folders list - Loads All Folders from Database
   */
  getFoldersList() {
    this.subGetMasterFolders = this.commonSvc.getMasterFolders(this.userId.toString()).subscribe(
      (folders) => {
        this.lstFolders = folders;
        this.displaySaveDialog = true;
      }
    );
  }
  // #endregion

  // #region [ShowErrorDetail]
  /**
   * Shows error detail
   * @param data Return Value from Database after Insert/Update/Delete
   * @param Mode Page Mode Save/Save&View
   */
  showErrorDetail(data: ReturnValue, Mode: string) {
    if (data && data !== null && data.status && data.status.toString() !== '') {
      switch (data.status.toString()) {
        case 'Success':
          this.msgSvc.add({
            key: 'saveSuccess',
            sticky: false,
            severity: 'success',
            summary: 'Info Message',
            detail: Mode + ' successfully'
          });
          this.clearControls();
          break;
        case 'Error':
          this.msgSvc.add({
            key: 'saveError',
            sticky: false,
            severity: 'error',
            summary: 'Error',
            detail: 'Error Occurred'
          });
          break;
        default:
          this.msgSvc.add({
            key: 'saveError',
            sticky: false,
            severity: 'error',
            summary: 'Error',
            detail: data.statusMessage.toString()
          });
          break;
      }
    } else {
      this.msgSvc.add({
        key: 'saveError',
        sticky: false,
        severity: 'error',
        summary: 'Error',
        detail: 'Error Occurred'
      });
    }
  }
  // #endregion

  // #region [Clear Controls]
  /**
   * Clears controls
   */
  clearControls() {
    this.criteriaName = '';
    this.selectedFolder = null;
    this.lstStrategies = [];
    this.lstStrategiesCopy = [];
    this.selectedDomicileType = '0';
    this.saveLabelText = 'Save';
    this.dataSvc.clearScreeningCriteria();
  }
  // #endregion

  // #region [Page Edit]
  /**
   * Pages edit - Loads the Page in Edit Mode
   * @param criteriaId Edited Criteria Id
   */
  pageEdit(criteriaId: any) {
    this.screeningSvc.getExistingCriteriaDetails(criteriaId).subscribe(
      (data) => {
        data = data.filter((f) => f.criteriaDesc !== 'Display Columns');
        for (let i = 0; i < data.length; i++) {
          this.selectedDomicileType = data[i].domicile;
          this.editSaveFolder = data[i].folder;
          this.editCriteriaName = data[i].criteriaName;
          this.selectedFolder = data[i].folder.toString();
          this.criteriaName = data[i].criteriaName;
          this.lstStrategies.push({
            strategyId: i + 1,
            strategy: data[i].criteriaDesc,
            strategyValue: data[i].criteriaInfo,
          });
        }
      }
    );
  }
  // #endregion

  // #region [GetQueryDetails]
  /**
   * Gets query details - Gets data for the corresponding criteria
   * @param path Navigate to Path
   * @param mode Page Mode View/Edit
   * @param btnFrom Buttons (Alpha,Portfolio,View etc)
   */
  getQueryDetails(path: any, mode: string, btnFrom: string) {
    this.showSpinner = true;
    this.subGetScreeningItems = this.screeningSvc.getQueryDetails(this.queryData).subscribe(
      (data) => {
        if (data && data !== null) {
          this.screeningReportData = data;
          if (this.screeningReportData.details && this.screeningReportData.details !== null &&
            this.screeningReportData.details.length > 0) {
            if (this.screeningReportData.columns[0].header === 'companyid') {
              this.companyIds = Array.prototype.map.call(this.screeningReportData.details, s => s.companyid).toString();
            } else if (this.screeningReportData.columns[0].header === 'CompanyID') {
              this.companyIds = Array.prototype.map.call(this.screeningReportData.details, s => s.companyID).toString();
            }
            if (btnFrom === 'Portfolio') {
              this.subGetTickerCompanies = this.commonSvc.getTickerCompanies('', this.companyIds).subscribe(
                (data1) => {
                  this.tickerCompanyIds = data1;
                  this.selectedTickers = this.tickerCompanyIds.tickers;
                  this.lstTickers = [];
                  for (let i = 0; i < this.selectedTickers.split(',').length; i++) {
                    this.lstTickers.push({
                      tickerid: i + 1,
                      ticker: this.selectedTickers.split(',')[i]
                    });
                  }
                  sessionStorage.setItem(this.envKey.toString() + 'tickers', JSON.stringify(this.lstTickers));
                  this.navigateByRoute(path, mode);
                });
            } else if (btnFrom === 'Run') {
              this.companiesCount = this.screeningReportData.details.length;
              this.displayStocksPassed = true;
              this.compPassed = true;
            } else {
              this.subGetTickerCompanies = this.commonSvc.getTickerCompanies('', this.companyIds).subscribe(
                (data1) => {
                  this.tickerCompanyIds = data1;
                  this.selectedTickers = this.tickerCompanyIds.tickers;
                  this.lstTickers = [];
                  for (let i = 0; i < this.selectedTickers.split(',').length; i++) {
                    this.lstTickers.push({
                      tickerid: i + 1,
                      ticker: this.selectedTickers.split(',')[i]
                    });
                  }
                  sessionStorage.setItem(this.envKey.toString() + 'screeningCompanyIds', this.companyIds);
                  sessionStorage.setItem(this.envKey.toString() + 'tickers', JSON.stringify(this.lstTickers));
                  console.log(path);
                  this.navigateByRoute(path, mode);
                });
            }
          }
        }
        this.showSpinner = false;
      }
    );
  }
  // #endregion

  // #endregion
}
