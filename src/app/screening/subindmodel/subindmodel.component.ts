// #region [Imports]
import { Component, OnInit, EventEmitter, Output, OnDestroy, } from '@angular/core';
import { SelectItem, Message } from 'primeng/api';
import { ExportService } from 'src/app/_services/export/export.service';
import { DataService } from 'src/app/_services/data/data.service';
import { ModelReturn } from 'src/app/_models/commoncore';
import { OverlayPanel } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-subindmodel',
  templateUrl: './subindmodel.component.html',
  styleUrls: ['./subindmodel.component.css']
})
// #endregion

export class SubindmodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [ListProperties]
  lstType: SelectItem[];
  lstItem: SelectItem[];
  // #endregion

  // #region [GeneralProperties]
  errMsgs: Message[] = [];
  selectedType: string;
  selectedItem: string;
  // #endregion

  // #region [DateProperties]
  selectedDate: Date;
  invalidDates: Array<Date>;
  maximumDate: any;
  maxDate: Date;
  // #endregion

  // #region [SubscriptionProperties]
  subGetMaxDate: any;
  // #endregion

  // #region [Input/Output Properties]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  modelReturn: ModelReturn;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private dataSvc: DataService,
    public exportSvc: ExportService,
    private datePipe: DatePipe,
  ) { }
  // #endregion

  // #region [Page Events]

  // #region [ngOnInit]
  /**
   * on init - On page initilization
   */
  ngOnInit() {
    this.initializations();
  }
  // #endregion

  // #region [ngOnDestroy]
  /**
   * on destroy - clears all subscriptions and properties
   */
  ngOnDestroy() {
    this.clearSubScriptions();
    this.clearAllProperties();
  }
  // #endregion

  // #region [ClearSubscriptions]
  /**
   * Clears sub scriptions
   */
  clearSubScriptions() {
    this.subGetMaxDate ? this.subGetMaxDate.unsubscribe() : this.clear();
  }
  clear() {
  }
  // #endregion

  // #region [ClearAllProperties]
  /**
   * Clears all properties
   */
  clearAllProperties() {
    this.lstType = [];
    this.lstItem = [];
    this.invalidDates = [];
    this.errMsgs = [];
    this.selectedItem = '';
    this.selectedType = '';
    this.selectedDate = null;
  }
  // #endregion

  // #region [Initializations]
  /**
   * Initializations subindmodel component
   */
  initializations() {
    this.clearAllProperties();
    this.maxDate = new Date();
    this.invalidDates = this.dataSvc.lstInvalidDates;

    this.lstType = [
      { label: 'Industry', value: 'Industry' },
      { label: 'Subindustry', value: 'Subindustry' },
    ];
    this.selectedType = this.lstType[0].value;

    this.lstItem = [
      { label: 'Latest12MPE', value: 'Latest12MPE' },
      { label: 'CurrentFY1PE', value: 'CurrentFY1PE' },
      { label: 'CurrentFY2PE', value: 'CurrentFY2PE' },
      { label: 'LTGrowthRate', value: 'LTGrowthRate' },
      { label: 'PriceToBook', value: 'PriceToBook' },
      { label: 'PreTaxROA', value: 'PreTaxROA' },
      { label: 'PreTaxROE', value: 'PreTaxROE' },
      { label: 'PretaxMargin', value: 'PretaxMargin' },
      { label: 'GrossMargin', value: 'GrossMargin' },
      { label: 'PriceChg1Wk', value: 'PriceChg1Wk' },
      { label: 'PriceChg1Mth', value: 'PriceChg1Mth' },
      { label: 'PriceChg3Mth', value: 'PriceChg3Mth' },
      { label: 'PriceChgYTD', value: 'PriceChgYTD' },
      { label: 'PriceChgYY', value: 'PriceChgYY' },
      { label: 'TurnOver', value: 'TurnOver' },
      { label: 'Leverage', value: 'Leverage' },
      { label: 'ReInvestmentRate', value: 'ReInvestmentRate' },
      { label: 'Sales', value: 'Sales' },
      { label: 'QQSalesChg', value: 'QQSalesChg' },
      { label: 'GrossMarginChg', value: 'GrossMarginChg' },
      { label: 'PreTaxIncome', value: 'PreTaxIncome' },
      { label: 'PullThru', value: 'PullThru' },
      { label: 'RetentionRate', value: 'RetentionRate' },
    ];
    this.selectedItem = this.lstItem[0].value;
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [btnSubmit_Click]
  /**
   * Btns submit click - Build and Submit the Description and Value of selected criteria to Construct Screen
   * @param event overlaypanel properties
   * @param opError ovelaypanel for validation
   */
  btnSubmit_Click(event: any, opError: OverlayPanel) {
    this.modelReturn = new ModelReturn();
    if (this.selectedType !== '') {
      const dateConvert = ((this.selectedDate !== null && this.selectedDate.toString() !== '') ?
        (this.datePipe.transform(this.selectedDate, 'M/d/yyyy')) : 0);
      this.modelReturn.description = '(' + this.selectedType + ';' + this.selectedItem + ';' + dateConvert + ')';
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
   * Btns close click - Closes Modal
   */
  btnClose_Click() {
    this.popUpClose.emit('close');
  }
  // #endregion

  // #endregion

  // #region [Supporting Methods]

  // #endregion
}
