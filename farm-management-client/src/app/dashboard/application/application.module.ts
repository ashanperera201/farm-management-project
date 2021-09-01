import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ApplicationComponent } from './application.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationCardComponent } from './application-card/application-card.component';
import { ApplicationAddComponent } from './application-add/application-add.component';
import { ApplicationRoutingModule } from './application.routing';

@NgModule({
  declarations: [
    ApplicationComponent,
    ApplicationListComponent,
    ApplicationCardComponent,
    ApplicationAddComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbModule,
    NgbPaginationModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class ApplicationModule { }
