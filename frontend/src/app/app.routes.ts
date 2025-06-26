import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { AuthGuard } from './features/auth/auth.guard';

export const routes: Routes = [
	{ path: 'login', component: Login },
	{ path: '', component: Home, canActivate: [AuthGuard] }, 
	{ path: '**', redirectTo: '' }
]
