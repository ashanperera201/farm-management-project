import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesPriceListComponent } from './sales-price-list/sales-price-list.component';
import { SalesPriceComponent } from './sales-price.component';

const routes: Routes = [
  {
    path: '', component: SalesPriceComponent, children:
      [
        { path: '', redirectTo: 'view-all', pathMatch: 'full' },
        { path: 'view-all', component: SalesPriceListComponent },
        { path: '**', redirectTo: 'view-all' }
      ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesPriceRoutingModule { }
