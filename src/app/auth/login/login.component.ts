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
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent implements OnDestroy {

  loginForm: FormGroup = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });
  hide: boolean = true;

  loginSubscription !: Subscription;

  constructor(
    private headerService: HeaderService,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private userData: UserDataService,
    private fb: FormBuilder,
    private router: Router
  ) { }

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
          Swal.fire({ icon: "error", title: result.alert, confirmButtonColor: 'red' });
        }
        this.spinner.hide();
      },
      error: e => {
        this.spinner.hide();
      }
    });
  }

}
