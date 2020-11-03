import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FielderrorsComponent } from './fielderrors/fielderrors.component';
import { FormsModule } from '@angular/forms';
import { PrimenguiModule } from '../_ui/primengui/primengui.module';
import { IncexcmodelComponent } from './incexcmodel/incexcmodel.component';

@NgModule({
    declarations: [
        FielderrorsComponent,
        IncexcmodelComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        PrimenguiModule,
    ],
    providers: [],
    exports: [
        FielderrorsComponent,
        IncexcmodelComponent
    ],
})
export class CommonCoreModule { }
