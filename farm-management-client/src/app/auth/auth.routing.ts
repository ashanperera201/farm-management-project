import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {
        path: '', component: AuthComponent, children:
            [
                { path: '', redirectTo: 'login', pathMatch: 'full' },
                { path: 'login', component: LoginComponent },
                { path: '**', redirectTo: 'login' }
            ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {

}
