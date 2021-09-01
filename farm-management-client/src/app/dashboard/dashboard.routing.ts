import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'club-member', loadChildren: () => import(`./club-member/club-member.module`).then(m => m.ClubMemberModule) },
            { path: 'farm-management', loadChildren: () => import(`./farm-management/farm-management.module`).then(m => m.FarmManagementModule) },
            { path: 'user-management', loadChildren: () => import(`./user-management/user-management.module`).then(m => m.UserManagementModule) },
            { path: 'pond-management', loadChildren: () => import(`./pond-management/pond-management.module`).then(m => m.PondManagementModule) },
            { path: 'feed-brand', loadChildren: () => import(`./feed-brand/feed-brand.module`).then(m => m.FeedBrandModule) },
            { path: 'applications', loadChildren: () => import(`./application/application.module`).then(m => m.ApplicationModule) },
            { path: 'stock-management', loadChildren: () => import(`./stock-management/stock-management.module`).then(m => m.StockManagementModule) },
            { path: 'weekly-sampling', loadChildren: () => import(`./weekly-sampling/weekly-sampling.module`).then(m => m.WeeklySamplingModule) },
            { path: 'percentage-feeding', loadChildren: () => import(`./percentage-feeding/percentage-feeding.module`).then(m => m.PercentageFeedingModule) },
            { path: 'daily-feed', loadChildren: () => import(`./daily-feed/daily-feed.module`).then(m => m.DailyFeedModule) },
            { path: 'feed-chart', loadChildren: () => import(`./feed-chart/feed-chart.module`).then(m => m.FeedChartModule) },
            { path: 'harvest-management', loadChildren: () => import(`./harvest-management/harvest-management.module`).then(m => m.HarvestManagementModule) },
            { path: 'weekly-application', loadChildren: () => import(`./weekly-application/weekly-application.module`).then(m => m.WeeklyApplicationModule) },
            { path: 'report-management', loadChildren: () => import(`./reporting/reporting.module`).then(m => m.ReportingModule) },
            { path: 'sales-price', loadChildren: () => import(`./sales-price/sales-price.module`).then(m => m.SalesPriceModule) },
            { path: 'weekly-performance', loadChildren: () => import(`./weekly-performance/weekly-performance.module`).then(m => m.WeeklyPerformanceModule) },
            { path: '**', redirectTo: 'home' }
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
