import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimenguiModule } from '../_ui/primengui/primengui.module';
import { ScreeningRoutingModule } from './screening-routing.module';
import { DefinescreeningdataitemsComponent } from './definescreeningdataitems/definescreeningdataitems.component';
import { ViewscreeningdataitemsComponent } from './viewscreeningdataitems/viewscreeningdataitems.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PrimenguiModule,
        ScreeningRoutingModule,
    ],
    declarations: [
        DefinescreeningdataitemsComponent,
        ViewscreeningdataitemsComponent,
    ]
})
export class ScreeningModule { }
