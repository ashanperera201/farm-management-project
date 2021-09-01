import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FeedChartComponent } from './feed-chart.component';
import { FeedChartListComponent } from './feed-chart-list/feed-chart-list.component';
import { FeedChartRoutingModule } from './feed-chart.routing';

@NgModule({
  declarations: [
    FeedChartComponent,
    FeedChartListComponent
  ],
  imports: [
    CommonModule,
    FeedChartRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    NgxPermissionsModule.forChild()
  ]
})
export class FeedChartModule { }
