import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockListComponent } from './stock-list/stock-list.component';
import { StockManagementComponent } from './stock-management.component';

const routes: Routes = [
  {
    path: '', component: StockManagementComponent, children:
      [
        { path: '', redirectTo: 'view-all', pathMatch: 'full' },
        { path: 'view-all', component: StockListComponent },
        { path: '**', redirectTo: 'view-all' }
      ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
