import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PondManagementComponent } from './pond-management.component';
import { PondListComponent } from './pond-list/pond-list.component';

const routes: Routes = [
    {
        path: '', component: PondManagementComponent, children:
            [
                { path: '', redirectTo: 'view-all', pathMatch: 'full' },
                { path: 'view-all', component: PondListComponent },
                { path: '**', redirectTo: 'view-all' }
            ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PondRoutingModule { }
