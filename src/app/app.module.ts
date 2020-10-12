import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { OverlayPanelModule } from 'primeng/overlaypanel';
import { LoginComponent } from './base/login/login.component';
import { PrimenguiModule } from './_ui/primengui/primengui.module';
import { ErrorsHandler } from './_core/_interceptors/errors-handler';
import { SanitizeHtmlPipe } from './_core/_pipes/sanitizeHtmlString.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SanitizeHtmlPipe,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PrimenguiModule,
    OverlayPanelModule,
    AppRoutingModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [
    AppComponent,
  ],
  providers: [{
    provide: ErrorHandler,
    useClass: ErrorsHandler,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
