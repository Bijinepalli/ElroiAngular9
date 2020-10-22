import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MessageService, SelectItem, ConfirmationService } from 'primeng/api';
import { DataService } from 'src/app/_services/data/data.service';
import { ModuleTrack, ModuleNames, ReturnValue } from 'src/app/_models/commoncore';
import { CommoncoreService } from 'src/app/_services/common/commoncore.service';
import { User } from 'src/app/_models/usermanagement';
import { UsermanagementService } from 'src/app/_services/usermanagement/usermanagement.service';
import { PasswordValidator } from 'src/app/_core/_pipes/password.validator';
import { LoggerService } from 'src/app/_services/log/logger.service';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css']
})

export class CreateuserComponent implements OnInit, OnDestroy {

  /* #region  [CommonPageProperties] */
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  userId: string;

  showSpinner = false;
  displayDateFormat: string;

  isSecure = false;
  subQueryParamSubscribe: any;
  componentName: string;
  /* #endregion */

  /* #region  [PageInputOutputProperties] */
  @Input() userObject: User;
  @Input() userid: number;
  @Output() dialogEvent = new EventEmitter();
  /* #endregion */

  /* #region  [FormProperties] */
  frmUser = new FormGroup({});
  /* #endregion */

  /* #region  [ListProperties] */
  lstGenders: SelectItem[];
  lstCountries: SelectItem[];
  lstStates: SelectItem[];
  /* #endregion */

  /* #region  [PageProperties] */
  selectedUser: User;
  showSections: boolean;
  isInternalUser: boolean;
  userProfile: User;
  isEdit: boolean;
  userHeader: string;
  btnSave: string;
  /* #endregion */

  /* #region  [SubscriptionProperties] */
  subGetUserProfile: any;
  subUpdateUser: any;
  subInsertUser: any;
  /* #endregion */

  /* #region  [Constructor] */
  constructor(
    private activeRoute: ActivatedRoute,
    private commonSvc: CommoncoreService,
    private dataSvc: DataService,
    private msgSvc: MessageService,
    private confirmSvc: ConfirmationService,
    private fb: FormBuilder,
    private usermgmtservice: UsermanagementService,
    private logger: LoggerService,
  ) {
    this.componentName = 'CreateUser';
  }
  /* #endregion */

  /* #region  [LifeCycleEvent] */
  /**
   * on init-on page initialization
   */
  ngOnInit() {
    this.showSpinner = true;
    this.logger.info(this.componentName, 'ngOnInit', 'Entry');
    this.isSecure = false;
    this.dataSvc.changeModule(ModuleNames.UserManagement);
    this.dataSvc.startModule();
    this.subQueryParamSubscribe = this.activeRoute.queryParams.subscribe(params => {
      this.isSecure = false;
      this.checkSecurity();
    });
  }
  /* #endregion */

  /* #region  [CheckSecurity] */
  /**
   * Checks security
   */
  checkSecurity() {
    this.logger.info(this.componentName, 'checkSecurity', 'Entry');
    this.isSecure = true;
    if (this.isSecure) {
      this.initializations();
    }
  }
  /* #endregion */

  /* #region  [LifeCycleEvent] */
  /**
   * on destroy-clears all the subscriptions,properties
   */
  ngOnDestroy() {
    this.clearSubscriptions();
    this.clearAllProperties();
    this.updateModuleTrack();
  }
  /* #endregion */

  /* #region  [ModuleTrack] */
  /**
   * Updates module track
   */
  updateModuleTrack() {
    this.logger.info(this.componentName, 'updateModuleTrack', 'Entry');
    if (this.dataSvc.currentLoginId !== 'New') {
      const timeDiff = this.dataSvc.endModule();
      let moduleTrack: ModuleTrack;
      moduleTrack = {};
      moduleTrack.loginId = this.dataSvc.currentLoginId;
      moduleTrack.moduleName = this.dataSvc.currentModule;
      moduleTrack.totalTime = timeDiff.toString();
      this.logger.debug(this.componentName, 'updateModuleTrack', 'updateModuleTrack Service Call Entry');
      this.commonSvc.updateModuleTrack(moduleTrack).subscribe((data) => {
      },
        (error) => {
          console.log(error);
        });
    }
  }
  /* #endregion */

