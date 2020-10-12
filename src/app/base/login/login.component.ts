import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
import { environment } from 'src/environments/environment';
import { Authenticate } from 'src/app/_models/authentication';
import { User } from 'src/app/_models/usermanagement';
import { DataService } from 'src/app/_services/data/data.service';
import { PageRoutes } from 'src/app/_models/commoncore';
import { LoggerService } from 'src/app/_services/log/logger.service';
import { ThemeService } from 'src/app/_services/theme/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  componentName: string;

  selectedUser: User;
  userDialog = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private msgSvc: MessageService,
    private authSvc: AuthenticationService,
    private dataSvc: DataService,
    private logger: LoggerService,
    private themeSvc: ThemeService,
  ) {
    this.componentName = 'Login';
  }

  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  showSpinner = false;
  signInForm: FormGroup;

  usr: User = null;

  ngOnInit() {
    this.Initialisations();
  }

  Initialisations() {
    this.showSpinner = true;
    this.logger.info(this.componentName, 'Initialisations', 'Entry');
    localStorage.clear();
    sessionStorage.clear();
    this.dataSvc.clearData();
    sessionStorage.setItem(this.envKey.toString() + 'applicationSettings',
      JSON.stringify({ appRegion: 'Test', userId: null }));
    this.showSpinner = false;

    this.BuildFormControls();
  }

  BuildFormControls() {
    this.logger.info(this.componentName, 'BuildFormControls', 'Entry');
    this.showSpinner = true;
    this.signInForm = this.fb.group({
      ctrlUsername: ['elroi@brv-llc.com', [Validators.required]],
      ctrlPassword: ['cuzno1can', [Validators.required]]
    });
    this.showSpinner = false;
  }

  get currentFormControls() {
    return this.signInForm.controls;
  }

  hasFormErrors() {
    return !this.signInForm.valid;
  }

  hasFormErrorsForgot() {
    return !this.currentFormControls.ctrlUsername.valid;
  }

  resetForm() {
    if (this.signInForm) {
      this.signInForm.markAsPristine();
      this.signInForm.markAsUntouched();
      this.signInForm.updateValueAndValidity();
      this.signInForm.reset();
    }
  }

  loginClick() {
    this.logger.info(this.componentName, 'loginClick', 'Entry');
    if (this.signInForm.invalid) {
      return;
    } else {
      this.validateCredentials();
    }
  }

  validateCredentials() {
    this.showSpinner = true;
    this.logger.info(this.componentName, 'validateCredentials', 'Entry');
    const req: Authenticate = {
      userName: this.currentFormControls.ctrlUsername.value.toString(),
      passWord: this.currentFormControls.ctrlPassword.value.toString()
    };
    this.resetForm();
    this.logger.debug(this.componentName, 'validateCredentials', 'authenticateUser Service Call Entry');
    this.authSvc.authenticateUser(req).subscribe(
      (data) => {
        this.showSpinner = false;
        this.logger.debug(this.componentName, 'validateCredentials', 'authenticateUser Service Call Success');
        if (data !== undefined && data != null) {
          if (data.errorMsg != null && data.errorMsg !== '') {
            this.logger.debug(this.componentName, 'validateCredentials', 'Login Failed! Invalid Credentials');
            this.msgSvc.add({
              key: 'alert',
              sticky: true,
              severity: 'error',
              summary: 'Login Failed!',
              detail: 'Invalid Credentials'
            });
          } else {
            this.logger.debug(this.componentName, 'validateCredentials', 'Login Success! User Data Received');
            sessionStorage.setItem(this.envKey.toString() + 'jwtloginToken', data.token);

            sessionStorage.setItem(this.envKey.toString() + 'UserRole', data.role.toString());
            sessionStorage.setItem(this.envKey.toString() + 'fullName', data.fullName.toString());
            sessionStorage.setItem(this.envKey.toString() + 'firmName', data.firmName.toString());
            sessionStorage.setItem(this.envKey.toString() + 'organization', data.organization.toString());
            sessionStorage.setItem(this.envKey.toString() + 'userId', data.userId.toString());
            sessionStorage.setItem(this.envKey.toString() + 'isInternal', data.isInternal.toString());
            sessionStorage.setItem(this.envKey.toString() + 'loginId', data.loginId.toString());
            sessionStorage.setItem(this.envKey.toString() + 'pagination', 'true');
            sessionStorage.setItem(this.envKey.toString() + 'filter', 'true');
            sessionStorage.setItem(this.envKey.toString() + 'applicationSettings',
              JSON.stringify({ appRegion: 'Test', userId: data.fullName.toString() }));
            this.dataSvc.changeLoginId(data.loginId.toString());
            sessionStorage.setItem(this.envKey.toString() + 'theme', 'light');

            this.themeSvc.setLightTheme();
            this.router.navigate([PageRoutes.Dashboard], { skipLocationChange: false });
          }
        }
      }
    );
  }

  signUpClick() {
    this.logger.info(this.componentName, 'signUpClick', 'Entry');
    this.selectedUser = new User();
    this.selectedUser.actionType = 'Create';
    this.userDialog = true;
  }

  dialogCloseEvent($event) {
    this.logger.info(this.componentName, 'dialogCloseEvent', 'Entry');
    this.userDialog = $event;
  }

}
