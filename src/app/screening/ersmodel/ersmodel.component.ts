// #region [Imports]
import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ExportService } from 'src/app/_services/export/export.service';
import { ModelReturn } from 'src/app/_models/commoncore';
import { OverlayPanel } from 'primeng/primeng';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-ersmodel',
  templateUrl: './ersmodel.component.html',
  styleUrls: ['./ersmodel.component.css']
})
// #endregion

export class ErsmodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [Input/Output Data]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  @Input() title: string;
  @Input() selectedERS: string;
  // #endregion

  // #region [ListProperties]
  lstCompareFrom: SelectItem[];
  lstReasonType: SelectItem[];
  lstDisplayType: SelectItem[];
  lstSeries: SelectItem[];
  lstOperator: SelectItem[];
  // #endregion

  // #region [GeneralProperties]
  selectedCompareFrom: string;
  selectedReasonType: string;
  selectedDisplayType: string;
  selectedSeries: string;
  selectedOperator: string;
  txtStart: string;
  txtEnd: string;
  txtFormula: string;
  modelReturn: ModelReturn;
  errorMessages: string;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    public exportSvc: ExportService,
  ) { }
  // #endregion

  // #region [Page Events]

  // #region [ngOnInit]
  /**
   * on init-on page initialization
   */
  ngOnInit() {
    this.initializations();
  }
  // #endregion

  // #region [ngOnDestroy]
  /**
   * on destroy-clears all the subscriptions and properties
   */
  ngOnDestroy() {
    this.clearAllProperties();
  }
  // #endregion

  // #region [ClearAllProperties]
  /**
   * Clears all properties
   */
  clearAllProperties() {
    this.lstCompareFrom = [];
    this.lstDisplayType = [];
    this.lstReasonType = [];
    this.lstSeries = [];
    this.lstOperator = [];
    this.selectedCompareFrom = '';
    this.selectedDisplayType = '';
    this.selectedReasonType = '';
    this.selectedSeries = '';
    this.selectedOperator = '';
    this.txtEnd = '';
    this.txtStart = '';
    this.txtFormula = '';
    this.errorMessages = '';
  }
  // #endregion

  // #region [Initializations]
  /**
   * Initializations
   */
  initializations() {
    this.clearAllProperties();
    this.lstCompareFrom = [
      { label: 'Prior Day', value: 'Prior Day' },
      { label: 'Week Ago', value: 'Week Ago' },
      { label: '2 Weeks Ago', value: '2 Weeks Ago' },
      { label: '3 Weeks Ago', value: '3 Weeks Ago' },
      { label: 'Month Ago', value: 'Month Ago' },
    ];
    this.selectedCompareFrom = 'Prior Day';
    this.lstReasonType = [
      { label: 'Inactive', value: 'Inactive' },
      { label: 'Upgrade Or Downgrade', value: 'Upgrade Or Downgrade' },
      { label: 'Either', value: 'Either' },
    ];
    this.selectedReasonType = 'Inactive';
    this.lstDisplayType = [
      { label: 'Boolean', value: 'Boolean' },
      { label: 'Text', value: 'Text' },
    ];
    this.selectedDisplayType = 'Boolean';
    this.lstSeries = [
      { label: 'Top', value: '1' },
      { label: 'Bottom', value: '2' },
      { label: 'Middle', value: '3' },
      { label: 'Formula', value: '4' },
    ];
    this.selectedSeries = '';
    this.lstOperator = [
      { label: '>', value: '>' },
      { label: '<', value: '<' },
      { label: '=', value: '=' },
      { label: '!=', value: '!=' },
      { label: '>=', value: '>=' },
      { label: '<=', value: '<=' },
    ];
    this.selectedOperator = '>';
    if (this.selectedERS != null) {
      this.editMode(this.selectedERS);
    }
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [btnSubmit_Click]
  /**
   * Submit-Build and Submit the Description and Value of selected criteria to Construct Screen
   * @param event overlaypanel properties
   * @param opError overlaypanel for validation
   */
  btnSubmit_Click(event: any, opError: OverlayPanel) {
    this.errorMessages = '';
    this.modelReturn = new ModelReturn();
    if (this.title === 'ERS Reason Indicator') {
      this.modelReturn.description = '[ERS Reason Indicator;' + this.selectedCompareFrom + ';' +
        this.selectedReasonType + ';' + this.selectedDisplayType + ']';
      this.modelReturn.value = '(' + this.modelReturn.description + ')$$$ ' + this.modelReturn.description + ' as ' +
        '\'' + this.modelReturn.description + '\'';
      this.modelReturn.mode = '';
      this.popUpSubmit.emit(this.modelReturn);
    } else {
      let txt = '';

      switch (this.selectedSeries) {
        case '1':
        case '2':
          if (this.txtStart !== '') {
            txt = ((this.selectedSeries === '1') ? ('Top#' + this.txtStart) : ('Bottom#' + this.txtStart));
          } else {
            this.errorMessages = 'Please Supply The Values';
          }
          break;
        case '3':
          if (this.txtStart !== '' && this.txtEnd !== '') {
            txt = 'Middle#' + this.txtStart + '#' + this.txtEnd;
          } else {
            this.errorMessages = 'Please Supply The Values';
          }
          break;
        case '4':
          if (this.txtFormula !== '') {
            txt = 'Formula#' + this.selectedOperator + this.txtFormula;
          } else {
            this.errorMessages = 'Please Supply The Values';
          }
          break;
        default:
          break;
      }
      if (this.errorMessages === '') {
        this.modelReturn.description = '[ERS Reason Indicator^' + this.title
          + '^' + this.selectedReasonType
          + '^' + this.selectedDisplayType
          + ((txt !== '') ? '^' + txt : '') + ']';
        this.modelReturn.value = '(' + this.modelReturn.description + ')$$$ ' + this.modelReturn.description + ' as ' +
          '\'' + this.modelReturn.description + '\'';
        this.modelReturn.mode = '';
        this.popUpSubmit.emit(this.modelReturn);
      } else {
        opError.show(event);
      }
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

  // #region [EditMode]
  /**
   * Edits mode
   * @param strText Description string from Construct Screen to edit
   */
  editMode(strText: string) {
    if (strText.indexOf('^') > 0) {
      const strPeriod = strText.split('^');
      this.selectedReasonType = strPeriod[2];
      this.selectedDisplayType = strPeriod[3].replace(/\]/g, '');
    } else {
      const strERS = strText.split(';');
      this.selectedCompareFrom = strERS[1];
      this.selectedReasonType = strERS[2];
      this.selectedDisplayType = strERS[3].replace(/\]/g, '');
    }
  }
  // #endregion

  // #endregion
}
