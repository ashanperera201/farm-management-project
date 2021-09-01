import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DailyFeedListComponent } from './daily-feed-list/daily-feed-list.component';
import { DailyFeedComponent } from './daily-feed.component';
import { DailyFeedRoutingModule } from './daily-feed.routing';
import { DailyFeedAddComponent } from './daily-feed-add/daily-feed-add.component';


@NgModule({
  declarations: [
    DailyFeedComponent,
    DailyFeedAddComponent,
    DailyFeedListComponent
  ],
  imports: [
    CommonModule,
    DailyFeedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    NgbModule,
    NgxPermissionsModule.forChild()
  ]
})
export class DailyFeedModule { }
