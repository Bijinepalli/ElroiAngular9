import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FielderrorsComponent } from './fielderrors/fielderrors.component';
import { FormsModule } from '@angular/forms';
import { PrimenguiModule } from '../_ui/primengui/primengui.module';
import { IncexcmodelComponent } from './incexcmodel/incexcmodel.component';
import { DatesComponent } from './dates/dates.component';

@NgModule({
    declarations: [
        FielderrorsComponent,
        IncexcmodelComponent,
        DatesComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        PrimenguiModule,
    ],
    providers: [],
    exports: [
        FielderrorsComponent,
        IncexcmodelComponent,
        DatesComponent
    ],
})
export class CommonCoreModule { }
