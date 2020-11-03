// #region [Imports]
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OverlayPanel } from 'primeng/primeng';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleNames, ModelReturn } from 'src/app/_models/commoncore';
import { Items } from 'src/app/_models/alphas';
import { ScreeningService } from 'src/app/_services/screening/screening.service';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-middlemodel',
  templateUrl: './middlemodel.component.html',
  styleUrls: ['./middlemodel.component.css']
})
// #endregion

export class MiddlemodelComponent implements OnInit {

  // #region [Properties]

  // #region [CommonPageProperties]
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string;
  selectedCriteria: string;
  modelReturn: ModelReturn;
  txtStartNumber: string;
  txtEndNumber: string;
  errorMessages: string;
  // #endregion

  // #region [List Properties]
  lstItems: Items[];
  selectedItem: Items;
  lstCategories: Items[];
  selectedCategory: Items;
  lstMasterItems: Items[];
  // #endregion

  // #region [SubscriptionProperties]
  subCategoryItemsList: any;
  // #endregion

  // #region [Input/Output Data]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  @Input() selectedMiddle: string;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private dataSvc: DataService,
    private screeningSvc: ScreeningService, // Service of the corresponding Module
  ) { }
  // #endregion

  // #region [Page Events]

  // #region [ngOnInit]
  /**
   * on init-on page initialization
   */
  ngOnInit() {
    this.dataSvc.changeModule(ModuleNames.Screening); // ModuleName of the corresponding Module
    this.dataSvc.startModule();
    this.initializations();
  }
  // #endregion

  // #region [ClearAllProperties]
  /**
   * Clears all properties
   */
  clearAllProperties() {
    this.txtStartNumber = '';
    this.txtEndNumber = '';
    this.selectedCriteria = '';
  }
  // #endregion

  // #region [initializations]
  /**
   * Initializations
   */
  initializations() {
    this.clearAllProperties();
    this.userId = sessionStorage.getItem(this.envKey.toString() + 'userId');
    this.getCategories();
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [lstCategory_Change]
  /**
   * Category change-load Items on selected category
   * @param category null
   */
  lstCategory_Change(category) {
    this.lstItems = [];
    this.selectedItem = null;
    if (category !== null) {
      this.selectedCategory = category.value;
    } else {
      if (this.lstCategories && this.lstCategories !== null && this.lstCategories.length > 0) {
        this.selectedCategory = this.lstCategories[0];
      }
    }
    this.lstItems = this.lstMasterItems.filter(P => P.categoryId === this.selectedCategory.value);
    this.selectedItem = this.lstItems[0];
  }
  // #endregion

  // #region [btnSubmit_Click]
  /**
   * Submit-Build and Submit the Description and Value of selected criteria to Construct Screen
   * @param event overlaypanel properties
   * @param opError overlaypanel for validation
   */
  btnSubmit_Click(event: any, opError: OverlayPanel) {
    this.modelReturn = new ModelReturn();
    if (this.txtStartNumber) {
      if (this.txtEndNumber) {
        if (this.selectedCriteria !== '') {
          this.modelReturn.description = '[MIDDLE ' + this.txtStartNumber + ';' + this.txtEndNumber + ']' +
            '[' + this.selectedCriteria + ']';
          this.modelReturn.value = 'order by (' + this.selectedItem.databaseValue + ') desc$$$MIDDLE ' + this.txtStartNumber + ';' +
            this.txtEndNumber + ',' + this.selectedItem.databaseValue + ' as \'' + this.selectedCriteria + '\'';
          this.modelReturn.mode = '';
          this.popUpSubmit.emit(this.modelReturn);
        } else {
          this.errorMessages = 'Please Add Item';
          opError.show(event);
        }
      } else {
        this.errorMessages = 'Enter second value';
        opError.show(event);
      }
    } else {
      this.errorMessages = 'Enter first value';
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

  // #region [btnAddCriteria_Click]
  /**
   * Add criteria-add Selected Item to Criteria Text
   * @param event overlaypanel properties
   * @param opError overlaypanel for validation
   */
  btnAddCriteria_Click(event: any, opError: OverlayPanel) {
    if (this.selectedCategory.label !== 'Financial Ratios' && this.selectedCategory.label !== 'Financial Statement') {
      this.selectedCriteria = this.selectedItem.label;
    } else {
      this.errorMessages = 'Not A Valid Data Item';
      opError.show(event);
    }
  }
  // #endregion

  // #endregion

  // #region [Supporting Methods]

  // #region [GetCategories]
  /**
   * Get categories list
   */
  getCategories() {
    this.subCategoryItemsList = this.screeningSvc.getScreeningCategoryItemsList(this.userId).subscribe(
      (data) => {
        this.buildItemValues(data);
        if (this.selectedMiddle != null) {
          this.editMode(this.selectedMiddle);
        }
      }
    );
  }
  // #endregion

  // #region [BuildItemValues]
  /**
   * Build item values-filter Categories list from Master Categories List
   * @param data categories list
   */
  buildItemValues(data) {
    if (data && data !== null && data.length > 0) {
      if (data[0] && data[0] !== null && data[0].length > 0) {
        this.lstCategories = data[0];
        this.lstCategories.push({ label: 'My DataItems', value: '999' });
      }
    }
    if (data[1] && data[1] !== null && data[1].length > 0) {
      this.lstMasterItems = data[1];
    }
    this.lstCategory_Change(null);
  }
  // #endregion

  // #region [EditMode]
  /**
   * Edit mode
   * @param strText Description string from Construct Screen to edit
   */
  editMode(strText: string) {
    const strSeries = strText.split('][')[0];
    const strVal = strText.split('][')[1];
    const num = strSeries.split(' ')[1];
    this.txtStartNumber = num.split(';')[0];
    this.txtEndNumber = num.split(';')[1];
    this.selectedCriteria = strVal.substring(0, (strVal.length - 1));
  }
  // #endregion

  // #endregion
}
