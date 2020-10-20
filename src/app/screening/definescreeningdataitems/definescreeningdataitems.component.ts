// #region  [Imports]
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleTrack, ModuleNames, ReturnValue } from 'src/app/_models/commoncore';
import { CommoncoreService } from 'src/app/_services/common/commoncore.service';
import { ScreeningService } from 'src/app/_services/screening/screening.service';
import { Items, AlphaItems } from 'src/app/_models/alphas';
import { SecurityService } from 'src/app/_services/security/security.service';
// #endregion

// #region  [ComponentDecorator]
@Component({
  selector: 'app-definescreeningdataitems',
  templateUrl: './definescreeningdataitems.component.html',
  styleUrls: ['./definescreeningdataitems.component.css']
})
// #endregion

export class DefinescreeningdataitemsComponent implements OnInit, OnDestroy {

  // #region [Properties]

  // #region  [CommonPageProperties]
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string;
  showSpinner = false;
  displayDateFormat: string;
  isSecure = false;
  subQueryParamSubscribe: any;
  // #endregion

  // #region  [PageProperties]
  lstSpecialKeyCodes = [13, 33, 34, 35, 36, 37, 39, 40, 41, 42, 43, 44, 46, 47, 58, 59,
    60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126];
  lstSpecialKeyCodesDataItem = [13, 33, 34, 35, 36, 38, 44, 58, 59, 61, 63, 64, 92, 94, 95, 96, 123, 124, 125, 126];
  lstScreeningItems: string[];
  lstScreeningItemsValues: string[];
  arrOperators = ['+', '-', '*', '/', '.'];
  alertErrorMsg: string;
  isMyScreening = false;
  // #endregion

  // #region  [FormProperties]
  frmScreeningItem: FormGroup;
  selectedScreeningItemEdit: any;
  // #endregion

  // #region  [ListProperties]
  lstItems: Items[];
  selectedItem: Items;
  lstCategories: Items[];
  selectedCategory: Items;
  lstMasterItems: Items[];
  // #endregion

  // #region  [SubscriptionProperties]
  subCategoryItemsList: any;
  subInsertScreeningItem: any;
  subUpdateScreeningItem: any;
  // #endregion

  // #endregion

  // #region [Constructor]
  constructor(
    private activeRoute: ActivatedRoute,
    private commonSvc: CommoncoreService,
    private dataSvc: DataService,
    private msgSvc: MessageService,
    private fb: FormBuilder,
    private screeningSvc: ScreeningService,
    private securityService: SecurityService,
    private router: Router,
  ) { }
  // #endregion

  // #region [Page Events]

  // #region [ngOnInit]
  /**
   * on init - on page initilization
   */
  ngOnInit() {
    this.showSpinner = true;
    this.isSecure = false;
    this.dataSvc.changeModule(ModuleNames.Screening);
    this.dataSvc.startModule();
    this.subQueryParamSubscribe = this.activeRoute.queryParams.subscribe(params => {
      this.isSecure = false;
      this.checkSecurity();
    });
  }
  // #endregion

  // #region [CheckSecurity]
  /**
   * Checks security
   */
  checkSecurity() {
    this.isSecure = this.securityService.checkPageSecurity('Define New Screening Data Item');
    if (this.isSecure) {
      this.initializations();
    } else {
      this.router.navigate(['/unauthorized'], { skipLocationChange: false, queryParams: { status: 'F' } });
    }
  }
  // #endregion

