import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/register', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./dashboard/home/home.component').then(m => m.HomeComponent) },
      { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'evaluation', loadComponent: () => import('./evaluation/evaluation.component').then(m => m.EvaluationComponent) },
      { path: 'jobs', loadComponent: () => import('./jobs/jobs.component').then(m => m.JobsComponent) },
    ]
  },
  { path: '**', redirectTo: '/auth/register' }
];
