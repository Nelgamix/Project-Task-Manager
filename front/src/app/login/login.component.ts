import { Component } from '@angular/core';
import {AuthService} from '../auth.service';
import {ApiService, IUserCreate} from '../api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading = false;
  error: string;

  loginName = '';
  loginPassword = '';

  registerForm: IUserCreate = {
    name: '',
    displayName: '',
    email: '',
    password: ''
  };
  confirmPassword = '';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {
  }

  login(): void {
    this.setLoading(true);
    this.auth.login(this.loginName, this.loginPassword).subscribe((ok) => {
      if (ok) {
        this.setLoading(false);
        this.router.navigate(['/home']);
      } else {
        this.setLoading(false, 'Incorrect name or password');
        this.loginPassword = '';
      }
    });
  }

  register(): void {
    if (!this.registerForm.name || !this.registerForm.displayName || !this.registerForm.email) {
      this.error = 'You must specify a name, a display name and an email.';
      return;
    }

    if (!this.registerForm.password || this.registerForm.password.length < 4) {
      this.error = 'Password must be at least 4 characters long.';
      return;
    }

    if (this.registerForm.password !== this.confirmPassword) {
      this.error = 'Password does not match.';
      return;
    }

    this.setLoading(true);
    this.api.createUser(this.registerForm).subscribe(user => {
      if (user) {
        this.auth.login(user.name, this.registerForm.password).subscribe(ok => {
          if (ok) {
            this.setLoading(false);
            this.router.navigate(['home']);
          } else {
            this.setLoading(false, 'Account was created, but could not login. Please login manually.');
          }
        });
      } else {
        this.setLoading(false, 'User could not be created. Please try again.');
      }
    }, err => {
      this.setLoading(false, 'User could not be created. Please try again.');
    });
  }

  private setLoading(isLoading: boolean, error?: string): void {
    this.loading = isLoading;
    this.error = error;
  }
}
