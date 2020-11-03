// #region [Imports]
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OverlayPanel } from 'primeng/primeng';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleTrack, ModuleNames, ModelReturn } from 'src/app/_models/commoncore';
import { CommoncoreService } from 'src/app/_services/common/commoncore.service';
import { Items } from 'src/app/_models/alphas';
import { ScreeningService } from 'src/app/_services/screening/screening.service';
// #endregion

// #region [ComponentDecorator]
@Component({
  selector: 'app-rankmodel',
  templateUrl: './rankmodel.component.html',
  styleUrls: ['./rankmodel.component.css']
})
// #endregion

export class RankmodelComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region [CommonPageProperties]
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string;
  modelReturn: ModelReturn;
  errorMessages: string;
  // #endregion

  // #region [List Properties]
  lstItems: Items[];
  selectedItem: Items;
  lstCategories: Items[];
  selectedCategory: Items;
  lstMasterItems: Items[];
  lstSelectedItems: Items[] = [];
  txtStartNumber: string;
  // #endregion

  // #region [SubscriptionProperties]
  subCategoryItemsList: any;
  // #endregion

  // #region [Input/Output Data]
  @Output() popUpClose = new EventEmitter();
  @Output() popUpSubmit = new EventEmitter();
  @Input() selectedRank: string;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private commonSvc: CommoncoreService,
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

  // #region [clearAllProperties]
  /**
   * Clears all properties
   */
  clearAllProperties() {
  }
  // #endregion

  // #region [ngOnDestroy] */
  /**
   * on destroy-Clears all the subscriptions and properties
   */
  ngOnDestroy() {
    this.clearSubscriptions();
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
      this.commonSvc.updateModuleTrack(moduleTrack).subscribe((data) => {
      },
        (error) => {
          console.log(error);
        });
    }
  }
  // #endregion

  // #region [ClearSubscriptions]
  /**
   * Clear subscriptions-clears all the service subscriptions
   */
  clearSubscriptions() {
    this.subCategoryItemsList ? this.subCategoryItemsList.unsubscribe() : this.clear();
  }

  /**
   * Clear
   */
  clear() {
  }
  // #endregion

  // #region [initializations]
  /**
   * Initializations
   */
  initializations() {
    this.userId = sessionStorage.getItem(this.envKey.toString() + 'userId');
    this.getCategories();
    this.txtStartNumber = '0';
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
   * @param op overlaypanel for validation
   */
  btnSubmit_Click(event: any, op: OverlayPanel) {
    this.modelReturn = new ModelReturn();
    if (this.txtStartNumber !== '') {
      if (this.lstSelectedItems.length > 0) {
        let top = '';
        const startdesc = this.txtStartNumber === '0' ? top = '[RANK^' : top = '[TOP ' + this.txtStartNumber + '^RANK^';
        const startval = this.txtStartNumber === '0' ? top = 'RANK^' : top = 'TOP ' + this.txtStartNumber + '^RANK^';
        let desc = '';
        let val = '';
        let dbval = '';
        for (const selectedItem of this.lstSelectedItems) {
          desc += selectedItem.label;
          desc += '`';
          dbval = selectedItem.label;
          val = selectedItem.databaseValue;
        }
        this.modelReturn.description = startdesc + desc.substring(0, (desc.length - 1)) + ']';
        this.modelReturn.value = 'order by (' + val + ') desc$$$' + startval + desc.substring(0, (desc.length - 1)) + ','
          + val + ' as \'' + dbval + '\'';
        this.modelReturn.mode = '';
        this.popUpSubmit.emit(this.modelReturn);
      } else {
        this.errorMessages = 'Please Add Atleast One Item';
        op.show(event);
      }
    } else {
      this.errorMessages = 'Please enter top value';
      op.show(event);
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

  // #region [btnAddItem_Click]
  /**
   * Add Item to Criteria List
   * @param event overlaypanel properties
   * @param op overlaypanel for validation
   */
  btnAddItem_Click(event: any, op: OverlayPanel) {
    if (this.selectedCategory.label !== 'Financial Ratios' && this.selectedCategory.label !== 'Financial Statement') {
      if (this.lstSelectedItems.length > 0) {
        const boolValue = this.lstSelectedItems.filter(P => P.label === this.selectedItem.label);
        if (boolValue.length === 0) {
          this.lstSelectedItems.push(this.selectedItem);
        } else {
          this.errorMessages = 'Item already Exists';
          op.show(event);
        }
      } else {
        this.lstSelectedItems.push(this.selectedItem);
      }
    } else {
      this.errorMessages = 'Not A Valid Data Item';
      op.show(event);
    }
  }
  // #endregion

  // #region [btnRemoveItem_Click]
  /**
   * Removes item from Criteria list
   * @param id selected itemId
   */
  btnRemoveItem_Click(id: string) {
    this.lstSelectedItems = this.lstSelectedItems.filter(P => P.value !== id);
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
        if (this.selectedRank != null) {
          this.editMode(this.selectedRank);
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
    let items = [];
    const strSeries = strText.split('^');
    (strText.indexOf('TOP') !== -1) ? (this.txtStartNumber = (strSeries[0].split(' '))[1]) : (this.txtStartNumber = '0');
    if (strText.indexOf('TOP') !== -1) {
      items = (strSeries[2].replace(/\]/g, '')).split('`');
    } else {
      items = (strSeries[1].replace(/\]/g, '')).split('`');
    }
    for (const item of items) {
      this.lstSelectedItems.push(
        this.lstMasterItems.find(P => P.label === item)
      );
    }
  }
  // #endregion

  // #endregion
}
