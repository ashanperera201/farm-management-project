import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FeedChartComponent } from './feed-chart.component';
import { FeedChartListComponent } from './feed-chart-list/feed-chart-list.component';

const routes: Routes = [
    {
        path: '', component: FeedChartListComponent,
        children: [
            { path: 'view-feedchart', redirectTo: 'view-feedchart', pathMatch: 'full' },
            { path: 'view-feedchart', component: FeedChartListComponent},
            { path: '**', redirectTo: 'view-feedchart' }
        ]       
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FeedChartRoutingModule { }
