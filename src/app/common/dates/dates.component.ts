/* #region  [Imports] */
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/_services/data/data.service';
import { SelectItem } from 'primeng/api';
/* #endregion */

/* #region  [ComponentDecorator] */
@Component({
  selector: 'app-dates',
  templateUrl: './dates.component.html',
  styleUrls: ['./dates.component.css']
})
/* #endregion */

export class DatesComponent implements OnInit, OnDestroy {

  /* #region  [CommonPageProperties] */
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string;
  showSpinner = false;
  displayDateFormat: string;
  isSecure = false;
  subQueryParamSubscribe: any;
  /* #endregion */

  /* #region  [ListProperties] */
  lstDates: SelectItem[];
  lstOperators: SelectItem[];
  lstInvalidDates: Array<Date>;
  selectedOperator: string;
  selectedOperatorText: number;
  /* #endregion */

  /* #region  [PageProperties] */
  returnVal: string;
  /* #endregion */

  /* #region  [Input Properties] */
  selectedDateType: any;
  maxDate: Date;
  selectedAbsoluteDate: Date;
  /* #endregion */

  /* #region  [InputOutputProperties] */
  @Input() valRequired: string;
  @Output() dialogOkEvent = new EventEmitter();
  @Output() dialogCancelEvent = new EventEmitter();
  /* #endregion */

  /* #region  [Constructor] */
  constructor(
    private activeRoute: ActivatedRoute,
    private dataSvc: DataService,
    private datePipe: DatePipe
  ) { }
  /* #endregion */

  /* #region  [ngOnInit] */
  ngOnInit() {
    this.showSpinner = true;
    this.isSecure = false;
    // this.dataSvc.changeModule(ModuleNames.Alphas); // ModuleName of the corresponding Module
    // this.dataSvc.startModule();
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

  }
  /* #endregion */

  /* #region  [Initializations] */
  initializations() {
    this.selectedOperator = 'D';
    this.lstDates = [
      { label: 'Absolute Dates', value: '1' },
      { label: 'Relative Dates', value: '2' }
    ];

    this.lstOperators = [
      { label: 'D', value: 'D' },
      { label: 'M', value: 'M' },
      { label: 'Y', value: 'Y' }
    ];
    this.showSpinner = false;
  }
  /* #endregion */

  /* #region  [Dates Click] */
  datesClick(event: any) {
    this.selectedDateType = event.option.value;
    if (this.selectedDateType === '1') {
      this.maxDate = new Date();
      this.lstInvalidDates = this.dataSvc.lstInvalidDates;
    }
  }
  /* #endregion */

  /* #region  [Ok Click] */
  okClick() {
    if (this.selectedDateType === undefined) {
      alert('Please select absolute or reletive dates');
      return;
    }
    if (this.selectedDateType === '1' && (this.selectedAbsoluteDate === undefined || this.selectedAbsoluteDate === null)) {
      alert('Please select date');
      return;
    }
    if (this.selectedDateType === '2' && (this.selectedOperatorText === undefined || this.selectedOperatorText.toString() === '' ||
      this.selectedOperatorText.toString() === '0')) {
      alert('Please enter the Value in this Field');
      return;
    }
    if (this.selectedDateType === '1') {
      this.returnVal = this.datePipe.transform(this.selectedAbsoluteDate, 'MM/dd/yyyy');
    } else if (this.selectedDateType === '2') {
      this.returnVal = this.selectedOperatorText + this.selectedOperator;
      if (this.valRequired === 'yearValidation') {
        if (this.selectedOperator === 'Y' && this.selectedOperatorText > 1) {
          alert('valid value is 1');
          return false;
        }
      }
    }
    this.dialogOkEvent.emit(this.returnVal);
  }
  /* #endregion */

  /* #region  [Cancel Click] */
  cancelClick() {
    this.dialogCancelEvent.emit(false);
  }
  /* #endregion */


}
