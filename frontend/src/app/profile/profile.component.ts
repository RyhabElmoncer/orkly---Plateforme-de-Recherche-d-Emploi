import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../shared/services/api.service';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-page fade-in">
      <div class="page-header">
        <h1>Mon Profil</h1>
        <p class="text-muted">Gérez vos informations personnelles et compétences</p>
      </div>

      <div class="profile-grid">
        <!-- Left: Avatar & Score -->
        <div class="profile-aside">
          <div class="avatar-card">
            <div class="avatar-circle">{{ getInitials() }}</div>
            <h3 class="profile-name">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</h3>
            <p class="profile-email">{{ currentUser()?.email }}</p>
            <div class="profile-location" *ngIf="currentUser()?.city">
              📍 {{ currentUser()?.city }}
            </div>

            <div class="score-display" *ngIf="currentUser()?.cvScore">
              <div class="score-circle">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" stroke-width="8"
                    [attr.stroke-dasharray]="251"
                    [attr.stroke-dashoffset]="getOffset(currentUser()?.cvScore || 0)"
                    stroke-linecap="round"
                    transform="rotate(-90 50 50)"/>
                </svg>
                <div class="score-inner">
                  <span class="score-val">{{ currentUser()?.cvScore }}</span>
                  <span class="score-unit">/100</span>
                </div>
              </div>
              <p class="score-label">Score CV</p>
            </div>
          </div>

          <!-- Skills Summary -->
          <div class="skills-card" *ngIf="currentUser()?.skills?.length">
            <h4>Compétences</h4>
            <div class="skills-tags">
              <span *ngFor="let skill of currentUser()?.skills" class="skill-tag selected">{{ skill }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Edit Form -->
        <div class="form-card">
          <div class="form-card-header">
            <h2>Informations personnelles</h2>
            <button class="btn btn-outline btn-sm" *ngIf="!isEditing()" (click)="startEdit()">✏ Modifier</button>
            <div class="edit-actions" *ngIf="isEditing()">
              <button class="btn btn-ghost btn-sm" (click)="cancelEdit()">Annuler</button>
              <button class="btn btn-primary btn-sm" (click)="saveProfile()" [disabled]="isSaving()">
                {{ isSaving() ? 'Enregistrement...' : '✓ Enregistrer' }}
              </button>
            </div>
          </div>

          <form [formGroup]="profileForm">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Prénom</label>
                <input type="text" class="form-control" formControlName="firstName" [readonly]="!isEditing()">
              </div>
              <div class="form-group">
                <label class="form-label">Nom</label>
                <input type="text" class="form-control" formControlName="lastName" [readonly]="!isEditing()">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" formControlName="email" [readonly]="true">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date de naissance</label>
                <input type="date" class="form-control" formControlName="birthDate" [readonly]="!isEditing()">
              </div>
              <div class="form-group">
                <label class="form-label">Ville</label>
                <input type="text" class="form-control" formControlName="city" [readonly]="!isEditing()">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Niveau d'études</label>
                <select class="form-control" formControlName="educationLevel" [attr.disabled]="!isEditing() ? '' : null">
                  <option value="">Sélectionner</option>
                  <option value="Bac">Bac</option>
                  <option value="Bac+2">Bac+2 (BTS/DUT)</option>
                  <option value="Bac+3">Bac+3 (Licence)</option>
                  <option value="Bac+5">Bac+5 (Master/Ingénieur)</option>
                  <option value="Doctorat">Doctorat</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Année d'obtention</label>
                <input type="number" class="form-control" formControlName="graduationYear" [readonly]="!isEditing()">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Spécialité / Domaine</label>
              <input type="text" class="form-control" formControlName="speciality" [readonly]="!isEditing()">
            </div>

            <!-- Skills editing -->
            <div class="form-group" *ngIf="isEditing()">
              <label class="form-label">Compétences clés</label>
              <div class="skills-grid">
                <span *ngFor="let skill of availableSkills"
                      class="skill-tag"
                      [class.selected]="isSkillSelected(skill)"
                      (click)="toggleSkill(skill)">
                  {{ skill }}
                </span>
              </div>
            </div>
          </form>

          <div *ngIf="successMessage()" class="alert-success">
            ✓ {{ successMessage() }}
          </div>
          <div *ngIf="errorMessage()" class="alert-error">
            ⚠ {{ errorMessage() }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { max-width: 1100px; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 800; margin-bottom: 4px; }

    .profile-grid {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 20px;
    }

    /* Aside */
    .avatar-card, .skills-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--gray-100);
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      margin-bottom: 16px;
      text-align: center;
    }

    .avatar-circle {
      width: 80px; height: 80px;
      background: linear-gradient(135deg, #1a3fa6, #2563eb);
      color: white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 28px; font-weight: 800;
      margin: 0 auto 16px;
    }

    .profile-name { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .profile-email { font-size: 13px; color: #64748b; margin-bottom: 8px; }
    .profile-location { font-size: 13px; color: #64748b; }

    .score-display { margin-top: 16px; }

    .score-circle {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .score-inner {
      position: absolute;
      display: flex;
      align-items: baseline;
      gap: 1px;
    }
    .score-val { font-size: 22px; font-weight: 800; color: #0f172a; }
    .score-unit { font-size: 12px; color: #94a3b8; }
    .score-label { font-size: 13px; color: #64748b; margin-top: 4px; }

    .skills-card { text-align: left; }
    .skills-card h4 { font-size: 14px; font-weight: 700; margin-bottom: 12px; }
    .skills-tags { display: flex; flex-wrap: wrap; gap: 8px; }

    /* Form card */
    .form-card {
      background: white;
      border-radius: 16px;
      padding: 28px;
      border: 1px solid var(--gray-100);
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }

    .form-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--gray-100);
    }
    .form-card-header h2 { font-size: 17px; font-weight: 700; }

    .edit-actions { display: flex; gap: 8px; }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-control[readonly] {
      background: var(--gray-50);
      color: var(--gray-600);
      cursor: default;
    }

    .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }

    .alert-success {
      background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;
      padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-top: 16px;
    }
    .alert-error {
      background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;
      padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-top: 16px;
    }

    @media (max-width: 768px) {
      .profile-grid { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser = signal<User | null>(null);
  isEditing = signal(false);
  isSaving = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  selectedSkills: string[] = [];

  profileForm: FormGroup;

  availableSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'UI/UX Design',
    'Marketing Digital', 'Gestion de projet', 'Communication',
    'Analyse de données', 'SQL', 'Java', 'Angular', 'TypeScript',
    'Docker', 'Git', 'Machine Learning', 'C++'
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [{ value: '', disabled: true }],
      birthDate: [''],
      city: [''],
      educationLevel: [''],
      speciality: [''],
      graduationYear: ['']
    });
  }

  ngOnInit(): void {
    this.apiService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.selectedSkills = [...(user.skills || [])];
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          birthDate: user.birthDate,
          city: user.city,
          educationLevel: user.educationLevel,
          speciality: user.speciality,
          graduationYear: user.graduationYear
        });
      }
    });
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  }

  getOffset(score: number): number {
    return 251 - (score / 100) * 251;
  }

  startEdit(): void {
    this.isEditing.set(true);
    this.profileForm.enable();
    this.profileForm.get('email')?.disable();
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.profileForm.disable();
    const user = this.currentUser();
    if (user) {
      this.selectedSkills = [...(user.skills || [])];
      this.profileForm.patchValue(user);
    }
  }

  saveProfile(): void {
    const user = this.currentUser();
    if (!user?.id) return;

    this.isSaving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const payload = {
      ...this.profileForm.getRawValue(),
      skills: this.selectedSkills
    };

    this.apiService.updateUser(user.id, payload).subscribe({
      next: (updated) => {
        this.currentUser.set(updated);
        this.isEditing.set(false);
        this.isSaving.set(false);
        this.successMessage.set('Profil mis à jour avec succès !');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set('Erreur lors de la mise à jour. Veuillez réessayer.');
      }
    });
  }

  toggleSkill(skill: string): void {
    const idx = this.selectedSkills.indexOf(skill);
    if (idx > -1) this.selectedSkills.splice(idx, 1);
    else this.selectedSkills.push(skill);
  }

  isSkillSelected(skill: string): boolean {
    return this.selectedSkills.includes(skill);
  }
}
