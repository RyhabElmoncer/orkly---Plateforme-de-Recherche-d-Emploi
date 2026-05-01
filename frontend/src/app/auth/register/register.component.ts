import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
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
      graduationYear: formValue.graduationYear
        ? parseInt(formValue.graduationYear)
        : undefined
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/evaluation']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message || 'Une erreur est survenue. Veuillez réessayer.'
        );
      }
    });
  }
}