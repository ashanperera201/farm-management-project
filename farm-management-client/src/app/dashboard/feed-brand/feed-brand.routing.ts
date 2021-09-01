import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FeedBrandComponent } from './feed-brand.component';
import { FeedBrandListComponent } from './feed-brand-list/feed-brand-list.component';
import { FeedBrandAddComponent } from './feed-brand-add/feed-brand-add.component';

const routes: Routes = [
    {
        path: '', component: FeedBrandComponent,
        children: [
            { path: 'view-feedbrands', redirectTo: 'view-feedbrands', pathMatch: 'full' },
            { path: 'view-feedbrands', component: FeedBrandListComponent},
            { path: 'add-feedbrands', component:  FeedBrandAddComponent},
            { path: '**', redirectTo: 'view-feedbrands' }
        ]       
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FeedBrandRoutingModule { }
