// #region [Imports]
import { Component, OnInit, EventEmitter, Output, Input, ViewChild, OnDestroy } from '@angular/core';
import { OverlayPanel } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { ModelReturn } from 'src/app/_models/commoncore';
import { Rating } from 'src/app/_models/screening';
import { RoleaccessrightsService } from 'src/app/_services/roleaccessrights/roleaccessrights.service';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-shorttermratingmodel',
  templateUrl: './shorttermratingmodel.component.html',
  styleUrls: ['./shorttermratingmodel.component.css']
})
// #endregion

export class ShorttermratingmodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [Input/Output Data]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  @Input() item: string;
  @Input() selectedSTR: string;
  // #endregion

  // #region [ViewChildProperties]
  @ViewChild('dt') pTableRef: Table;
  // #endregion

  // #region [CommonPageProperties]
  modelReturn: ModelReturn;
  // #endregion

  // #region [ListProperties]
  lstStaticRatings: Rating[];
  lstRatings: Rating[];
  selectedRating: Rating[];
  heading: string;
  // #endregion

  // #region [SubscriptionProperties]
  subGetIndexIndicators: any;
  subGetStaticRatings: any;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private accessRightsSvc: RoleaccessrightsService, // Service of the corresponding Module
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

  // #region [clearTableProperties]
  /**
   * Clears table properties
   */
  clearTableProperties() {
    if (this.pTableRef) {
      this.pTableRef.reset();
    }
    this.lstRatings = [];
    this.selectedRating = [];
  }
  // #endregion

  // #region [ngOnDestroy]
  /**
   * on destroy-clears all the Subscriprions and Properties
   */
  ngOnDestroy() {
    this.clearSubscriptions();
    this.clearAllProperties();
  }
  // #endregion

  // #region [ClearSubscriptions]
  /**
   * Clears subscriptions
   */
  clearSubscriptions() {
    this.subGetIndexIndicators ? this.subGetIndexIndicators.unsubscribe() : this.clear();
  }
  clear() {
  }
  // #endregion

  // #region [ClearAllProperties]
  /**
   * Clears all properties
   */
  clearAllProperties() {
    this.lstRatings = [];
    this.lstStaticRatings = [];
  }
  // #endregion

  // #region [initializations]
  /**
   * Initializations
   */
  initializations() {
    this.clearAllProperties();
    this.getBenchmarks();
    this.getStaticRatings();
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
    this.modelReturn = new ModelReturn();
    let DisplayQuery = '';
    let sqlQuery = '';
    let equal = '';
    let notEqual = '';
    if (this.selectedRating && this.selectedRating.length > 0) {
      sqlQuery += '(';
      for (const rating of this.selectedRating) {
        DisplayQuery += '[' + this.selectedRating[0].modeDisplay + ']';
        DisplayQuery += rating.isEqual ? '=' : '!=';
        DisplayQuery += rating.ratingDisplayValue.replace(/2/g, ' ');
        DisplayQuery += '[OR]';
        equal += rating.isEqual ? rating.ratingDatabaseValue + ',' : '';
        notEqual += rating.isEqual ? '' : rating.ratingDatabaseValue + ',';
        sqlQuery += rating.module;
        sqlQuery += rating.isEqual ? '= ' : '!= ';
        sqlQuery += '\'' + rating.ratingDatabaseValue.replace(/2/g, ' ') + '\'' + ' or ';
      }
      sqlQuery = sqlQuery.substring(0, (sqlQuery.length - 4));
      sqlQuery += ')$$$ ';
      sqlQuery += this.selectedRating[0].module;
      sqlQuery += ' as ' + '\'' + this.selectedRating[0].modeDisplay + '\'';
      DisplayQuery = DisplayQuery.substring(0, (DisplayQuery.length - 4));
      this.modelReturn.description = DisplayQuery;
      this.modelReturn.value = sqlQuery;
      this.modelReturn.mode = 'Add';
      this.popUpSubmit.emit(this.modelReturn);
    } else {
      opError.show(event);
    }
  }
  // #endregion

  // #region [btnClose_Click]
  /**
   * Btns close click - closes modal
   */
  btnClose_Click() {
    this.popUpClose.emit('close');
  }
  // #endregion

  // #endregion

  // #region [Supporting Methods]

  // #region [getStaticRatings]
  /**
   * Gets static ratings list
   */
  getStaticRatings() {
    this.subGetStaticRatings = this.accessRightsSvc.getStaticRatings(this.item).subscribe(
      (data) => {
        this.clearTableProperties();
        this.buildTableData(data);
        if (this.selectedSTR != null && this.selectedSTR !== '') {
          this.editMode(this.selectedSTR);
        }
      }
    );
  }
  // #endregion

  // #region [BuildTableData]
  /**
   * Builds table data
   * @param data ratings list
   */
  buildTableData(data: Rating[]) {
    if (data !== undefined && data !== null && data.length > 0) {
      this.lstRatings = data;
    }
    if (this.lstRatings.length > 0) {
      this.heading = this.lstRatings[0].modeDisplay;
    }
  }
  // #endregion

  // #region [GetBenchmarks]
  /**
   * Get benchmarks list
   */
  getBenchmarks() {
    const indexIn = new Rating();
  }
  // #endregion

  // #region [EditMode]
  /**
   * Edit mode
   * @param InputString Description string from Construct Screen to edit
   */
  editMode(InputString: string) {
    this.selectedRating = [];
    const AndSplitData = InputString.split('[OR]');
    for (const splitData of AndSplitData) {
      const str = '[' + this.heading + ']';
      if (splitData.indexOf(str) !== -1) {
        const fData = this.lstRatings.filter((m) => m.ratingDisplayValue === splitData.split('=')[1]);
        if (fData && fData != null && fData.length > 0) {
          this.selectedRating.push(fData[0]);
          const index = this.lstRatings.findIndex((m) => m.ratingDisplayValue === splitData.split('=')[1]);
          if (splitData.split('=')[0].indexOf('!') !== -1) {
            this.lstRatings[index].isEqual = false;
          }
        }
      }
    }
  }
  // #endregion

  // #endregion
}
