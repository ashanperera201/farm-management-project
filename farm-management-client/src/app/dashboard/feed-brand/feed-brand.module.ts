import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedBrandComponent } from './feed-brand.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FeedBrandListComponent } from './feed-brand-list/feed-brand-list.component';
import { FeedBrandCardComponent } from './feed-brand-card/feed-brand-card.component';
import { FeedBrandAddComponent } from './feed-brand-add/feed-brand-add.component';
import { FeedBrandRoutingModule } from './feed-brand.routing';

@NgModule({
  declarations: [
    FeedBrandComponent,
    FeedBrandListComponent,
    FeedBrandCardComponent,
    FeedBrandAddComponent
  ],
  imports: [
    CommonModule,
    FeedBrandRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    NgxPermissionsModule.forChild()
  ]
})
export class FeedBrandModule { }
