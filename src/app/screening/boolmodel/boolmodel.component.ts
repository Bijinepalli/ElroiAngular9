// #region [Imports]
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OverlayPanel } from 'primeng/primeng';
import { SelectItem } from 'primeng/api';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleNames, ModelReturn } from 'src/app/_models/commoncore';
import { Items } from 'src/app/_models/alphas';
import { ExportService } from 'src/app/_services/export/export.service';
import { ScreeningService } from 'src/app/_services/screening/screening.service';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-boolmodel',
  templateUrl: './boolmodel.component.html',
  styleUrls: ['./boolmodel.component.css']
})
// #endregion

export class BoolmodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [CommonPageProperties]
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string;
  selectedCriteria: string;
  isEditMode: boolean;
  // #endregion

  // #region  [Input\Output Data]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  @Input() selectedBoolean: string;
  // #endregion

  // #region  [ListProperties]
  lstItemsISNA: Items[];
  selectedItemISNA: Items;
  lstItemsValue: Items[];
  selectedItemValue: Items;
  lstCategoriesISNA: Items[];
  selectedCategoryISNA: Items;
  lstCategoriesValue: Items[];
  selectedCategoryValue: Items;
  lstMasterItems: Items[];
  lstSeries: SelectItem[];
  lstSelectedItems: Items[] = [];
  // #endregion

  // #region  [GeneralProperties]
  txtValue: string;
  selectedSeries: string;
  modelReturn: ModelReturn;
  errorMessages: string;
  // #endregion

  // #region  [SubscriptionProperties]
  subCategoryItemsList: any;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private dataSvc: DataService,
    public exportSvc: ExportService,
    private screeningSvc: ScreeningService,
  ) { }
  // #endregion

  // #region [Page Events]

  // #region  [ngOnInit]
  /**
   * on init-on page initialization
   */
  ngOnInit() {
    this.dataSvc.changeModule(ModuleNames.Screening);
    this.dataSvc.startModule();
    this.initializations();
  }
  // #endregion

  // #region  [ngOnDestroy]
  /**
   * on destroy-clears all the subscriptions and properties
   */
  ngOnDestroy() {
    this.clearAllProperties();
  }
  // #endregion

  // #region  [ClearAllProperties]
  /**
   * Clears all properties
   */
  clearAllProperties() {
    this.txtValue = '';
    this.lstSeries = [];
    this.selectedCriteria = '';
  }
  // #endregion

  // #region  [Initializations]
  /**
   * Initializations
   */
  initializations() {
    this.clearAllProperties();
    this.txtValue = '0';
    this.isEditMode = false;
    this.lstSeries = [
      { label: 'ISNA', value: 'ISNA' },
      { label: 'Value', value: 'VALUE' },
    ];
    this.userId = sessionStorage.getItem(this.envKey.toString() + 'userId');
    this.getCategories();
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region  [btnSubmit_Click]
  /**
   * Submit-Build and Submit the Description and Value of selected criteria to Construct Screen
   * @param event overlaypanel properties
   * @param opError overlaypanel for validation
   */
  btnSubmit_Click(event: any, opError: OverlayPanel) {
    this.modelReturn = new ModelReturn();
    if (this.selectedSeries === 'ISNA') {
      if (this.selectedCategoryISNA.label !== 'Financial Ratios' && this.selectedCategoryISNA.label !== 'Financial Statement') {
        if (this.selectedCriteria !== '') {
          this.modelReturn.description = '[' + this.selectedSeries + '=' + this.txtValue + ']' + '[' + this.selectedCriteria + ']';
          this.modelReturn.value = 'order by (' + this.selectedItemISNA.databaseValue + ') desc$$$' + this.selectedSeries + '=' +
            this.txtValue + ',' + this.selectedItemISNA.databaseValue + ' as \'' + this.selectedCriteria + '\'';
          this.modelReturn.mode = '';
          this.popUpSubmit.emit(this.modelReturn);
        } else {
          this.errorMessages = 'Please Add Item';
          opError.show(event);
        }
      } else {
        this.errorMessages = 'Not A Valid Data Item';
        opError.show(event);
      }
    } else if (this.selectedSeries === 'VALUE') {
      if (this.selectedCategoryISNA.label !== 'Financial Ratios' && this.selectedCategoryISNA.label !== 'Financial Statement') {
        if (this.lstSelectedItems.length >= 2) {
          let desc = '';
          let orderval = '';
          let val = '';
          for (const selectedItem of this.lstSelectedItems) {
            desc += '[';
            desc += selectedItem.label;
            desc += ']';
            orderval = selectedItem.databaseValue;
            val += selectedItem.databaseValue;
            val += ' as \'';
            val += selectedItem.label + '\',';
          }
          this.modelReturn.description = '[' + this.selectedSeries + ']' + desc;
          this.modelReturn.value = 'order by ' + orderval + ' desc$$$VALUE,' + val.substring(0, (val.length - 1));
          this.modelReturn.mode = '';
          this.popUpSubmit.emit(this.modelReturn);
        } else {
          this.errorMessages = 'Please Add at least Two Parameters';
          opError.show(event);
        }
      } else {
        this.errorMessages = 'Not A Valid Data Item';
        opError.show(event);
      }
    }
  }
  // #endregion

  // #region  [lstCategoryISNA_Change]
  /**
   * Category change ISNA-load Items on selected category
   * @param category null
   */
  lstCategoryISNA_Change(category) {
    this.lstItemsISNA = [];
    this.selectedItemISNA = null;
    if (category !== null) {
      this.selectedCategoryISNA = category.value;
    } else {
      if (this.lstCategoriesISNA && this.lstCategoriesISNA !== null && this.lstCategoriesISNA.length > 0) {
        this.selectedCategoryISNA = this.lstCategoriesISNA[0];
      }
    }
    this.lstItemsISNA = this.lstMasterItems.filter(P => P.categoryId === this.selectedCategoryISNA.value);
    this.selectedItemISNA = this.lstItemsISNA[0];
  }
  // #endregion

  // #region  [lstCategoryValue_Change]
  /**
   * Category change Value-load Items on selected category
   * @param category null
   */
  lstCategoryValue_Change(category) {
    this.lstItemsValue = [];
    this.selectedItemValue = null;
    if (category !== null) {
      this.selectedCategoryValue = category.value;
    } else {
      if (this.lstCategoriesValue && this.lstCategoriesValue !== null && this.lstCategoriesValue.length > 0) {
        this.selectedCategoryValue = this.lstCategoriesValue[0];
      }
    }
    this.lstItemsValue = this.lstMasterItems.filter(P => P.categoryId === this.selectedCategoryValue.value);
    this.selectedItemValue = this.lstItemsValue[0];
  }
  // #endregion

  // #region  [btnClose_Click]
  /**
   * Closes model
   */
  btnClose_Click() {
    this.popUpClose.emit('close');
  }
  // #endregion

  // #region  [btnAddItemISNA_Click]
  /**
   * Add item ISNA-add ISNA Item to Criteria Text
   * @param event overlaypanel properties
   * @param opError overlaypanel for validation
   */
  btnAddItemISNA_Click(event: any, opError: OverlayPanel) {
    if (this.selectedCategoryISNA.label !== 'Financial Ratios' && this.selectedCategoryISNA.label !== 'Financial Statement') {
      this.selectedCriteria = this.selectedItemISNA.label;
    } else {
      this.errorMessages = 'Not A Valid Data Item';
      opError.show(event);
    }
  }
  // #endregion

  // #region  [btnAddItemValue_Click]
  /**
   * Add item value-add Value Item to Criteria List
   * @param event overlaypanel properties
   * @param op overlaypanel for validation
   */
  btnAddItemValue_Click(event: any, op: OverlayPanel) {
    if (this.selectedCategoryValue.label !== 'Financial Ratios' && this.selectedCategoryValue.label !== 'Financial Statement') {
      if (this.lstSelectedItems.length > 0) {
        const boolValue = this.lstSelectedItems.filter(P => P.label === this.selectedItemValue.label);
        if (boolValue.length === 0) {
          this.lstSelectedItems.push(this.selectedItemValue);
        } else {
          this.errorMessages = 'Item already Exists';
          op.show(event);
        }
      } else {
        this.lstSelectedItems.push(this.selectedItemValue);
      }
    } else {
      this.errorMessages = 'Not A Valid Data Item';
      op.show(event);
    }
  }
  // #endregion

  // #region  [btnRemoveItem_Click]
  /**
   * Remove item-remove item from selected Value Items
   * @param id selected itemId
   */
  btnRemoveItem_Click(id: string) {
    this.lstSelectedItems = this.lstSelectedItems.filter(P => P.value !== id);
  }
  // #endregion

  // #endregion

  // #region [Supporting Methods]

  // #region  [GetCategories]
  /**
   * Get Categories list
   */
  getCategories() {
    this.subCategoryItemsList = this.screeningSvc.getScreeningCategoryItemsList(this.userId).subscribe(
      (data) => {
        this.buildItemValues(data);
        if (this.selectedBoolean != null) {
          this.editMode(this.selectedBoolean);
          this.isEditMode = true;
        }
      }
    );
  }
  // #endregion

  // #region  [Build Item Values]
  /**
   * Build item values-get ISNA Categories list and Value Categories list
   * @param data Categories List
   */
  buildItemValues(data) {
    if (data && data !== null && data.length > 0) {
      if (data[0] && data[0] !== null && data[0].length > 0) {
        this.lstCategoriesISNA = data[0];
        this.lstCategoriesValue = data[0];
      }
    }
    if (data[1] && data[1] !== null && data[1].length > 0) {
      this.lstMasterItems = data[1];
    }
    this.lstCategoryISNA_Change(null);
    this.lstCategoryValue_Change(null);
  }
  // #endregion

  // #region  [EditMode]
  /**
   * Edit mode
   * @param strText Description string from Construct Screen to edit
   */
  editMode(strText: string) {
    if (strText.indexOf('VALUE') !== -1) {
      const strValue = strText.split('][');
      this.selectedSeries = (strText.split('][')[0]).replace(/\[/g, '');
      for (let i = 1; i < strValue.length; i++) {
        this.lstSelectedItems.push(
          this.lstMasterItems.find(P => P.label === strValue[i].replace(/\]/g, ''))
        );
      }
    } else {
      const strSeries = strText.split('][')[0];
      const strVal = strText.split('][')[1];
      this.selectedSeries = strSeries.replace(/\[/g, '').split('=')[0];
      this.txtValue = strSeries.split('=')[1];
      this.selectedCriteria = strVal.substring(0, (strVal.length - 1));
    }
  }
  // #endregion

  // #endregion
}
