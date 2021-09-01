import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PercentageFeedingListComponent } from './percentage-feeding-list/percentage-feeding-list.component';
import { PercentageFeedingComponent } from './percentage-feeding.component';
import { PercentageFeedingAddComponent } from './percentage-feeding-add/percentage-feeding-add.component';

const routes: Routes = [
    {
        path: '', component: PercentageFeedingComponent,
        children: [
            { path: 'view-all', redirectTo: 'view-all', pathMatch: 'full' },
            { path: 'view-all', component: PercentageFeedingListComponent },
            { path: 'add-percentage-feeding', component: PercentageFeedingAddComponent },
            { path: '**', redirectTo: 'view-all' }
        ]       
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PercentageFeedingRoutingModule { }
