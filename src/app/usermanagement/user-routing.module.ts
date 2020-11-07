import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    // { path: 'userslist', component: UserlistComponent, canActivate: [AuthenticationService] },
    // { path: 'accessrights', component: AccessrightsComponent, canActivate: [AuthenticationService] },
    // { path: 'changeadmin', component: ChangeadminComponent, canActivate: [AuthenticationService] },
    // { path: 'monthdatelogreport', component: MonthtodatelogreportComponent, canActivate: [AuthenticationService] },
    // { path: 'firmsloginreport', component: FirmsloginreportComponent, canActivate: [AuthenticationService] },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class UserRoutingModule { }
