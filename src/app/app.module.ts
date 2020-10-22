import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { OverlayPanelModule } from 'primeng/overlaypanel';
import { LoginComponent } from './base/login/login.component';
import { PrimenguiModule } from './_ui/primengui/primengui.module';
import { ErrorLogService, ErrorsHandler } from './_core/_interceptors/errors-handler';
import { SanitizeHtmlPipe } from './_core/_pipes/sanitizeHtmlString.pipe';
import { MasterComponent } from './base/master/master.component';
import { DashboardComponent } from './base/dashboard/dashboard.component';
import { SafePipe } from './_sharedPipes/safepipe';
import { HttpInterceptorHandler } from './_core/_interceptors/http-interceptor';
import { DataService } from './_services/data/data.service';
import { AuthenticationService } from './_services/authentication/authentication.service';
import { RoleaccessrightsService } from './_services/roleaccessrights/roleaccessrights.service';
import { CommoncoreService } from './_services/common/commoncore.service';
import { LoggerService } from './_services/log/logger.service';
import { LogPublishersService } from './_services/log/log-publishers.service';

import { CreateuserComponent } from './usermanagement/createuser/createuser.component';

import { CommonCoreModule } from './common/common.module';
import { UserModule } from './usermanagement/user.module';
import { ScreeningModule } from './screening/screening.module';

@NgModule({
  declarations: [
    AppComponent,
    SanitizeHtmlPipe,
    LoginComponent,
    MasterComponent,
    DashboardComponent,
    SafePipe,
    CreateuserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PrimenguiModule,
    OverlayPanelModule,
    AppRoutingModule,
    CommonCoreModule,
    UserModule,
    ScreeningModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [
    AppComponent
  ],
  providers: [{
    provide: ErrorHandler,
    useClass: ErrorsHandler,
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorHandler,
    multi: true
  }, DataService, ErrorLogService, AuthenticationService,
    RoleaccessrightsService, CommoncoreService, LoggerService,
    LogPublishersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
