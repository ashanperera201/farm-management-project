import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeeklySamplingListComponent } from './weekly-sampling-list/weekly-sampling-list.component';
import { WeeklySamplingComponent } from './weekly-sampling.component';

const routes: Routes = [
  {
    path: '', component: WeeklySamplingComponent, children:
      [
        { path: '', redirectTo: 'view-all', pathMatch: 'full' },
        { path: 'view-all', component: WeeklySamplingListComponent },
        { path: '**', redirectTo: 'view-all' }
      ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeeklySamplingRoutingModule { }
