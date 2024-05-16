import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { UserDataService } from '../../pages/services/Encrypt/user-data.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HeaderService } from '../../pages/services/headers.service';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/login.service';
import { AlertService } from '../../pages/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './login.component.html',
  styles: [`.login { width: 100%; min-height: 100vh; background-color: rgba(99, 98, 98, 0.156); }`]
})
export default class LoginComponent implements OnDestroy {

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  hide: boolean = true;

  loginSubscription !: Subscription;

  constructor(private headerService: HeaderService,
    private alertService: AlertService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private userData: UserDataService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
    this.spinner.hide();
  }

  login() {
    this.spinner.show();
    this.loginSubscription = this.loginService.login(this.loginForm.value).subscribe({
      next: result => {
        if (result.status) {
          this.userData.saveEmail(result.data.user);
          this.userData.saveUser(result.data.name);
          this.userData.saveRol(String(result.data.rol));
          localStorage.setItem('token', result.data.token);
          this.router.navigateByUrl('/home');
          this.headerService.getToken();
        } else {
          this.alertService.error(result.alert, []);
        }
        this.spinner.hide();
      },
      error: e => {
        this.alertService.errorApplication();
        this.spinner.hide();
      }
    });
  }

}