  // #region [ngOnDestroy]
  /**
   * on destroy - Clears all properties and subscriptions
   */
  ngOnDestroy() {
    this.clearSubscriptions();
    this.clearAllProperties();
    this.updateModuleTrack();
    this.dataSvc.clearScreeningItem();
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
   * Clears subscriptions - clears all Subscriptions
   */
  clearSubscriptions() {
    this.subQueryParamSubscribe ? this.subQueryParamSubscribe.unsubscribe() : this.clear();
    this.subCategoryItemsList ? this.subCategoryItemsList.unsubscribe() : this.clear();
    this.subInsertScreeningItem ? this.subInsertScreeningItem.unsubscribe() : this.clear();
    this.subUpdateScreeningItem ? this.subUpdateScreeningItem.unsubscribe() : this.clear();
  }

  clear() {
  }
  // #endregion

  // #region [ClearAllProperties]
  /**
   * Clears all properties
   */
  clearAllProperties() {
    this.showSpinner = true;
    this.clearCategoryProperties();
    this.showSpinner = false;
  }
  // #endregion

  // #region [Initializations]
  /**
   * Initializations definescreeningdataitems component
   */
  initializations() {
    this.clearAllProperties();
    this.showSpinner = true;
    this.userId = sessionStorage.getItem(this.envKey.toString() + 'userId');
    this.displayDateFormat = 'MM/dd/yyyy';
    this.BuildFormControls();
    this.isMyScreening = true;
    this.showSpinner = false;
    this.isSecure = true;
    this.getCategories();
  }
  // #endregion

  // #endregion

  // #region [Control Events]

  // #region [lstCategory_Change]
  /**
   * Lsts category change - Loads Items based on selected Category
   * @param category selected category
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
    if (this.getFormControl('selectedCategory')) {
      this.getFormControl('selectedCategory').setValue(this.selectedCategory);
    }
    this.lstItems = this.lstMasterItems.filter(P => P.categoryId === this.selectedCategory.value);
    this.lstItem_Change(null);
  }
  // #endregion

  // #region [lstItem_Change]
  /**
   * Lsts item change - Loads description of selected item
   * @param item Selected Item
   */
  lstItem_Change(item) {
    this.selectedItem = null;
    if (item !== null) {
      this.selectedItem = item.value;
    } else {
      if (this.lstItems && this.lstItems !== null && this.lstItems.length > 0) {
        this.selectedItem = this.lstItems[0];
      }
    }
    if (this.getFormControl('selectedItem')) {
      this.getFormControl('selectedItem').setValue(this.selectedItem);
    }
  }
  // #endregion

  // #region [ctrlKeyPress]
  /**
   * Ctrls key press - Resticts the entry of operators and special characters
   * @param event key press event
   * @param mode Static user value
   */
  ctrlKeyPress(event, mode) {
    let errorCnt = 0;
    let kId;
    kId = window.navigator.appName === 'Netscape' ? event.which : event.keyCode;
    if (mode === 0) {
      const ctrlDataItemVal = this.getFormControl('ctrlDataItem').value;
      const len = ctrlDataItemVal.length;
      const lastChar = ctrlDataItemVal.charCodeAt(len - 1);
      // this statement restricts the user to enter Operators at the very beginning in the textarea
      if ((kId === 42 || kId === 43 || kId === 45 || kId === 47) && this.replaceAll(ctrlDataItemVal).length === 0) {
        alert('Operator should be preceeded by Data Item');
        errorCnt++;
        // return addOperator(" " + String.fromCharCode(kId)+ " ")
      }
      if (this.lstSpecialKeyCodesDataItem.includes(kId)) {
        if (kId !== 16) {
          errorCnt++;
        }
      }
      // if the user tries to close the dataitem with ")" bracket then this statement prompts.
      // () should be used only for combining the dataitems
      if (kId === 41 && ((lastChar >= 65 && lastChar <= 90) || (lastChar >= 97 && lastChar <= 122))) {
        alert('() brackets should be used to combine one or more data items with operators');
        errorCnt++;
      }
    } else {
      // for Item Name
      if (this.lstSpecialKeyCodes.includes(kId)) {
        if (kId !== 16) {
          errorCnt++;
        }
      }
    }
    if (errorCnt > 0) {
      event.preventDefault();
    }
  }
  // #endregion

  // #region [btnAddItem_Click]
  /**
   * Btns add item click - Add Items for building formaula
   */
  btnAddItem_Click() {
    this.showSpinner = true;
    this.funTrimString(this.getFormControl('ctrlDataItem'));
    const ctrlDataItemVal = this.getFormControl('ctrlDataItem').value;
    const len = ctrlDataItemVal.length;
    let lastChar = ctrlDataItemVal.charCodeAt(len - 1);
    if (lastChar === 40 || lastChar === 42 || lastChar === 43 || lastChar === 45 ||
      lastChar === 47 || lastChar === 59 || isNaN(lastChar) === true) {
      lastChar = ctrlDataItemVal.charAt(len - 1);
      if (lastChar === ';') {
        if (this.selectedItem.categoryId === '999') {
          this.getFormControl('ctrlDataItem').setValue(ctrlDataItemVal + this.selectedItem.databaseValue + ']');
        } else {
          this.getFormControl('ctrlDataItem').setValue(ctrlDataItemVal + this.selectedItem.label + ']');
        }
      } else {
        if (this.selectedItem.categoryId === '999') {
          this.getFormControl('ctrlDataItem').setValue(ctrlDataItemVal + this.selectedItem.databaseValue);
        } else {
          this.getFormControl('ctrlDataItem').setValue(ctrlDataItemVal + '[' + this.selectedItem.label + ']');
        }
      }
    } else {
      alert('Data Item can be added only after an Operator(+ - * /)');
    }
    this.showSpinner = false;
  }
  // #endregion

  // #region [btnAddOperator_Click]
  /**
   * Btns add operator click - Adds Operators for building formula
   * @param sign (+,-,*,/)
   */
  btnAddOperator_Click(sign) {
    this.showSpinner = true;
    this.funTrimString(this.getFormControl('ctrlDataItem'));
    const ctrlDataItemVal = this.getFormControl('ctrlDataItem').value;
    const len = ctrlDataItemVal.length;
    const lastChar = ctrlDataItemVal.charCodeAt(len - 1);
    const signSubstr = sign.substr(1, 1);
    if ((lastChar >= 65 && lastChar <= 90) || (lastChar >= 97 && lastChar <= 122)) {
      alert('Place DataItem in \'[]\' Brackets');
    }
    if (lastChar === 93 || lastChar === 41 || ('1234567890'.indexOf(String.fromCharCode(lastChar)) >= 0)) {
      if ((lastChar === 93 || lastChar === 40 || lastChar === 41) && signSubstr === '(') {
        this.getFormControl('ctrlDataItem').setValue(ctrlDataItemVal + '*' + signSubstr);
      } else {
        this.getFormControl('ctrlDataItem').setValue(ctrlDataItemVal + signSubstr);
      }
    }
    if (signSubstr === '(' &&
      (lastChar === 40 || lastChar === 42 || lastChar === 43 || lastChar === 45 || lastChar === 47 ||
        isNaN(lastChar) === true)) {
      this.getFormControl('ctrlDataItem').setValue(ctrlDataItemVal + signSubstr);
    }
    this.showSpinner = false;
  }
  // #endregion

  // #region [btnSaveItem_Click]
  /**
   * Btns save item click - Saves the built formula to database
   * @returns  Status Message
   */
  btnSaveItem_Click() {
    if (!(this.checkForEmptyValues())) {
      return false;
    } else if (!(this.validateItemName())) {
      return false;
    } else if (!(this.validateDataItem())) {
      return false;
    } else {
      this.frameItemInfo();
    }
  }
  // #endregion

  // #endregion

  // #region [Supporting Methods]

  // #region [BuildFormControls]
  /**
   * Builds form controls - Builds Controls
   */
  BuildFormControls() {
    this.frmScreeningItem = this.fb.group({
      ctrlDataItem: ['', [Validators.required]],
      ctrlItemName: ['', [Validators.required]],
      selectedCategory: [''],
      selectedItem: [''],
    });
  }
  // #endregion

  // #region [getFormControl]
  /**
   * Gets form control
   * @param ctrlName Control
   */
  getFormControl(ctrlName) {
    if (this.frmScreeningItem && this.frmScreeningItem.controls && this.frmScreeningItem.controls[ctrlName]) {
      return this.frmScreeningItem.controls[ctrlName];
    } else {
      return undefined;
    }
  }
  // #endregion

  // #region [hasFormErrors]
  /**
   * Determines whether form has errors
   * @returns  Valid/invalid
   */
  hasFormErrors() {
    return !this.frmScreeningItem.valid;
  }
  // #endregion

  // #region [resetForm]
  /**
   * Resets form
   */
  resetForm() {
    if (this.frmScreeningItem) {
      this.frmScreeningItem.markAsPristine();
      this.frmScreeningItem.markAsUntouched();
      this.frmScreeningItem.updateValueAndValidity();
      this.frmScreeningItem.reset();
      if (this.getFormControl('ctrlItemName')) {
        this.getFormControl('ctrlItemName').enable();
        this.getFormControl('ctrlItemName').setValue('');
      }
      if (this.getFormControl('ctrlDataItem')) {
        this.getFormControl('ctrlDataItem').setValue('');
      }
    }
  }
  // #endregion

  // #region [GetCategories]
  /**
   * Gets categories - Load Categories from Database
   */
  getCategories() {
    this.showSpinner = true;
    this.clearCategoryProperties();
    this.subCategoryItemsList = this.screeningSvc.getScreeningCategoryItemsList(this.userId).subscribe(
      (data) => {
        this.clearCategoryProperties();
        this.buildItemValues(data);
        this.showSpinner = false;
      }
    );
  }
  // #endregion

  // #region [buildItemValues]
  /**
   * Builds item values - Loads Categories and Items from Database
   * @param data Catergoris and Items array
   */
  buildItemValues(data) {
    if (data && data !== null && data.length > 0) {
      if (data[0] && data[0] !== null && data[0].length > 0) {
        this.lstCategories = data[0];
        this.lstCategories.push({ label: 'My DataItems', value: '999' });
      }
      if (data[1] && data[1] !== null && data[1].length > 0) {
        this.lstMasterItems = data[1];
      }
    }
    if (this.lstCategories && this.lstCategories !== null && this.lstCategories.length > 0
      && this.lstMasterItems && this.lstMasterItems !== null && this.lstMasterItems.length > 0) {
      for (const category of this.lstCategories) {
        if (category.value) {
          const filteredItems = this.lstMasterItems.filter(m => m.categoryId === category.value);
          if (filteredItems && filteredItems !== null && filteredItems.length > 0) {
            this.lstScreeningItems.push('@' + filteredItems.map(m => m.label).join('@') + '@');
            this.lstScreeningItemsValues.push(filteredItems.map(m => m.databaseValue + '^' + m.label).join('^N@'));
          }
        }
      }
    }
    this.lstCategory_Change(null);
    this.editModeSelection();
  }
  // #endregion

  // #region [clearCategoryProperties]
  /**
   * Clears category properties
   */
  clearCategoryProperties() {
    this.lstCategories = [];
    this.selectedCategory = null;
    this.lstItems = [];
    this.selectedItem = null;
    this.lstMasterItems = [];
    this.lstScreeningItems = [];
    this.lstScreeningItemsValues = [];
    this.selectedScreeningItemEdit = null;
  }
  // #endregion

  // #region [editModeSelection]
  /**
   * Edits mode selection - Loads the form with edited values
   */
  editModeSelection() {
    if (this.dataSvc.currentScreeningItem) {
      this.selectedScreeningItemEdit = this.dataSvc.currentScreeningItem;
      if (this.getFormControl('ctrlItemName')) {
        this.getFormControl('ctrlItemName').enable();
        if (this.selectedScreeningItemEdit !== 'New') {
          this.getFormControl('ctrlItemName').setValue(this.selectedScreeningItemEdit.itemName);
          this.getFormControl('ctrlItemName').disable();
          if (this.getFormControl('ctrlDataItem')) {
            this.getFormControl('ctrlDataItem').setValue(this.selectedScreeningItemEdit.itemDesc);
          }
        }
      }
    }
  }
  // #endregion

  // #region [checkForEmptyValues]
  /**
   * Checks for empty values
   * @returns true if no empty values
   */
  checkForEmptyValues(): boolean {
    // if value in itemname is null
    if (this.replaceAll(this.getFormControl('ctrlItemName').value) === '') {
      alert('Please provide the Item Name');
      return false;
    }
    // if value in textarea is null
    if (this.replaceAll(this.getFormControl('ctrlDataItem').value) === '') {
      alert('Build the Data Item');
      return false;
    }
    return true;
  }
  // #endregion

  // #region [validateItemName]
  /**
   * Validates item name for special characters
   * @returns true if item name is not empty
   */
  validateItemName(): boolean {
    this.funTrimString(this.getFormControl('ctrlItemName'));
    const ctrlItemNameVal = this.replaceAll(this.getFormControl('ctrlItemName').value);
    const len = ctrlItemNameVal.length;
    const firstChar = ctrlItemNameVal.charAt(0);
    const lastChar = ctrlItemNameVal.charAt(len - 1);
    const strInvalidChars = '&& &- -& --';
    const arrInvalidChars = strInvalidChars.split(' ');

    // if "-" or "&" is present at the beginning of name
    if (firstChar === '-' || firstChar === '&') {
      alert('Item Name should start with an Alphabet or a Numeric');
      return false;
    }
    // if "-" or "&" is present at the end of name
    if (lastChar === '-' || lastChar === '&') {
      alert('Item Name should end with an Alphabet or a Numeric');
      return false;
    }
    // this loop checks for existence of special characters in the string.
    // for item name user is allowed to have only "-","&", space,alphabets and numerics
    for (let g = 0; g < len; g++) {
      if (this.lstSpecialKeyCodes.includes(ctrlItemNameVal.charCodeAt(g)) && ctrlItemNameVal.charAt(g) !== '`') {
        alert('Check Item Name at \'' + ctrlItemNameVal.charAt(g) + '\'');
        return false;
      }
    }
    // this loop checks for existence of special cases
    for (const invalidChar of arrInvalidChars) {
      if (ctrlItemNameVal.indexOf(invalidChar) >= 0) {
        alert('Check Data Item Name at \'' + invalidChar + '\'');
        return false;
      }
    }
    return true;
  }
  // #endregion

  // #region [validateDataItem]
  /**
   * Validates data item - Checks dataItem for special characters, brackets and numeric values
   * @returns true if data item satisfies all the user conditions
   */
  validateDataItem(): boolean {
    if (!(this.checkBracketsAndSpChars())) {
      return false;
    }
    if (!(this.validateDataItemsandNumericValues())) {
      return false;
    }
    if (!(this.checkOperatorsSuccession())) {
      return false;
    }
    return true;
  }
  // #endregion

  // #region [validateDataItemsandNumericValues]
  /**
   * Validates data items and numeric values
   * @returns true if data items and numeric values
   */
  validateDataItemsandNumericValues(): boolean {
    let spos = 0; // position of opening brackets ( or ]
    let epos = 0; // position of closing brackets ] or )
    let searchText;
    let subsearch;
    const ctrlDataItemVal = '(' + this.getFormControl('ctrlDataItem').value + ')';
    const len = ctrlDataItemVal.length;
    // Loop checks for valid DataItems, valid Numeric Values
    for (let i = 0; i < len; i++) {
      const charAtPos = ctrlDataItemVal.charAt(i);

      if (charAtPos === '[' || charAtPos === '(') {
        // cutting the string upto i and assigning to variable
        subsearch = ctrlDataItemVal.substring(spos + 1, i);

        // if "subsearch" length >0 and no closing brackets exists
        // For checking the values like (23456+[DataItem])
        if (subsearch.length > 0) {
          if (subsearch.indexOf(']') < 0 && subsearch.indexOf(')') < 0) {
            // function "checkOperatorNumeric" will check for valid numeric values
            if (this.isMyScreening) {
              if (this.checkOperatorNumeric(subsearch, 0) === false) {
                alert('Check data item at \'' + subsearch + '\'\n' + this.alertErrorMsg);
                return false;
              }
            }
          } else {
            // taking the text between brackets
            const insubsearch = ctrlDataItemVal.substring(epos + 1, i);
            if (this.isMyScreening) {
              if (this.checkOperatorNumeric(insubsearch.substring(0, insubsearch.length - 1), 1) === false) {
                alert('Check data item at \'' + subsearch + '\'\n' + this.alertErrorMsg);
                return false;
              }
            }
            if (this.isMyScreening) {
              if (this.checkOperatorNumeric(insubsearch.substring(1, insubsearch.length), 0) === false) {
                alert('Check data item at \'' + subsearch + '\'\n' + this.alertErrorMsg);
                return false;
              }
            }
          }
        }

        // assigning the value of i to spos
        spos = i;
      } else if (charAtPos === ']' || charAtPos === ')') {
        // assigning value of i to epos
        epos = i;

        if (spos !== epos && spos < epos) {
          // picking up the text between two brackets
          searchText = ctrlDataItemVal.substring(spos + 1, epos);

          // if closing bracket is present in searchText
          // this if statement validates the text after bracket ie., [dataitem]+5462562
          if (searchText.indexOf(']') >= 0 || searchText.indexOf(')') >= 0) {
            // taking the value after bracket
            subsearch = searchText.substring(searchText.indexOf(']') + 1, searchText.length);

            if (subsearch.length > 0) {
              if (this.isMyScreening) {
                if (this.checkOperatorNumeric(subsearch, 1) === false) {
                  alert('Check data item at \'' + subsearch + '\'\n' + this.alertErrorMsg);
                  return false;
                }
              }
            }
            // finally takes the text only between the brackets
            searchText = searchText.substring(0, searchText.indexOf(']'));
          }

          // this if statement checks whether the searchText is placed in Square Brackets or not
          // It is assumed that Dataitem should be placed only in Square Brackets
          if (this.isMyScreening) {
            if (ctrlDataItemVal.charAt(ctrlDataItemVal.indexOf(searchText) - 1) !== '['
              || ctrlDataItemVal.charAt(ctrlDataItemVal.indexOf(searchText) + (searchText.length)) !== ']') {
              alert('Place dataitem \'' + searchText +
                '\' in Square[] Brackets. \nDon\'t use Brackets for Numeric Values');
              return false;
            }
          }
          // now the main loop comes and it will check for valid dataitem using the lstScreeningItems array
          // CheckDataItem checks the data item in the array of dataitems
          if (this.isMyScreening) {
            if (!(this.checkDataItem(searchText))) {
              alert('[' + searchText +
                '] is not a valid Data Item. \nDon\'t use Brackets for Numeric Values');
              return false;
            }
          }
          // like this the loop goes upto the end of the text
        }
      }
    }
    return true;
  }
  // #endregion

  // #region [checkOperatorsSuccession]
  /**
   * Checks operators succession - checks if data exists between '[]'
   * @returns true if operators succession
   */
  checkOperatorsSuccession(): boolean {
    const ctrlDataItemVal = '(' + this.getFormControl('ctrlDataItem').value + ')';
    // for loop checks for the existence of operators in succession
    for (let i = 0; i < ctrlDataItemVal.length; i++) {
      const charAtPos = ctrlDataItemVal.charAt(i);
      // this if statement checks whether only dataitems are kept in [] brackets or not
      if (charAtPos === '[') {
        if (this.isMyScreening) {
          if (this.checkDataItem(ctrlDataItemVal.substring(i + 1, ctrlDataItemVal.indexOf(']', i))) === false) {
            alert('Use \'[]\' Square Brackets only for DataItems');
            return false;
          }
        }
      }
      if (this.arrOperators.includes(charAtPos)) {
        if ((i + 1) <= ctrlDataItemVal.length) {
          const charAtNextPos = ctrlDataItemVal.charAt(i + 1);
          if (this.arrOperators.includes(charAtNextPos)) {
            alert('Use of Operators in succession is not allowed');
            return false;
          }
        }
      }
    }
    return true;
  }
  // #endregion

  // #region [checkBracketsAndSpChars]
  // Function performs all checks relating to brackets
  /**
   * Checks brackets and sp chars - Checks for brackets and special characters
   */
  checkBracketsAndSpChars() {
    this.funTrimString(this.getFormControl('ctrlDataItem'));
    const ctrlDataItemVal = this.replaceAll(this.getFormControl('ctrlDataItem').value);
    const len = ctrlDataItemVal.length;
    const firstChar = ctrlDataItemVal.charCodeAt(0);
    const lastChar = ctrlDataItemVal.charCodeAt(len - 1);
    const invalidPairs = ['][', '()', '[]', ',)', ')(', ')[', ']_', '_]',
      '<', '>', '=', '!', '$', '^', '?', '&', '~', '`', '#', '\\', ',',
      '[[', ']]', '}', '{', ':', ';', '@', '"', '|', '+)', '-)', '*)', '/)', '+]', '-]', '*]', '/]', '](',
      '(+', '(-', '(*', '(/', '[+', '[-', '[*', '[/', '(%', '[%', '..', '[(', ')]'];
    let OpenBrack1 = 0; // for '['
    let CloseBrack1 = 0; // for ']'
    let OpenBrack2 = 0; // for '('
    let CloseBrack2 = 0; // for ')'
    if (ctrlDataItemVal.indexOf('[') !== 0
      && ctrlDataItemVal.indexOf('(') !== 0
      && (firstChar < 48 || firstChar > 57)) {
      alert('DataItem must start with \'[\' bracket or \'(\' bracket or with numeric value');
      return false;
    }
    // if closing bracket is not there at the ending
    if ((ctrlDataItemVal.lastIndexOf(']') !== len - 1)
      && (ctrlDataItemVal.lastIndexOf(')') !== len - 1)
      && (lastChar < 48 || lastChar > 57)) {
      alert('DataItem must end with \']\' bracket or \')\' bracket or with numeric value');
      return false;
    }

    // this loop checks for the existence of noted cases in the string
    for (const invalidPair in invalidPairs) {
      if (this.isMyScreening) {
        if (ctrlDataItemVal.indexOf(invalidPairs[invalidPair]) >= 0 &&
          invalidPairs[invalidPair] !== '<' && invalidPairs[invalidPair] !== '>') {
          if (invalidPairs[invalidPair] === '[[' || invalidPairs[invalidPair] === ']]' ||
            invalidPairs[invalidPair] === '[(' || invalidPairs[invalidPair] === ')]') {
            alert('Use \'()\' brackets for Combining Data items. \'[[\' or \']]\' or \'[(\' or \')]\' is not allowed');
          } else if (invalidPairs[invalidPair] === '][' || invalidPairs[invalidPair] === '](' || invalidPairs[invalidPair] === ')[') {
            alert('There Must be Operators(+ - * /) between dataitems');
          } else {
            alert('Check your Data item at  \'' + invalidPairs[invalidPair] + '\'');
          }
          return false;
        }
      }
    }

    // this loop takes the count of opening and closing brackets
    // Actually < and > are not allowed.  But one dataitem is having < and >.
    // So specifically for that dataitem, validation is done
    for (let i = 0; i < len; i++) {
      const presentChar = ctrlDataItemVal.charAt(i);
      if (presentChar === '[') {
        OpenBrack1 = OpenBrack1 + 1;
      }
      if (presentChar === ']') {
        CloseBrack1 = CloseBrack1 + 1;
      }
      if (presentChar === '(') {
        OpenBrack2 = OpenBrack2 + 1;
      }
      if (presentChar === ')') {
        CloseBrack2 = CloseBrack2 + 1;
      }
      if (presentChar === '<' && ctrlDataItemVal.charAt(i + 1).toLowerCase() !== 'u') {
        alert('Check your Data Item at \'<\'');
        return false;
      }
      if (presentChar === '>' && ctrlDataItemVal.charAt(i - 1).toLowerCase() !== 'e') {
        alert('Check your Data Item at \'>\'');
        return false;
      }
      if (presentChar === '.' && (isNaN(ctrlDataItemVal.charAt(i - 1)) || isNaN(ctrlDataItemVal.charAt(i + 1)))) {
        alert('Dot \'.\' should be placed between Numeric Values');
        return false;
      }
    }

    // If total opening brackets and closing brackets are not equal
    if (OpenBrack1 !== CloseBrack1) {
      alert('Check Opening \'[\' and Closing \']\' Brackets');
      return false;
    }
    if (OpenBrack2 !== CloseBrack2) {
      alert('Check Opening \'(\' and Closing \')\' Brackets');
      return false;
    }
    if ((ctrlDataItemVal.indexOf('+') < 0 && ctrlDataItemVal.indexOf('-') < 0 &&
      ctrlDataItemVal.indexOf('*') < 0 && ctrlDataItemVal.indexOf('/') < 0) &&
      (OpenBrack1 > 1 || CloseBrack2 > 1)) {
      alert('There Must be Operators(+ - * /) between dataitems');
      return false;
    }
    return true;
  }
  // #endregion

  // #region [checkOperatorNumeric]
  // Checks for valid numeric values and the presence of operators before numerics
  //  mode            Presence of text
  // 	 0		txt is at the beginning of the dataitem
  //   1    txt is at the ending of the dataitem
  // 	 2    txt must be a valid numeric value
  /**
   * Checks operator numeric
   * @param txt Dataitem
   * @param mode 0,1,2
   * @returns  true if numeric conditions are met
   */
  checkOperatorNumeric(txt, mode) {
    // This if statement checks for valid numeric value
    if (mode === 2) {
      if (isNaN(txt) || (txt * 1 === 0)) {
        return false;
      } else {
        return true;
      }
    }
    let snumb = -1;
    const len = txt.length;
    for (const f of len) {
      const presentChar = txt.charCodeAt(f);
      if ((presentChar >= 48 && presentChar <= 57) || presentChar === 46) {
        if (snumb === -1) {
          snumb = f;
        }
        if (f === 0 && mode === 1) {
          this.alertErrorMsg = 'Numeric Values after dataitems should be Preceeded by Operators(+ - * /)';
          return false;
        }

        if (snumb !== -1 && f === len - 1) {
          if (mode === 0) {
            this.alertErrorMsg = 'Numeric Values before dataitems should be Succeded by Operators(+ - * /)';
            return false;
          }

          if (isNaN(txt.substring(snumb, len)) || (txt.substring(snumb, len) * 1 === 0)) {
            this.alertErrorMsg = 'Not a valid Numeric Value';
            return false;
          }
        }
      } else if (snumb !== -1) {
        if (this.checkOperatorNumeric(txt.substring(snumb, f), 2)) {
          snumb = -1;
        } else {
          this.alertErrorMsg = 'Not a valid Numeric Value';
          return false;
        }
      }
      if ((presentChar >= 65 && presentChar <= 90)
        || (presentChar >= 97 && presentChar <= 122)) {
        this.alertErrorMsg = 'Not a valid Numeric Value';
        return false;
      }
      if (presentChar >= 48 && presentChar <= 57) {
        const charPos = (mode === 1) ? (f - 1) : (f + 1);
        const charCodeAtPos = txt.charCodeAt(charPos);
        if (charCodeAtPos < 48 || charCodeAtPos > 57) {
          const charAtPos = txt.charAt(charPos);
          if (!this.arrOperators.includes(charAtPos)) {
            this.alertErrorMsg = 'Numeric Values should be ' + (mode === 1) ? 'Preceeded' : 'Succeeded' + ' by Operators(+ - * /)';
            return false;
          }
        }
      }
      if (txt.charAt(f) === '%') {
        this.alertErrorMsg = 'Not a valid Numeric Value';
        return false;
      }
    }
    return true;
  }
  // #endregion

  // #region [checkDataItem]
  /**
   * Checks data item
   * @param txtDataItem Added Dataitem to build formula
   * @returns true if data item is not empty
   */
  checkDataItem(txtDataItem): boolean {
    const dataItemExists = this.lstScreeningItems.filter(m => m.toLowerCase().indexOf('@' + txtDataItem.toLowerCase() + '@') > -1);
    if (dataItemExists && dataItemExists !== null && dataItemExists.length > 0) {
      return true;
    }
    return false;
  }
  // #endregion

  // #region [frameItemInfo]
  // This function frames the string containing the information relating to the database for the
  // selected dataitems and submits the form
  /**
   * Frames item info
   */
  frameItemInfo() {
    // assigning the value of textarea
    const finaltxt = this.getFormControl('ctrlDataItem').value;

    // this variable contains the database information relating to dataitem
    let finalitem;

    // The information relating to all dataitems will be pooled here
    let finalstring = '';

    // used in finding the index of "@"(end index)
    let eindex;

    // used in finding the index of "@"(start index)
    let sindex;
    let eDindex;

    // the following loop checks for the database information for the selected dataitem in the
    // lstScreeningItemsValues array and forms the string
    // The procedure followed is like this:
    // 1. Picking up the value between square brackets from the DataItem Definition
    // 2. Searching the Dataitem in the array. After finding, taking the index of "###" nearer to the dataitem found.This is ending index
    // 3. taking the string just before the "###"
    // 4. In that String, searching for lastindex of "###". It is starting index
    // 5. With the starting index and ending index framing the string.
    // alert(finaltxt);
    let i = 0;

    for (i = 0; i < finaltxt.length; i++) {
      if (finaltxt.charAt(i) === '[') {
        let firsttxt;
        let secondtxt;
        let thirdtxt;
        secondtxt = '';
        thirdtxt = '';

        firsttxt = finaltxt.substring(i + 1, finaltxt.indexOf(']', i + 1));

        if (firsttxt.indexOf(';') > 0) {
          secondtxt = firsttxt.split(';')[0];
          thirdtxt = firsttxt.split(';')[1];
          finalitem = '^' + thirdtxt + '^';
        } else {
          finalitem = '^' + firsttxt + '^';
        }
        i = finaltxt.indexOf(']', i + 1);
        for (const screeningItem of this.lstScreeningItemsValues) {
          if ((screeningItem.toLowerCase()).indexOf(finalitem.toLowerCase()) >= 0) {
            eDindex = screeningItem.indexOf('@', (screeningItem.toLowerCase()).indexOf(finalitem.toLowerCase()));
            eindex = (screeningItem.toLowerCase()).indexOf(finalitem.toLowerCase());
            if ((screeningItem.substring(0, eDindex)).lastIndexOf('@') < 0) {
              sindex = 0;
            } else {
              sindex = ((screeningItem.substring(0, eDindex)).lastIndexOf('@')) + 1;
            }
            if (secondtxt.length > 0) {
              finalstring = finalstring + secondtxt + '(' + screeningItem.substring(sindex, eindex) + ')';
            } else {
              finalstring = finalstring + screeningItem.substring(sindex, eindex);
            }

            break;
          }
        }
      } else {
        finalstring = finalstring + finaltxt.charAt(i);
      }
    }
    finalstring = finalstring + '$$$' + finalstring + ' as \'' + this.getFormControl('ctrlItemName').value + '\'';
    finalitem = '^' + finaltxt.substring(i + 1, finaltxt.indexOf(']', i + 1)) + '^';
    this.saveScreeningItem(finalstring);
  }
  // #endregion

  // #region [saveScreeningItem]
  /**
   * Saves screening item - Saves/Updates the formula into database
   * @param itemInfo Built formaula
   */
  saveScreeningItem(itemInfo: string) {
    let alphaItem: AlphaItems;
    alphaItem = {};
    alphaItem.userId = +this.userId;
    alphaItem.itemName = this.getFormControl('ctrlItemName').value;
    alphaItem.itemInfo = itemInfo;
    alphaItem.itemDesc = this.getFormControl('ctrlDataItem').value;
    if (this.selectedScreeningItemEdit !== 'New') {
      this.updateScreeningItem(alphaItem);
    } else {
      this.insertScreeningItem(alphaItem);
    }
  }
  // #endregion

  // #region [insertScreeningItem]
  /**
   * Inserts screening item - Save the Formula to Database
   * @param alphaItem Built formula
   */
  insertScreeningItem(alphaItem: AlphaItems) {
    this.showSpinner = true;
    this.subInsertScreeningItem = this.screeningSvc.InsertScreeningItem(alphaItem).subscribe((data) => {
      this.showErrorDetail(data, 'Screening Item inserted');
      this.showSpinner = false;
    },
      (error) => {
        this.showSpinner = false;
      });
  }
  // #endregion

  // #region [updateScreeningItem]
  /**
   * Updates screening item - Updates the formula to database
   * @param alphaItem Built Formula
   */
  updateScreeningItem(alphaItem: AlphaItems) {
    this.showSpinner = true;
    this.subUpdateScreeningItem = this.screeningSvc.updateScreeningItem(alphaItem).subscribe((data) => {
      this.showErrorDetail(data, 'Screening Item updated');
      this.showSpinner = false;
    },
      (error) => {
        this.showSpinner = false;
      });
  }
  // #endregion

  // #region [showErrorDetail]
  /**
   * Shows error detail - Shows Error/Information message returned from database
   * @param data Return Values from database
   * @param Mode Insert/Update/Delete
   */
  showErrorDetail(data: ReturnValue, Mode: string) {
    if (data && data !== null && data.status && data.status.toString() !== '') {
      switch (data.status.toString()) {
        case 'Success':
          this.msgSvc.add({
            key: 'saveSuccess',
            sticky: true,
            severity: 'success',
            summary: 'Info Message',
            detail: Mode + ' successfully'
          });
          this.clearControls();
          break;
        case 'Error':
          this.msgSvc.add({
            key: 'saveError',
            sticky: true,
            severity: 'error',
            summary: 'Error',
            detail: 'Error Occurred'
          });
          break;
        default:
          this.msgSvc.add({
            key: 'saveError',
            sticky: true,
            severity: 'error',
            summary: 'Error',
            detail: data.statusMessage.toString()
          });
          break;
      }
    } else {
      this.msgSvc.add({
        key: 'saveError',
        sticky: true,
        severity: 'error',
        summary: 'Error',
        detail: 'Error Occurred'
      });
    }
  }
  // #endregion

  // #region [clearControls]
  /**
   * Clears controls
   */
  clearControls() {
    this.dataSvc.changeScreeningItem('New');
    this.selectedScreeningItemEdit = 'New';
    this.resetForm();
    this.lstCategory_Change(null);
  }
  // #endregion

  // #region [replaceAll]
  // this function replaces the " " with "" in the string sent to this function
  /**
   * Replaces all - Replace ' ' with ''
   * @param Ostr Dataitem
   * @returns  replaced string
   */
  replaceAll(Ostr) {
    const Ostrlen = Ostr.length;
    for (let w = 0; w < Ostrlen; w++) {
      Ostr = Ostr.replace(' ', '');
    }
    return Ostr;
  }
  // #endregion

  // #region [funTrimString]
  // trims the text containted in the object passed
  /**
   * Funs trim string - Replaces space and enter characters from input data
   * @param objStr built Formula
   */
  funTrimString(objStr) {
    const objStrVal = objStr.value;
    const len = objStrVal.length;
    const charCodeFirst = objStrVal.charCodeAt(0);
    const charCodeLast = objStrVal.charCodeAt(len - 1);
    if (charCodeFirst === 32 || charCodeFirst === 13 || charCodeFirst === 10) {
      objStr.setValue(objStrVal.substr(1, len));
      this.funTrimString(objStr);
    } else if (
      charCodeLast === 32 ||
      charCodeLast === 13 ||
      charCodeLast === 10
    ) {
      if (charCodeLast === 10) {
        objStr.setValue(objStrVal.substr(0, len - 2));
      } else {
        objStr.setValue(objStrVal.substr(0, len - 1));
      }
      this.funTrimString(objStr);
    }
  }
  // #endregion

  // #endregion
}
