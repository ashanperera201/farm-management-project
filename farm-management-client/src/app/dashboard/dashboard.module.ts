import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgApexchartsModule } from "ng-apexcharts";
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ComponentsModule } from '../shared/components/components.module';
import { DashboardRoutingModule } from './dashboard.routing';
import { HomeComponent } from './home/home.component';
import { ClubViewWidgetComponent } from './home/club-view-widget/club-view-widget.component';
import { SalesWidgetComponent } from './home/sales-widget/sales-widget.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    ClubViewWidgetComponent,
    SalesWidgetComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ComponentsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    PerfectScrollbarModule,
    NgApexchartsModule,
    NgxPermissionsModule.forChild()
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})

export class DashboardModule { }
