import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FarmManagementComponent } from './farm-management.component';
import { FarmListComponent } from './farm-list/farm-list.component';
import { FarmAddComponent } from './farm-add/farm-add.component';

const routes: Routes = [
    {
        path: '', component: FarmManagementComponent,
        children: [
            { path: 'view-farms', redirectTo: 'view-feedbrands', pathMatch: 'full' },
            { path: 'view-farms', component: FarmListComponent},
            { path: 'add-farms', component:  FarmAddComponent},
            { path: '**', redirectTo: 'view-farms' }
        ]    
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FarmManagementRoutingModule { }
