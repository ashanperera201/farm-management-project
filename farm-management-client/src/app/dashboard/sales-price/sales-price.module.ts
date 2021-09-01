import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SalesPriceListComponent } from './sales-price-list/sales-price-list.component';
import { SalesPriceComponent } from './sales-price.component';
import { SalesPriceRoutingModule } from './sales-price.routing';
import { SalesPriceAddComponent } from './sales-price-add/sales-price-add.component';

@NgModule({
  declarations: [
    SalesPriceComponent,
    SalesPriceListComponent,
    SalesPriceAddComponent
  ],
  imports: [
    CommonModule,
    SalesPriceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    NgbModule,
    NgxPermissionsModule.forChild()
  ]
})
export class SalesPriceModule { }