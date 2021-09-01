import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPermissionsModule } from 'ngx-permissions';
import { WeeklySamplingComponent } from './weekly-sampling.component';
import { WeeklySamplingRoutingModule } from './weekly-sampling.routing';
import { WeeklySamplingListComponent } from './weekly-sampling-list/weekly-sampling-list.component';
import { WeeklySamplingAddComponent } from './weekly-sampling-add/weekly-sampling-add.component';

@NgModule({
  declarations: [
    WeeklySamplingComponent,
    WeeklySamplingListComponent,
    WeeklySamplingAddComponent
  ],
  imports: [
    CommonModule,
    WeeklySamplingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    NgbModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class WeeklySamplingModule { }