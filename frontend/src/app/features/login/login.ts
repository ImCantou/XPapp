import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
      <label>
        Username:
        <input name="username" [(ngModel)]="username" required />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" [(ngModel)]="password" required />
      </label>
      <br />
      <button type="submit" [disabled]="!loginForm.form.valid">Send</button>
    </form>
    <p *ngIf="errorMessage" style="color:red">{{ errorMessage }}</p>
  `
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = 'Login failed.';
        console.error('Login error', err);
      }
    });
  }
}
