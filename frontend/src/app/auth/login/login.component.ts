import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-layout">
      <div class="auth-sidebar">
        <div class="sidebar-content">
          <div class="logo-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="32" fill="rgba(255,255,255,0.15)"/>
              <path d="M20 28c0-2 1.5-3.5 3.5-3.5h17c2 0 3.5 1.5 3.5 3.5v8c0 2-1.5 3.5-3.5 3.5h-17c-2 0-3.5-1.5-3.5-3.5v-8z" stroke="white" stroke-width="2" fill="none"/>
              <circle cx="32" cy="20" r="5" stroke="white" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <h1 class="brand-name">Workly</h1>
          <p class="brand-tagline">Bon retour parmi nous !</p>
          <p class="brand-subtitle">Connecte-toi pour accéder<br>à ton tableau de bord.</p>
        </div>
        <div class="sidebar-footer">
          Pas encore inscrit ? <a routerLink="/auth/register" class="register-link">S'inscrire</a>
        </div>
      </div>

      <div class="auth-main">
        <div class="auth-card fade-in-up">
          <h2 class="form-title">Se connecter</h2>
          <p class="form-subtitle">Accédez à votre espace personnel Workly.</p>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" placeholder="exemple@email.com" formControlName="email">
            </div>
            <div class="form-group">
              <label class="form-label">Mot de passe</label>
              <input type="password" class="form-control" placeholder="••••••••" formControlName="password">
            </div>

            <div *ngIf="errorMessage()" class="alert-error">
              ⚠ {{ errorMessage() }}
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-full mt-4" [disabled]="isLoading()">
              {{ isLoading() ? 'Connexion...' : 'Se connecter →' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout { display: flex; min-height: 100vh; background: #e8eef8; }
    .auth-sidebar {
      width: 280px; min-width: 280px;
      background: linear-gradient(160deg, #1a3fa6 0%, #0f2a6e 100%);
      display: flex; flex-direction: column; justify-content: space-between;
      padding: 48px 32px 32px;
    }
    .logo-icon {
      width: 80px; height: 80px;
      background: rgba(255,255,255,0.1);
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 24px;
    }
    .brand-name { font-size: 40px; font-weight: 800; color: white; margin-bottom: 12px; }
    .brand-tagline { font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.95); margin-bottom: 8px; }
    .brand-subtitle { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.6; }
    .sidebar-footer { font-size: 13px; color: rgba(255,255,255,0.6); }
    .register-link { color: #60a5fa; font-weight: 600; margin-left: 4px; text-decoration: underline; }
    .auth-main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 32px 24px; }
    .auth-card { background: white; border-radius: 20px; padding: 48px 40px; width: 100%; max-width: 460px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
    .form-title { font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
    .form-subtitle { font-size: 14px; color: #64748b; margin-bottom: 28px; }
    .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 12px 16px; border-radius: 8px; font-size: 14px; }
    .btn[disabled] { opacity: 0.6; cursor: not-allowed; }
    @media (max-width: 768px) { .auth-sidebar { display: none; } }
  `]
})
export class LoginComponent {
  isLoading = signal(false);
  errorMessage = signal('');
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Email ou mot de passe incorrect.');
      }
    });
  }
}
