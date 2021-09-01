import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HarvestManagementRoutingModule } from './harvest-management-routing.module';
import { HarvestManagementComponent } from './harvest-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { HarvestListComponent } from './harvest-list/harvest-list.component';
import { HarvestAddComponent } from './harvest-add/harvest-add.component';


@NgModule({
  declarations: [
    HarvestManagementComponent,
    HarvestListComponent,
    HarvestAddComponent
  ],
  imports: [
    CommonModule,
    HarvestManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    NgbModalModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class HarvestManagementModule { }
