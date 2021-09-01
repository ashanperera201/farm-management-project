import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeeklyPerformanceReportComponent } from './weekly-performance-report/weekly-performance-report.component';
import { WeeklyPerformanceShowComponent } from './weekly-performance-show/weekly-performance-show.component';
import { WeeklyPerformanceComponent } from './weekly-performance.component';

const routes: Routes = [
  {
    path: '', component: WeeklyPerformanceShowComponent, children:
      [
        { path: '', redirectTo: 'view-all', pathMatch: 'full' },
        { path: 'view-all', component: WeeklyPerformanceReportComponent },
        { path: '**', redirectTo: 'view-all' }
      ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeeklyPerformanceRoutingModule { }
