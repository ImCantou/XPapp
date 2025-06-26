import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private tokenKey = 'jwtToken';

	constructor(private http: HttpClient, private router: Router) {}

	login(username: string, password: string) {
		return this.http.post<{ token: string }>('http://localhost:3000/api/login', { username, password });
	}

	saveToken(token: string) {
		localStorage.setItem(this.tokenKey, token);
	}

	getToken(): string | null {
		return localStorage.getItem(this.tokenKey);
	}

	isAuthenticated(): boolean {
		return !!this.getToken();
	}
}
