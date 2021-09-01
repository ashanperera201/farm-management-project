import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FarmManagementComponent} from '../farm-management/farm-management.component';
import {FarmListComponent} from '../farm-management/farm-list/farm-list.component';
import {FarmAddComponent} from '../farm-management/farm-add/farm-add.component';
import {HarvestManagementComponent} from './harvest-management.component';
import {HarvestListComponent} from './harvest-list/harvest-list.component';

const routes: Routes = [
  {
    path: '', component: HarvestManagementComponent,
    children: [
      { path: 'view-harvest', component: HarvestListComponent},
      { path: '**', redirectTo: 'view-harvest' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HarvestManagementRoutingModule { }
