import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { PrimenguiModule } from '../_ui/primengui/primengui.module';
import { CommonCoreModule } from '../common/common.module';
import { UserlistComponent } from './userlist/userlist/userlist.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        UserRoutingModule,
        PrimenguiModule,
        CommonCoreModule,
    ],
    declarations: [

    UserlistComponent]
})
export class UserModule { }