  /* #region  [ClearSubscriptions] */
  /**
   * Clears subscriptions-clears all the service subscriptions
   */
  clearSubscriptions() {
    this.subQueryParamSubscribe ? this.subQueryParamSubscribe.unsubscribe() : this.clear();
    this.subGetUserProfile ? this.subGetUserProfile.unsubscribe() : this.clear();
    this.subUpdateUser ? this.subUpdateUser.unsubscribe() : this.clear();
    this.subInsertUser ? this.subInsertUser.unsubscribe() : this.clear();
  }
  /**
   * Clear
   */
  clear() {
  }
  /* #endregion */

  /* #region  [ClearAllProperties] */
  /**
   * Clears all properties
   */
  clearAllProperties() {
    this.showSpinner = true;

    this.selectedUser = null;
    this.showSections = false;
    this.isInternalUser = false;
    this.userProfile = null;
    this.isEdit = false;
    this.userHeader = '';
    this.btnSave = '';

    this.showSpinner = false;
  }
  /* #endregion */

  /* #region  [Initializations] */
  /**
   * Initializations
   */
  initializations() {
    this.logger.info(this.componentName, 'Initialisations', 'Entry');
    this.clearAllProperties();
    this.showSpinner = true;
    this.btnSave = this.userObject !== undefined ? this.userObject.actionType : 'Save';
    if (this.btnSave === 'Create') {
      this.userHeader = 'User Registration';
      this.isEdit = false;
      this.showSections = true;
    } else {
      this.userHeader = 'Edit User';
      this.isEdit = true;
      this.showSections = false;
    }
    this.lstGenders = [
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' }
    ];
    this.lstCountries = [
      { label: 'Algeria', value: 'Algeria' },
      { label: 'England', value: 'England' },
      { label: 'India', value: 'India' },
      { label: 'USA', value: 'USA' },
    ];
    this.lstStates = [
      { label: 'Alabama', value: 'Alabama' },
      { label: 'Texas', value: 'Texas' }
    ];
    this.showSpinner = false;
    this.addControlsUser();
    if (this.isEdit) {
      this.getUserProfile();
    }
  }
  /* #endregion */

