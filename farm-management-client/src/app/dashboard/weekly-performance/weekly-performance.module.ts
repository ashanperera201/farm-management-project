import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { WeeklyPerformanceComponent } from './weekly-performance.component';
import { WeeklyPerformanceReportComponent } from './weekly-performance-report/weekly-performance-report.component';
import { WeeklyPerformanceShowComponent } from './weekly-performance-show/weekly-performance-show.component';
import { WeeklyPerformanceRoutingModule } from './weekly-performance.routing';
import { WeeklyPerformanceViewComponent } from './weekly-performance-view/weekly-performance-view.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    WeeklyPerformanceComponent,
    WeeklyPerformanceShowComponent,
    WeeklyPerformanceReportComponent,
    WeeklyPerformanceViewComponent
  ],
  imports: [
    CommonModule,
    WeeklyPerformanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    PerfectScrollbarModule,
    NgbModule,
    NgxPermissionsModule.forChild()
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class WeeklyPerformanceModule { }