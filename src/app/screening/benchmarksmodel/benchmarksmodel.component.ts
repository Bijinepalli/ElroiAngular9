// #region [Imports]
import { Component, OnInit, EventEmitter, Output, OnDestroy, } from '@angular/core';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { PortfolioanalysisService } from 'src/app/_services/portfolioanalysis/portfolioanalysis.service';
import { DataService } from 'src/app/_services/data/data.service';
import { DatePipe } from '@angular/common';
import { ModelReturn } from 'src/app/_models/commoncore';
import { OverlayPanel } from 'primeng/primeng';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-benchmarksmodel',
  templateUrl: './benchmarksmodel.component.html',
  styleUrls: ['./benchmarksmodel.component.css']
})
// #endregion

export class BenchmarksmodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [ListProperties]
  lstBenchmarkGroup: SelectItemGroup[];
  lstItem: SelectItem[];
  // #endregion

  // #region [GeneralProperties]
  selectedBenchmark: string;
  selectedItem: string;
  // #endregion

  // #region [DateProperties]
  selectedDate: Date;
  invalidDates: Array<Date>;
  maxDate: Date;
  // #endregion

  // #region [SubscriptionProperties]
  subGetBenchmarks: any;
  // #endregion

  // #region [ModelProperties]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  modelReturn: ModelReturn;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private dataSvc: DataService,
    private portfolioSvc: PortfolioanalysisService,
    private datePipe: DatePipe,
  ) { }
  // #endregion

  // #region [Page Events]

  // #region [ngOnInit]
  /**
   * on init-on page initialization
   */
  ngOnInit() {
    this.getBenchmarks();
    this.initializations();
  }
  // #endregion

  // #region [ngOnDestroy]
  /**
   * on destroy-clears all the subscriptions,properties
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
    this.subGetBenchmarks ? this.subGetBenchmarks.unsubscribe() : this.clear();
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
    this.lstItem = [];
    this.invalidDates = [];
    this.lstBenchmarkGroup = [];
    this.selectedBenchmark = '';
    this.selectedItem = '';
    this.selectedDate = null;
  }
  // #endregion

  // #region [Initializations]
  /**
   * Initializations
   */
  initializations() {
    this.clearAllProperties();
    this.maxDate = new Date();
    this.invalidDates = this.dataSvc.lstInvalidDates;
    this.lstItem = [
      { label: 'PECurrent', value: 'PECurrent' },
      { label: 'PEFY1', value: 'PEFY1' },
      { label: 'PEFY2', value: 'PEFY2' },
      { label: 'LTGrowthRate', value: 'LTGrowthRate' },
      { label: 'DividendYield', value: 'DividendYield' },
      { label: 'PEDecile', value: 'PEDecile' },
      { label: 'Curmom', value: 'Curmom' },
      { label: 'NxtMom', value: 'NxtMom' },
      { label: 'MarketCap', value: 'MarketCap' },
      { label: 'ROE', value: 'ROE' },
      { label: 'RiskFreeRate', value: 'RiskFreeRate' },
      { label: 'CurrentPrice', value: 'CurrentPrice' },
      { label: 'ExpectedReturn', value: 'ExpectedReturn' },
    ];
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [btnSubmit_Click]
  /**
   * Submit-Build and Submit the Description and Value of selected criteria to Construct Screen
   * @param event overlaypanel properties
   * @param opError show overlaypanel for validation
   */
  btnSubmit_Click(event: any, opError: OverlayPanel) {
    this.modelReturn = new ModelReturn();
    if (this.selectedBenchmark !== '') {
      const dateConvert = ((this.selectedDate !== undefined && this.selectedDate !== null && this.selectedDate.toString() !== '') ?
        (this.datePipe.transform(this.selectedDate, 'M/d/yyyy')) : 0);
      this.modelReturn.description = '(BenchMark;' + this.selectedBenchmark + ';' + this.selectedItem + ';' + dateConvert + ')';
      this.modelReturn.value = '';
      this.modelReturn.mode = '';
      this.popUpSubmit.emit(this.modelReturn);
    } else {
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

  // #region [GetBenchmarks]
  /**
   * Get benchmarks list
   */
  getBenchmarks() {
    this.lstBenchmarkGroup = [];
    this.subGetBenchmarks = this.portfolioSvc.getBenchmarks().subscribe(
      (data) => {
        if (data !== undefined && data !== null && data.length > 0) {
          const Group1 = data.filter(m => m.benchGroupId === 1).map((m, i) => {
            return {
              label: m.benchmark, value: m.benchmark
            };
          });
          const Group2 = data.filter(m => m.benchGroupId === 2).map((m, i) => {
            return {
              label: m.benchmark, value: m.benchmark
            };
          });
          this.lstBenchmarkGroup.push({
            label: '---S&P Indexes---', value: 1,
            items: Group1
          });
          this.lstBenchmarkGroup.push({
            label: '---Russell Indexes---', value: 2,
            items: Group2
          });
          this.selectedItem = this.lstItem[0].value;
        }
      }
    );
  }
  // #endregion

  // #endregion
}
