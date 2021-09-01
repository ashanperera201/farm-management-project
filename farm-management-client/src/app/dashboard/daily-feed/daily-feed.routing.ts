import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DailyFeedListComponent } from './daily-feed-list/daily-feed-list.component';
import { DailyFeedAddComponent } from './daily-feed-add/daily-feed-add.component';
import { DailyFeedComponent } from './daily-feed.component';

const routes: Routes = [
    {
        path: '', component: DailyFeedComponent,
        children: [
            { path: 'view-all', redirectTo: 'view-all', pathMatch: 'full' },
            { path: 'view-all', component: DailyFeedListComponent },
            { path: 'add-daily-feed', component: DailyFeedAddComponent },
            { path: '**', redirectTo: 'view-all' }
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DailyFeedRoutingModule { }
