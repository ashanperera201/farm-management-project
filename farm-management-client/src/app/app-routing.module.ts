import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from './gaurds/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import(`./auth/auth.module`).then(m => m.AuthModule) },
  { path: 'dashboard', canActivate: [CanActivateGuard], loadChildren: () => import(`./dashboard/dashboard.module`).then(m => m.DashboardModule) },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
