import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { LoggedUserService } from './shared/services/logged-user.service';
import { TokenManagementService } from './shared/services/token-management.service';
import { selectUserDetails, AppState } from './redux';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  routerOnSubscription!: Subscription;

  constructor(
    private tokenManagementService: TokenManagementService,
    private router: Router,
    private loggedUserService: LoggedUserService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.checkOnRouterChange();
    this.checkOnExistsToken();
    // TODO: !! REMOVE THIS -> SAMPLE SELECTOR
    this.getUserDetails();
  }

   // TODO: !! REMOVE THIS -> SAMPLE SELECTOR
  getUserDetails = () => {
    this.store.select(selectUserDetails).subscribe(result => { 
    })
  }

  checkOnRouterChange = () => {
    this.routerOnSubscription = this.router.events.subscribe((result: any) => {
      if (result && result.url === '/auth/login') {
        const isUserLoggedIn = this.loggedUserService.isUserLoggedIn();
        if (isUserLoggedIn) {
          this.router.navigate(['/dashboard'])
        }
      }
    })
  }

  checkOnExistsToken = () => {
    const token = !!this.tokenManagementService.getItem();
    if (token) {
      this.router.navigate(['/dashboard/home']);
    } else {
      this.router.navigate(['/auth']);
    }
  }

  ngOnDestroy() {
    if (this.routerOnSubscription) {
      this.routerOnSubscription.unsubscribe();
    }
  }
}
