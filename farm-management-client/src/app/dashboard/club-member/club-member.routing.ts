import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClubMemberComponent } from './club-member.component';
import { ClubMemberListComponent } from './club-member-list/club-member-list.component';
import { ClubMemberAddComponent } from './club-member-add/club-member-add.component';

const routes: Routes = [
    {
        path: '', component: ClubMemberComponent,
        children: [
            { path: 'view-all', redirectTo: 'view-all', pathMatch: 'full' },
            { path: 'view-all', component: ClubMemberListComponent},
            { path: 'add-club', component:  ClubMemberAddComponent},
            { path: '**', redirectTo: 'view-farms' }
        ] 
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClubMemberdRoutingModule { }
