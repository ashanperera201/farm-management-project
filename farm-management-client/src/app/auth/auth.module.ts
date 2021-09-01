import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';

// ANGULAR MATERIAL IMPORTS
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth.routing';
import { AuthComponent } from './auth.component';
import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
  declarations: [
    LoginComponent,
    ForgetPasswordComponent,
    RegisterComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
