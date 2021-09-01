import { ApplicationComponent } from './application.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationAddComponent } from './application-add/application-add.component';

const routes: Routes = [
{
    path : '', component : ApplicationComponent,
    children : [
        { path: 'view-applications', redirectTo: 'view-applications', pathMatch: 'full' },
        { path: 'view-applications', component: ApplicationListComponent},
        { path: 'add-applications', component:  ApplicationAddComponent},
        { path: '**', redirectTo: 'view-applications' }
    ]
}
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ApplicationRoutingModule { }
