import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FielderrorsComponent } from './fielderrors/fielderrors.component';
import { FormsModule } from '@angular/forms';
import { PrimenguiModule } from '../_ui/primengui/primengui.module';

@NgModule({
    declarations: [
        FielderrorsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        PrimenguiModule,
    ],
    providers: [],
    exports: [
        FielderrorsComponent
    ],
})
export class CommonCoreModule { }
