import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-layout">
      <!-- Left Panel -->
      <div class="auth-sidebar">
        <div class="sidebar-content">
          <div class="logo-wrapper">
            <div class="logo-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="32" fill="rgba(255,255,255,0.15)"/>
                <path d="M20 28c0-2 1.5-3.5 3.5-3.5h17c2 0 3.5 1.5 3.5 3.5v8c0 2-1.5 3.5-3.5 3.5h-17c-2 0-3.5-1.5-3.5-3.5v-8z" stroke="white" stroke-width="2" fill="none"/>
                <circle cx="32" cy="20" r="5" stroke="white" stroke-width="2" fill="none"/>
                <path d="M26 24l-4 4M38 24l4 4" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          <h1 class="brand-name">Workly</h1>
          <p class="brand-tagline">Ton avenir commence ici.</p>
          <p class="brand-subtitle">Complète tes informations<br>pour commencer.</p>
        </div>
        <div class="sidebar-footer">
          Déjà inscrit ? <a routerLink="/auth/login" class="login-link">Se connecter</a>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="auth-main">
        <div class="auth-card fade-in-up">

          <!-- Stepper -->
          <div class="stepper">
            <div class="step" [class.active]="currentStep() >= 1" [class.completed]="currentStep() > 1">
              <div class="step-circle">{{ currentStep() > 1 ? '✓' : '1' }}</div>
              <span class="step-label">Informations personnelles</span>
            </div>
            <div class="step-line" [class.completed]="currentStep() > 1"></div>
            <div class="step" [class.active]="currentStep() >= 2" [class.completed]="currentStep() > 2">
              <div class="step-circle">2</div>
              <span class="step-label">Évaluation</span>
            </div>
            <div class="step-line"></div>
            <div class="step" [class.active]="currentStep() >= 3">
              <div class="step-circle">3</div>
              <span class="step-label">Résultat & Offres</span>
            </div>
          </div>

          <h2 class="form-title">Crée ton compte</h2>
          <p class="form-subtitle">Remplis tes informations pour que Workly puisse t'accompagner.</p>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <!-- Row 1 -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Prénom</label>
                <input type="text" class="form-control" placeholder="Ex : Ahmed" formControlName="firstName"
                       [class.error]="isFieldInvalid('firstName')">
              </div>
              <div class="form-group">
                <label class="form-label">Nom</label>
                <input type="text" class="form-control" placeholder="Ex : Ben Ali" formControlName="lastName"
                       [class.error]="isFieldInvalid('lastName')">
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" placeholder="exemple@email.com" formControlName="email"
                       [class.error]="isFieldInvalid('email')">
              </div>
            </div>

            <!-- Password -->
            <div class="form-row single">
              <div class="form-group">
                <label class="form-label">Mot de passe</label>
                <input type="password" class="form-control" placeholder="••••••••" formControlName="password"
                       [class.error]="isFieldInvalid('password')">
              </div>
            </div>

            <!-- Row 2 -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date de naissance</label>
                <input type="date" class="form-control" formControlName="birthDate">
              </div>
              <div class="form-group">
                <label class="form-label">Ville</label>
                <input type="text" class="form-control" placeholder="Ex : Tunis" formControlName="city">
              </div>
              <div class="form-group">
                <label class="form-label">Niveau d'études</label>
                <select class="form-control" formControlName="educationLevel">
                  <option value="">Sélectionner votre niveau</option>
                  <option value="Bac">Bac</option>
                  <option value="Bac+2">Bac+2 (BTS/DUT)</option>
                  <option value="Bac+3">Bac+3 (Licence)</option>
                  <option value="Bac+5">Bac+5 (Master/Ingénieur)</option>
                  <option value="Doctorat">Doctorat</option>
                </select>
              </div>
            </div>

            <!-- Row 3 -->
            <div class="form-row two-col">
              <div class="form-group">
                <label class="form-label">Spécialité / Domaine</label>
                <input type="text" class="form-control" placeholder="Ex : Informatique" formControlName="speciality">
              </div>
              <div class="form-group">
                <label class="form-label">Année d'obtention</label>
                <select class="form-control" formControlName="graduationYear">
                  <option value="">Sélectionner l'année</option>
                  <option *ngFor="let y of years" [value]="y">{{ y }}</option>
                </select>
              </div>
            </div>

            <!-- Skills -->
            <div class="skills-section">
              <h3 class="skills-title">Compétences clés</h3>
              <p class="skills-subtitle">Sélectionne quelques compétences que tu maîtrises.</p>
              <div class="skills-grid">
                <span *ngFor="let skill of availableSkills"
                      class="skill-tag"
                      [class.selected]="isSkillSelected(skill)"
                      (click)="toggleSkill(skill)">
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- Error message -->
            <div *ngIf="errorMessage()" class="alert-error">
              <span>⚠</span> {{ errorMessage() }}
            </div>

            <!-- Submit -->
            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-lg" [disabled]="isLoading()">
                <span *ngIf="!isLoading()">Continuer →</span>
                <span *ngIf="isLoading()" class="loading-spinner">...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      display: flex;
      min-height: 100vh;
      background: #e8eef8;
    }

    .auth-sidebar {
      width: 280px;
      min-width: 280px;
      background: linear-gradient(160deg, #1a3fa6 0%, #0f2a6e 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 48px 32px 32px;
      position: relative;
      overflow: hidden;
    }

    .auth-sidebar::before {
      content: '';
      position: absolute;
      top: -60px;
      right: -60px;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
    }

    .auth-sidebar::after {
      content: '';
      position: absolute;
      bottom: 80px;
      left: -40px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }

    .sidebar-content { position: relative; z-index: 1; }

    .logo-wrapper {
      margin-bottom: 24px;
    }

    .logo-icon {
      width: 80px;
      height: 80px;
      background: rgba(255,255,255,0.1);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .brand-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 40px;
      font-weight: 800;
      color: white;
      letter-spacing: -1px;
      margin-bottom: 12px;
    }

    .brand-tagline {
      font-size: 16px;
      font-weight: 700;
      color: rgba(255,255,255,0.95);
      margin-bottom: 12px;
    }

    .brand-subtitle {
      font-size: 14px;
      color: rgba(255,255,255,0.65);
      line-height: 1.6;
    }

    .sidebar-footer {
      font-size: 13px;
      color: rgba(255,255,255,0.6);
      position: relative;
      z-index: 1;
    }

    .login-link {
      color: #60a5fa;
      font-weight: 600;
      margin-left: 4px;
      text-decoration: underline;
    }

    .auth-main {
      flex: 1;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 32px 24px;
      overflow-y: auto;
    }

    .auth-card {
      background: white;
      border-radius: 20px;
      padding: 40px 40px 36px;
      width: 100%;
      max-width: 720px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    }

    .form-title {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 6px;
    }

    .form-subtitle {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 28px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 4px;
    }

    .form-row.two-col {
      grid-template-columns: repeat(2, 1fr);
    }

    .form-row.single {
      grid-template-columns: 1fr;
    }

    .form-control.error {
      border-color: #ef4444;
    }

    .skills-section {
      margin-top: 20px;
      margin-bottom: 24px;
    }

    .skills-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .skills-subtitle {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 14px;
    }

    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .alert-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
    }

    .btn[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    @media (max-width: 768px) {
      .auth-sidebar { display: none; }
      .form-row { grid-template-columns: 1fr; }
      .form-row.two-col { grid-template-columns: 1fr; }
      .auth-card { padding: 24px 20px; }
    }
  `]
})
export class RegisterComponent {
  currentStep = signal(1);
  isLoading = signal(false);
  errorMessage = signal('');

  selectedSkills: string[] = [];
  years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  availableSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'UI/UX Design',
    'Marketing Digital', 'Gestion de projet', 'Communication',
    'Analyse de données', 'SQL', 'Java', 'Angular', 'TypeScript',
    'Docker', 'Git', 'Machine Learning', 'C++'
  ];

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      birthDate: [''],
      city: [''],
      educationLevel: [''],
      speciality: [''],
      graduationYear: ['']
    });
  }

  toggleSkill(skill: string): void {
    const idx = this.selectedSkills.indexOf(skill);
    if (idx > -1) {
      this.selectedSkills.splice(idx, 1);
    } else {
      this.selectedSkills.push(skill);
    }
  }

  isSkillSelected(skill: string): boolean {
    return this.selectedSkills.includes(skill);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formValue = this.registerForm.value;
    const payload = {
      ...formValue,
      skills: this.selectedSkills,
      graduationYear: formValue.graduationYear ? parseInt(formValue.graduationYear) : undefined
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/evaluation']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    });
  }
}
