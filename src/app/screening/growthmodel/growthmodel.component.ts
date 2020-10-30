// #region [Imports]
import { Component, OnInit, EventEmitter, Output, OnDestroy, } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ExportService } from 'src/app/_services/export/export.service';
import { DataService } from 'src/app/_services/data/data.service';
import { ModelReturn } from 'src/app/_models/commoncore';
import { DatePipe } from '@angular/common';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-growthmodel',
  templateUrl: './growthmodel.component.html',
  styleUrls: ['./growthmodel.component.css']
})
// #endregion

export class GrowthmodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [Input/Output Data]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  // #endregion

  // #region [ListProperties]
  lstType: SelectItem[];
  lstItem: SelectItem[];
  // #endregion

  // #region [GeneralProperties]
  selectedType: string;
  selectedItem: string;
  modelReturn: ModelReturn;
  // #endregion

  // #region [DateProperties]
  selectedDate: Date;
  invalidDates: Array<Date>;
  maxDate: Date;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private dataSvc: DataService,
    public exportSvc: ExportService,
    private datePipe: DatePipe
  ) { }
  // #endregion

  // #region [Page Events]

  // #region  [ngOnInit]
  /**
   * on init-on page initialization
   */
  ngOnInit() {
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
   * Clear subscriptions-clear all service subscriptions
   */
  clearSubscriptions() {

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
    this.lstType = [];
    this.lstItem = [];
    this.invalidDates = [];
    this.selectedItem = '';
    this.selectedType = 'One Year';
    this.selectedDate = null;
    this.modelReturn = new ModelReturn();
  }
  // #endregion

  // #region  [Initializations]
  /**
   * Initializations
   */
  initializations() {
    this.clearAllProperties();
    this.maxDate = new Date();
    this.invalidDates = this.dataSvc.lstInvalidDates;

    this.lstType = [
      { label: 'One Year', value: 'One Year' },
      { label: 'Three Year', value: 'Three Year' },
      { label: 'Five Year', value: 'Five Year' },
    ];

    this.lstItem = [
      { label: 'Current Qtr EPS Q/Q %Chg', value: 'Current Qtr EPS Q/Q %Chg' },
      { label: 'Next Qtr EPS Q/Q %Chg', value: 'Next Qtr EPS Q/Q %Chg' },
      { label: 'Next 2 Q/Q % Chg EPS', value: 'Next 2 Q/Q % Chg EPS' },
      { label: 'Latest Qtr EPS Q/Q %Chg', value: 'Latest Qtr EPS Q/Q %Chg' },
      { label: 'Latest 12M EPS %Chg', value: 'Latest 12M EPS %Chg' },
      { label: 'Long Term Growth Rate', value: 'Long Term Growth Rate' },
      { label: 'Sales %Chg Q/Q', value: 'Sales %Chg Q/Q' },
      { label: 'Sales-Latest 12M', value: 'Sales-Latest 12M' },
      { label: '12M Book Value % Chg', value: '12M Book Value % Chg' },
      { label: '5yr Book Val Growth', value: '5yr Book Val Growth' },
      { label: 'Gross Margin %CHG 12M/12M', value: 'Gross Margin %CHG 12M/12M' },
      { label: 'FY1 EPS % Change', value: 'FY1 EPS % Change' },
      { label: 'FY2 EPS % Change', value: 'FY2 EPS % Change' },
      { label: 'CurEpsErs', value: 'CurEpsErs' },
      { label: 'NxtEpsErs', value: 'NxtEpsErs' },
      { label: 'Nx2EpsErs', value: 'Nx2EpsErs' },
      { label: 'FY1EpsErs', value: 'FY1EpsErs' },
      { label: 'Fy2EpsErs', value: 'Fy2EpsErs' },
      { label: 'CurEpsErsScore', value: 'CurEpsErsScore' },
      { label: 'NxtEpsErsScore', value: 'NxtEpsErsScore' },
      { label: 'Nx2EpsErsScore', value: 'Nx2EpsErsScore' },
      { label: 'FY1EpsErsScore', value: 'FY1EpsErsScore' },
      { label: 'FY2EpsErsScore', value: 'FY2EpsErsScore' },
      { label: 'CompositeErsScore', value: 'CompositeErsScore' },
      { label: '5YrEPSGrowth', value: '5YrEPSGrowth' },
      { label: '5YrFCFGrowth', value: '5YrFCFGrowth' },
    ];
    this.selectedType = 'One Year';
    this.selectedItem = 'Current Qtr EPS Q/Q %Chg';
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
    if (this.selectedDate === null) {
      alert('Select Date');
      return false;
    }
    this.modelReturn = new ModelReturn();
    this.modelReturn.description = '(' + this.selectedType + ';' + this.selectedItem + ';' +
      this.datePipe.transform(this.selectedDate, 'M/d/yyyy') + ')';
    this.modelReturn.value = '(' + this.selectedType + ';' + this.selectedItem + ';' +
      this.datePipe.transform(this.selectedDate, 'M/d/yyyy') + ')';
    this.modelReturn.mode = 'Add';
    this.popUpSubmit.emit(this.modelReturn);
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

  // #endregion
}
