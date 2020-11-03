// #region [Imports]
import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { ExportService } from 'src/app/_services/export/export.service';
import { IndexIndicator } from 'src/app/_models/screening';
import { ScreeningService } from 'src/app/_services/screening/screening.service';
import { ModelReturn } from 'src/app/_models/commoncore';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-indexindicatormodel',
  templateUrl: './indexindicatormodel.component.html',
  styleUrls: ['./indexindicatormodel.component.css']
})
// #endregion

export class IndexindicatormodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [Input/Output Data]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  @Input() selectedIndexIndicators: string;
  modelReturn: ModelReturn;
  // #endregion

  // #region [ListProperties]
  lstSpBenchmark: IndexIndicator[];
  lstRusselBenchmark: IndexIndicator[];
  selectedRusselBenchmark: IndexIndicator[];
  selectedSpBenchmark: IndexIndicator[];
  // #endregion

  // #region [SubscriptionProperties]
  subGetIndexIndicators: any;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private screeningSvc: ScreeningService,
    public exportSvc: ExportService,
  ) { }
  // #endregion

  // #region [Page Events]

  // #region [ngOnInit]
  /**
   * on init-on page initialization
   */
  ngOnInit() {
    // this.getBenchmarks();
    this.initializations();
  }
  // #endregion

  // #region  [ngOnDestroy]
  /**
   * on destroy-Clears all the subscriptions and properties
   */
  ngOnDestroy() {
    this.clearSubscriptions();
    this.clearAllProperties();
  }
  // #endregion

  // #region  [ClearSubscriptions]
  /**
   * Clear subscriptions-clears all the service subscriptions
   */
  clearSubscriptions() {
    this.subGetIndexIndicators ? this.subGetIndexIndicators.unsubscribe() : this.clear();
  }
  /**
   * Clear
   */
  clear() {
  }
  // #endregion

  // #region  [ClearAllProperties]
  /**
   * Clears all properties
   */
  clearAllProperties() {
    this.lstSpBenchmark = [];
    this.modelReturn = new ModelReturn();
    this.lstRusselBenchmark = [];
  }
  // #endregion

  // #region  [initializations]
  /**
   * Initializations
   */
  initializations() {
    this.clearAllProperties();
    this.getBenchmarks();
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [btnSubmit_Click]
  /**
   * Submit-Build and Submit the Description and Value of selected criteria to Construct Screen
   * @returns ModelReturn Class
   */
  btnSubmit_Click() {
    this.modelReturn = new ModelReturn();
    let DisplayQuery = '';
    let sqlQuery = '';
    let equal = '';
    let notEqual = '';
    if (this.selectedSpBenchmark && this.selectedSpBenchmark.length > 0) {
      sqlQuery += '(';
      for (const spBenchmark of this.selectedSpBenchmark) {
        DisplayQuery += '[S&P Index Indicator]';
        DisplayQuery += spBenchmark.isEqual ? '=' : '!=';
        DisplayQuery += spBenchmark.benchMark;
        DisplayQuery += '[AND]';
        equal += spBenchmark.isEqual ? spBenchmark.benchmarkValue + ',' : '';
        notEqual += spBenchmark.isEqual ? '' : spBenchmark.benchmarkValue + ',';
      }
      sqlQuery += equal && equal.length > 0 ? 'SD.indexno in(' + equal.substring(0, equal.length - 1) + ')' : '';
      sqlQuery += equal && equal.length > 0 && notEqual && notEqual.length > 0 ?
        ' AND SD.indexno not in(' + notEqual.substring(0, notEqual.length - 1) + ')' :
        notEqual && notEqual.length > 0 ? 'SD.indexno not in (' + notEqual.substring(0, notEqual.length - 1) + ')' : '';
    }

    sqlQuery += this.selectedSpBenchmark && this.selectedSpBenchmark.length > 0 &&
      this.selectedRusselBenchmark && this.selectedRusselBenchmark.length > 0 ? ' OR ' : '';
    if (this.selectedRusselBenchmark && this.selectedRusselBenchmark.length > 0) {
      sqlQuery += this.selectedSpBenchmark && this.selectedSpBenchmark.length > 0 ? '' : '(';

      equal = '';
      notEqual = '';
      for (const resselBenchmark of this.selectedRusselBenchmark) {
        DisplayQuery += '[Russell Index Indicator]';
        DisplayQuery += resselBenchmark.isEqual ? '=' : '!=';
        DisplayQuery += resselBenchmark.benchMark;
        DisplayQuery += '[AND]';
        equal += resselBenchmark.isEqual ? resselBenchmark.benchmarkValue + ',' : '';
        notEqual += !resselBenchmark.isEqual ? resselBenchmark.benchmarkValue + ',' : '';
      }
      sqlQuery += equal && equal.length > 0 ? 'SD.RIndex in(' + equal.substring(0, equal.length - 1) + ')' : '';
      sqlQuery += equal && equal.length > 0 && notEqual && notEqual.length > 0 ?
        ' AND SD.RIndex not in(' + notEqual.substring(0, notEqual.length - 1) + ')' :
        notEqual && notEqual.length > 0 ? 'SD.RIndex not in (' + notEqual.substring(0, notEqual.length - 1) + ')' : '';
    }
    sqlQuery += ' )$$$ \'YES\' as \'Index Indicator\'';
    if (DisplayQuery === '') {
      alert('Please select Index Indicator');
      return;
    }
    DisplayQuery = DisplayQuery.substring(0, (DisplayQuery.length - 5));
    this.modelReturn.description = DisplayQuery;
    this.modelReturn.value = sqlQuery;
    this.modelReturn.mode = 'Add';
    this.popUpSubmit.emit(this.modelReturn);
  }
  // #endregion

  // #region [Close_Click]
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
    this.subGetIndexIndicators = this.screeningSvc.getIndexIndicators().subscribe(
      (data) => {
        if (data !== undefined && data !== null && data.length > 0) {
          this.lstSpBenchmark = data.filter(m => m.benchGroupId === 1);
          this.lstRusselBenchmark = data.filter(m => m.benchGroupId === 2);
          if (this.selectedIndexIndicators != null) {
            this.editMode(this.selectedIndexIndicators);
          }
        }
      }
    );
  }
  // #endregion

  // #region [editMode]
  /**
   * Edit mode
   * @param InputString Description string from Construct Screen to edit
   */
  editMode(InputString: string) {
    console.log(InputString);
    this.selectedSpBenchmark = [];
    this.selectedRusselBenchmark = [];
    const AndSplitData = InputString.split('[AND]');
    for (const splitData of AndSplitData) {
      if (splitData.indexOf('[S&P Index Indicator]') !== -1) {
        const fData = this.lstSpBenchmark.filter((m) => m.benchMark === splitData.split('=')[1]);
        if (fData != null) {
          this.selectedSpBenchmark.push({
            benchId: fData[0].benchId, benchMark: fData[0].benchMark,
            benchmarkValue: fData[0].benchmarkValue, benchGroupId: 1,
            isEqual: splitData.split('=')[0].indexOf('!') !== -1 ? false : true
          });
          const index = this.lstSpBenchmark.findIndex((m) => m.benchMark === splitData.split('=')[1]);
          if (splitData.split('=')[0].indexOf('!') !== -1) {
            this.lstSpBenchmark[index].isEqual = false;
          }
        }
      } else {
        const fData = this.lstRusselBenchmark.filter((m) => m.benchMark === splitData.split('=')[1]);
        if (fData != null) {
          this.selectedRusselBenchmark.push({
            benchId: fData[0].benchId, benchMark: fData[0].benchMark,
            benchmarkValue: fData[0].benchmarkValue, benchGroupId: 2,
            isEqual: splitData.split('=')[0].indexOf('!') !== -1 ? false : true
          });
          const index = this.lstRusselBenchmark.findIndex((m) => m.benchMark === splitData.split('=')[1]);
          if (splitData.split('=')[0].indexOf('!') !== -1) {
            this.lstRusselBenchmark[index].isEqual = false;
          }
        }
      }
    }
  }
  // #endregion

  // #endregion
}
