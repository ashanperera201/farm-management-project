import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubMemberComponent } from './club-member.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ClubMemberListComponent } from './club-member-list/club-member-list.component';
import { ClubMemberAddComponent } from './club-member-add/club-member-add.component';
import { ClubMemberCardComponent } from './club-member-card/club-member-card.component';
import { ClubMemberdRoutingModule } from './club-member.routing';

@NgModule({
  declarations: [
    ClubMemberComponent,
    ClubMemberListComponent,
    ClubMemberAddComponent,
    ClubMemberCardComponent
  ],
  imports: [
    CommonModule,
    ClubMemberdRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    NgxPermissionsModule.forChild()
  ]
})

export class ClubMemberModule { }
