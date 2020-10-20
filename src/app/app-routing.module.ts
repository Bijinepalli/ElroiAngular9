import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationService } from './_services/authentication/authentication.service';
import { LoginComponent } from './base/login/login.component';
import { MasterComponent } from './base/master/master.component';
import { DashboardComponent } from './base/dashboard/dashboard.component';


const menupath = '/menu/';
const userpath = 'user';
const portfoliopath = 'portfolio';
const screeningpath = 'screening';
const alphaspath = 'alpha';
const backtestingpath = 'backtesting';
const adminpath = 'admin/';
const samplespath = 'sample/';
const reportpath = 'reports';
const download = 'downloads';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'menu',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: menupath + 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationService] },
      // {
      //   path: userpath,
      //   loadChildren: () => import('./usermanagement/user.module').then(mod => mod.UserModule),
      //   canLoad: [AuthenticationService]
      //   // data: { preload: true }
      // }
    ], runGuardsAndResolvers: 'always',
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // enableTracing: false,
    onSameUrlNavigation: 'reload',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
