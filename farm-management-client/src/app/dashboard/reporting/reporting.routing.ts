import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportingComponent } from './reporting.component';
import { ClubMemberReportComponent } from './club-member-report/club-member-report.component';
import { ApplicationDetailReportComponent } from './application-detail-report/application-detail-report.component';
import { AwbDetailReportComponent } from './awb-detail-report/awb-detail-report.component';
import { FarmDetailReportComponent } from './farm-detail-report/farm-detail-report.component';
import { HarvestDetailReportComponent } from './harvest-detail-report/harvest-detail-report.component';
import { PercentageFeedingReportComponent } from './percentage-feeding-report/percentage-feeding-report.component';
import { PondBrandDetailReportComponent } from './pond-brand-detail-report/pond-brand-detail-report.component';
import { PondDetailReportComponent } from './pond-detail-report/pond-detail-report.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { WeeklyApplicationReportComponent } from './weekly-application-report/weekly-application-report.component';
import { WeeklySampleReportComponent } from './weekly-sample-report/weekly-sample-report.component';

const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    {
        path: '', component: ReportingComponent, children:
            [
                { path: 'application-detail', component: ApplicationDetailReportComponent },
                { path: 'awb-detail', component: AwbDetailReportComponent },
                { path: 'club-member', component: ClubMemberReportComponent },
                { path: 'farm-detail', component: FarmDetailReportComponent },
                { path: 'harvest-detail', component: HarvestDetailReportComponent },
                { path: 'percentage-feeding', component: PercentageFeedingReportComponent },
                { path: 'pond-brand-detail', component: PondBrandDetailReportComponent },
                { path: 'pond-detail', component: PondDetailReportComponent },
                { path: 'sales', component: SalesReportComponent },
                { path: 'weekly-application', component: WeeklyApplicationReportComponent },
                { path: 'weekly-sample', component: WeeklySampleReportComponent },
            ]
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportingRouterModule { }
