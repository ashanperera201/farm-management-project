import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PercentageFeedingRoutingModule } from './percentage-feeding.routing';
import { PercentageFeedingComponent } from './percentage-feeding.component';
import { PercentageFeedingAddComponent } from './percentage-feeding-add/percentage-feeding-add.component';
import { PercentageFeedingListComponent } from './percentage-feeding-list/percentage-feeding-list.component';

@NgModule({
  declarations: [
    PercentageFeedingComponent,
    PercentageFeedingAddComponent,
    PercentageFeedingListComponent
  ],
  imports: [
    CommonModule,
    PercentageFeedingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    NgxPermissionsModule.forChild()
  ]
})
export class PercentageFeedingModule { }
