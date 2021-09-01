import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from '../../shared/services/auth.service';
import { RegisterComponent } from '../register/register.component';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { TokenManagementService } from '../../shared/services/token-management.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  
  @BlockUI() blockUI!: NgBlockUI;
  loginForm!: FormGroup;
  signUpModal!: NgbModalRef;
  resetPasswordModal!: NgbModalRef;
  xxmodal!: NgbModalRef;
  authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private tokenManagementService: TokenManagementService,
    private router: Router) { }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm = () => {
    this.loginForm = new FormGroup({
      userNameOrEmail: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null, Validators.compose([Validators.required])),
    });
  }

  login = () => {
    if (this.loginForm.valid) {
      this.blockUI.start('Authenticating.....');
      this.authSubscription = this.authService.authenticateUser(this.loginForm.value).subscribe(userServiceResult => {
        if (userServiceResult && userServiceResult.validity) {
          const tokenData: any = userServiceResult.result;
          this.tokenManagementService.storeToken(tokenData.accessToken);
          this.router.navigate(['/dashboard/home']);
          this.blockUI.stop();
        }
      },
        () => {
          this.toastrService.error("Login Failed", "Error");
          this.blockUI.stop();
        });
    }
  }

  clearLoginForm = () => {
    this.loginForm.reset();
  }

  openSignUpPopup = () => {
    this.signUpModal = this.modalService.open(RegisterComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-xl'
    });
  }

  openResetPassword = () => {
    this.resetPasswordModal = this.modalService.open(ForgetPasswordComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md'
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
