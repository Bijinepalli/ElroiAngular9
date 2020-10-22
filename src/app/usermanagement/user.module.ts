import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { PrimenguiModule } from '../_ui/primengui/primengui.module';
import { CommonCoreModule } from '../common/common.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        UserRoutingModule,
        PrimenguiModule,
        CommonCoreModule,
    ],
    declarations: [

    ]
})
export class UserModule { }
