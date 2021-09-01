import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPermissionsModule } from 'ngx-permissions';
import { StockManagementComponent } from './stock-management.component';
import { StockRoutingModule } from './stock-management.routing';
import { StockListComponent } from './stock-list/stock-list.component';
import { StockAddComponent } from './stock-add/stock-add.component';

@NgModule({
  declarations: [
    StockManagementComponent,
    StockListComponent,
    StockAddComponent
  ],
  imports: [
    CommonModule,
    StockRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    NgbModule,
    NgxPermissionsModule.forChild()
  ]
})
export class StockManagementModule { }