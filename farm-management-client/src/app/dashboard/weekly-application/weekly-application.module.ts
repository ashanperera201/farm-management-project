import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPermissionsModule } from 'ngx-permissions';
import { WeeklyApplicationAddComponent } from './weekly-application-add/weekly-application-add.component';
import { WeeklyApplicationListComponent } from './weekly-application-list/weekly-application-list.component';
import { WeeklyApplicationComponent } from './weekly-application.component';
import { WeeklyApplicationRoutingModule } from './weekly-application.routing';

@NgModule({
  declarations: [
    WeeklyApplicationComponent,
    WeeklyApplicationListComponent,
    WeeklyApplicationAddComponent
  ],
  imports: [
    CommonModule,
    WeeklyApplicationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    NgbModule,
    NgxPermissionsModule.forChild()
  ]
})
export class WeeklyApplicationModule { }