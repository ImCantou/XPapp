import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './login.html',
	styleUrl: './login.less'
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