  /* #region  [FormEvents] */
  /**
   * Adds controls to the form and assign validations
   */
  addControlsUser() {
    this.logger.info(this.componentName, 'addControlsUser', 'Entry');
    this.frmUser.addControl('frmFirstName', new FormControl(null, Validators.required));
    this.frmUser.addControl('frmLastName', new FormControl(null, Validators.required));
    this.frmUser.addControl('frmCountry', new FormControl(null, Validators.required));
    this.frmUser.addControl('frmState', new FormControl({ value: '', disabled: true }, null));
    this.frmUser.addControl('frmZipCode', new FormControl(null, Validators.required));
    this.frmUser.addControl('frmSelectedGender', new FormControl(null, Validators.required));
    this.frmUser.addControl('frmPhone', new FormControl(null, Validators.required));
    this.frmUser.addControl('frmFax', new FormControl(null, null));
    this.frmUser.addControl('frmOccupation', new FormControl(null, null));
    this.frmUser.addControl('frmFirmName', new FormControl(null, null));
    this.frmUser.addControl('frmEmailAddress', new FormControl(null, Validators.required));
    this.frmUser.addControl('frmPassword', new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      // PasswordValidator.strong,
      PasswordValidator.validateEqualConfirmPassword]));
    this.frmUser.addControl('frmConfirmPassword', new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      // PasswordValidator.strong,
      PasswordValidator.validateEqualPassword]));
    this.frmUser.addControl('frmSecretQ', new FormControl(null, Validators.required));
    this.frmUser.addControl('frmAnswerSecretQ', new FormControl(null, Validators.required));
    this.frmUser.addControl('isInternalUser', new FormControl(null));
  }

  /**
   * Determines whether form has errors
   * @returns boolean
   */
  hasFormErrorsUser() {
    this.logger.info(this.componentName, 'hasFormErrorsUser', 'Entry');
    return !this.frmUser.valid;
  }

  /**
   * Sets data to controls when the user wants to edit
   * @param data User class with the information of selected user
   */
  setDataToControls(data: User) {
    this.logger.info(this.componentName, 'setDataToControls', 'Entry');
    this.showSpinner = true;
    // this.frmUser.controls.isInternal.disable();
    if (data.firstName !== undefined && data.firstName !== null && data.firstName.toString() !== '') {
      this.frmUser.controls.frmFirstName.setValue(data.firstName);
    }
    if (data.lastName !== undefined && data.lastName !== null && data.lastName.toString() !== '') {
      this.frmUser.controls.frmLastName.setValue(data.lastName);
    }
    if (data.country !== undefined && data.country !== null && data.country.toString() !== '') {
      this.frmUser.controls.frmCountry.setValue(data.country);
      if (this.frmUser.controls.frmCountry.value === 'USA') {
        this.frmUser.controls.frmState.enable();
      }
    }
    if (data.state !== undefined && data.state !== null && data.state.toString() !== '') {
      this.frmUser.controls.frmState.setValue(data.state);
    }
    if (data.zipCode !== undefined && data.zipCode !== null && data.zipCode.toString() !== '') {
      this.frmUser.controls.frmZipCode.setValue(data.zipCode);
    }
    if (data.phone !== undefined && data.phone !== null && data.phone.toString() !== '') {
      this.frmUser.controls.frmPhone.setValue(data.phone);
    }
    if (data.fax !== undefined && data.fax !== null && data.fax.toString() !== '') {
      this.frmUser.controls.frmFax.setValue(data.fax);
    }
    if (data.gender !== undefined && data.gender !== null && data.gender.toString() !== '') {
      this.frmUser.controls.frmSelectedGender.setValue(data.gender);
    }
    if (data.occupation !== undefined && data.occupation !== null && data.occupation.toString() !== '') {
      this.frmUser.controls.frmOccupation.setValue(data.occupation);
    }
    if (data.firmName !== undefined && data.firmName !== null && data.firmName.toString() !== '') {
      this.frmUser.controls.frmFirmName.setValue(data.firmName);
    }
    if (data.userName !== undefined && data.userName !== null && data.userName.toString() !== '') {
      this.frmUser.controls.frmEmailAddress.setValue(data.userName);
    }
    if (data.password !== undefined && data.password !== null && data.password.toString() !== '') {
      this.frmUser.controls.frmPassword.setValue(data.password);
    }
    if (data.password !== undefined && data.password !== null && data.password.toString() !== '') {
      this.frmUser.controls.frmConfirmPassword.setValue(data.password);
    }
    if (data.secretQues !== undefined && data.secretQues !== null && data.secretQues.toString() !== '') {
      this.frmUser.controls.frmSecretQ.setValue(data.secretQues);
    }
    if (data.anstoSecQues !== undefined && data.anstoSecQues !== null && data.anstoSecQues.toString() !== '') {
      this.frmUser.controls.frmAnswerSecretQ.setValue(data.anstoSecQues);
    }
    this.frmUser.controls.isInternalUser.setValue(data.isInternal);
    this.isInternalUser = data.isInternal;
    this.internalUserChange(data.isInternal);
    if (data.isInternal === false || data.isInternal === true) {
      this.showSections = false;
    }
    this.showSpinner = false;
  }
  /* #endregion */

  /* #region  [GetCalls] */
  /* #region  [GetUserProfile] */
  /**
   * Gets user profile
   */
  getUserProfile() {
    this.logger.info(this.componentName, 'getUserProfile', 'Entry');
    this.showSpinner = true;
    this.logger.debug(this.componentName, 'getUserProfile', 'getUserProfile Service Call Entry');
    this.subGetUserProfile = this.usermgmtservice.getUserProfile(this.userid).subscribe(
      (data) => {
        if (data !== undefined && data !== null && data.length > 0) {
          this.logger.debug(this.componentName, 'getUserProfile', 'Get User Profile Data');
          this.showSpinner = false;
          this.userProfile = data[0];
          this.setDataToControls(this.userProfile);
        }
      });
  }
  /* #endregion */
  /* #endregion */

  /* #region  [OnChangeEvents] */
  /**
   * Determines whether country change on and fill the dependednt controls
   */
  onCountryChange() {
    this.logger.info(this.componentName, 'onCountryChange', 'Entry');
    if (this.frmUser.controls.frmCountry.value === 'USA') {
      this.frmUser.controls.frmState.reset();
      this.frmUser.controls.frmState.enable();
    } else {
      this.frmUser.controls.frmState.disable();
      this.frmUser.controls.frmState.reset();
    }
  }

  /**
   * Internals user change
   * This in partucular to edit the user if it belongs to the type Internal
   * @param event selected user
   */
  internalUserChange(event) {
    this.logger.info(this.componentName, 'internalUserChange', 'Entry');
    if (this.isEdit) {
      this.logger.info(this.componentName, 'internalUserChange', 'Internal User Change if mode is Edit');
      this.isInternalUser = event;
      this.frmUser.controls.frmPassword.clearValidators();
      this.frmUser.controls.frmConfirmPassword.clearValidators();
    } else {
      this.logger.info(this.componentName, 'internalUserChange', 'Internal User Change if mode is Create');
      this.isInternalUser = event.checked;

      if (!this.isInternalUser) {
        this.frmUser.controls.frmPassword.setValidators([
          Validators.required,
          Validators.minLength(8),
          // PasswordValidator.strong,
          PasswordValidator.validateEqualConfirmPassword]);
        this.frmUser.controls.frmConfirmPassword.setValidators([
          Validators.required,
          Validators.minLength(8),
          // PasswordValidator.strong,
          PasswordValidator.validateEqualPassword]);
      } else {
        this.frmUser.controls.frmPassword.clearValidators();
        this.frmUser.controls.frmPassword.reset();
        this.frmUser.controls.frmConfirmPassword.clearValidators();
        this.frmUser.controls.frmConfirmPassword.reset();
      }
    }
    this.frmUser.controls.frmPassword.updateValueAndValidity();
    this.frmUser.controls.frmConfirmPassword.updateValueAndValidity();
  }
  /* #endregion */

  /* #region  [SubmitEvents] */
  /**
   * Saves user based on user inputs
   * ,the same event is used for new or update and existing user.
   */
  saveUser() {
    this.logger.info(this.componentName, 'saveUser', 'Entry');
    this.selectedUser = new User();
    if (this.isEdit) {
      this.selectedUser.userId = this.userid;
    }
    this.selectedUser.isInternal = this.isInternalUser;
    this.selectedUser.userName = this.frmUser.controls.frmEmailAddress.value.toString();
    this.selectedUser.firstName = this.frmUser.controls.frmFirstName.value.toString();
    this.selectedUser.lastName = this.frmUser.controls.frmLastName.value.toString();
    this.selectedUser.country = this.frmUser.controls.frmCountry.value.toString();
    if (this.selectedUser.country === 'USA') {
      this.selectedUser.state = this.frmUser.controls.frmState.value.toString();
    } else {
      this.selectedUser.state = '';
    }
    this.selectedUser.zipCode = this.frmUser.controls.frmZipCode.value.toString();
    this.selectedUser.phone = this.frmUser.controls.frmPhone.value.toString();
    if (this.frmUser.controls.frmFax.value !== undefined &&
      this.frmUser.controls.frmFax.value !== null &&
      this.frmUser.controls.frmFax.value !== '') {
      this.selectedUser.fax = this.frmUser.controls.frmFax.value.toString();
    } else {
      this.selectedUser.fax = '';
    }
    this.selectedUser.gender = this.frmUser.controls.frmSelectedGender.value.toString();
    if (this.frmUser.controls.frmOccupation.value !== undefined &&
      this.frmUser.controls.frmOccupation.value !== null &&
      this.frmUser.controls.frmOccupation.value !== '') {
      this.selectedUser.occupation = this.frmUser.controls.frmOccupation.value.toString();
    } else {
      this.selectedUser.occupation = '';
    }
    if (this.frmUser.controls.frmFirmName.value !== undefined &&
      this.frmUser.controls.frmFirmName.value !== null &&
      this.frmUser.controls.frmFirmName.value !== '') {
      this.selectedUser.firmName = this.frmUser.controls.frmFirmName.value.toString();
    } else {
      this.selectedUser.firmName = '';
    }
    // this.selectedUser.userName = this.frmUser.controls.frmEmailAddress.value.toString();
    if (this.frmUser.controls.frmPassword.value !== undefined &&
      this.frmUser.controls.frmPassword.value !== null &&
      this.frmUser.controls.frmPassword.value !== '') {
      this.selectedUser.password = this.frmUser.controls.frmPassword.value.toString();
    } else {
      this.selectedUser.password = '';
    }
    this.selectedUser.secretQues = this.frmUser.controls.frmSecretQ.value.toString();
    this.selectedUser.anstoSecQues = this.frmUser.controls.frmAnswerSecretQ.value.toString();
    // console.log(this.selectedUser);
    this.createUser();
  }

  /**
   * Creates user
   */
  createUser() {
    this.logger.info(this.componentName, 'createUser', 'Entry');
    if (this.isEdit) {
      this.logger.info(this.componentName, 'createUser', 'Edit Mode');
      this.logger.debug(this.componentName, 'createUser', 'updateUser Service Call');
      this.subUpdateUser = this.usermgmtservice.updateUser(this.selectedUser).subscribe(
        (data) => {
          // this.showSpinner = false;
          this.logger.debug(this.componentName, 'createUser', 'createUser Service Call Success');
          this.showErrorDetail(data, 'User updated');
          this.logger.debug(this.componentName, 'createUser', 'User Updated Successfully');
          this.dialogEvent.emit(false);
          this.isEdit = false;
        },
        (error) => {
          console.log(error);
        });
    } else {
      this.logger.debug(this.componentName, 'createUser', 'insertUser Service Call');
      this.subInsertUser = this.usermgmtservice.insertUser(this.selectedUser).subscribe(
        (data) => {
          this.logger.debug(this.componentName, 'createUser', 'insertUser Service Call Success');
          // this.showSpinner = false;
          this.showErrorDetail(data, 'User created');
          this.logger.debug(this.componentName, 'createUser', 'User created Successfully');
        },
        (error) => {
          console.log(error);
        });
    }
  }
  /* #endregion */

  /* #region  [ErrorMessageEvents] */
  /**
   * Shows error detail
   * @param data errorMessage data
   * @param Mode Create or Edit
   */
  showErrorDetail(data: ReturnValue, Mode: string) {
    this.logger.info(this.componentName, 'showErrorDetail', 'Entry');
    if (data && data !== null && data.status && data.status.toString() !== '') {
      switch (data.status.toString()) {
        case 'Success':
          this.msgSvc.add({
            key: 'saveSuccess',
            sticky: false,
            severity: 'success',
            summary: 'Info Message',
            detail: Mode + ' successfully'
          });
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
  /* #endregion */

  /* #region  [CloseEvent] */
  /**
   * Cancels user event
   */
  cancelUser() {
    this.logger.info(this.componentName, 'cancelUser', 'Entry');
    this.dialogEvent.emit(false);
  }
  /* #endregion */

}
