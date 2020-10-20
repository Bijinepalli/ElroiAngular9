import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationService } from '../_services/authentication/authentication.service';
import { DefinescreeningdataitemsComponent } from './definescreeningdataitems/definescreeningdataitems.component';


const routes: Routes = [
    { path: 'definescreeningdataitem', component: DefinescreeningdataitemsComponent, canActivate: [AuthenticationService] },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class ScreeningRoutingModule {

}
