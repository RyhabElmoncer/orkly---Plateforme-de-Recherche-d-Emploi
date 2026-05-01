import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ApiService } from '../../shared/services/api.service';
import { CvAnalysis, JobOffer, User } from '../../shared/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-home fade-in">
      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <div class="welcome-text">
          <h1>Bonjour, {{ currentUser()?.firstName }} 👋</h1>
          <p>Voici un aperçu de votre profil et des offres recommandées.</p>
        </div>
        <div class="welcome-score" *ngIf="analysis()">
          <div class="score-badge">
            <span class="score-num">{{ analysis()!.score }}</span>
            <span class="score-denom">/100</span>
          </div>
          <div class="score-label">Score obtenu</div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">◉</div>
          <div class="stat-info">
            <div class="stat-num">{{ currentUser()?.skills?.length || 0 }}</div>
            <div class="stat-label">Compétences</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">⬡</div>
          <div class="stat-info">
            <div class="stat-num">{{ jobs().length }}</div>
            <div class="stat-label">Offres disponibles</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">◈</div>
          <div class="stat-info">
            <div class="stat-num">{{ analysis()?.score || 0 }}%</div>
            <div class="stat-label">Score CV</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">★</div>
          <div class="stat-info">
            <div class="stat-num">{{ analysis()?.improvements?.length || 0 }}</div>
            <div class="stat-label">Points à améliorer</div>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- Recommended Jobs -->
        <div class="section-card jobs-section">
          <div class="section-header">
            <h2>Offres recommandées</h2>
            <a routerLink="/dashboard/jobs" class="btn btn-outline btn-sm">Voir toutes →</a>
          </div>
          <div class="jobs-list">
            <div *ngFor="let job of jobs().slice(0,4)" class="job-item">
              <div class="job-logo" [style.background]="job.companyColor">
                {{ job.companyInitials }}
              </div>
              <div class="job-info">
                <div class="job-title">{{ job.title }}</div>
                <div class="job-company">{{ job.company }} · {{ job.location }}</div>
                <div class="job-tags">
                  <span *ngFor="let s of job.requiredSkills?.slice(0,2)" class="badge badge-blue">{{ s }}</span>
                </div>
              </div>
              <button class="btn btn-primary btn-sm">Voir l'offre</button>
            </div>
          </div>
        </div>

        <!-- CV Evaluation Summary -->
        <div class="section-card eval-section" *ngIf="analysis()">
          <div class="section-header">
            <h2>Mon évaluation</h2>
            <a routerLink="/dashboard/evaluation" class="btn btn-outline btn-sm">Détails →</a>
          </div>

          <div class="score-ring-container">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" stroke-width="10"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#2563eb" stroke-width="10"
                stroke-dasharray="314"
                [attr.stroke-dashoffset]="getDashOffset(analysis()!.score)"
                stroke-linecap="round"
                transform="rotate(-90 60 60)"/>
            </svg>
            <div class="ring-text">
              <span class="ring-score">{{ analysis()!.score }}</span>
              <span class="ring-max">/100</span>
            </div>
          </div>

          <p class="eval-message">{{ analysis()!.message }}</p>

          <div class="improvements-list">
            <div *ngFor="let imp of analysis()!.improvements?.slice(0,3)" class="improvement-item">
              <span class="bullet">•</span>
              <span>{{ imp }}</span>
            </div>
          </div>

          <a routerLink="/dashboard/evaluation" class="btn btn-primary btn-full mt-4">
            Améliorer mon profil
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-home { max-width: 1200px; }

    .welcome-banner {
      background: linear-gradient(135deg, #1a3fa6, #2563eb);
      border-radius: 16px;
      padding: 28px 32px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .welcome-banner h1 { font-size: 24px; font-weight: 800; margin-bottom: 6px; }
    .welcome-banner p { opacity: 0.8; font-size: 14px; }

    .welcome-score {
      text-align: center;
      background: rgba(255,255,255,0.15);
      border-radius: 12px;
      padding: 16px 24px;
    }
    .score-badge { display: flex; align-items: baseline; gap: 2px; }
    .score-num { font-size: 36px; font-weight: 800; }
    .score-denom { font-size: 16px; opacity: 0.7; }
    .score-label { font-size: 12px; opacity: 0.75; margin-top: 2px; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      border: 1px solid var(--gray-100);
    }

    .stat-icon {
      width: 44px; height: 44px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
    }
    .stat-icon.blue { background: #eff6ff; color: #2563eb; }
    .stat-icon.green { background: #f0fdf4; color: #16a34a; }
    .stat-icon.orange { background: #fff7ed; color: #ea580c; }
    .stat-icon.purple { background: #faf5ff; color: #7c3aed; }

    .stat-num { font-size: 22px; font-weight: 800; color: #0f172a; }
    .stat-label { font-size: 12px; color: #64748b; }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 20px;
    }

    .section-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--gray-100);
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .section-header h2 { font-size: 16px; font-weight: 700; }

    .jobs-list { display: flex; flex-direction: column; gap: 12px; }

    .job-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 10px;
      border: 1px solid var(--gray-100);
      transition: all 0.2s;
    }
    .job-item:hover { border-color: var(--primary-light); background: #f8faff; }

    .job-logo {
      width: 44px; height: 44px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px; color: white;
      flex-shrink: 0;
    }

    .job-title { font-size: 14px; font-weight: 600; color: #0f172a; }
    .job-company { font-size: 12px; color: #64748b; margin: 2px 0 6px; }
    .job-tags { display: flex; gap: 6px; }

    .job-info { flex: 1; }

    .score-ring-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 16px 0;
    }

    .ring-text {
      position: absolute;
      text-align: center;
    }
    .ring-score { font-size: 28px; font-weight: 800; color: #0f172a; }
    .ring-max { font-size: 14px; color: #94a3b8; }

    .eval-message { text-align: center; font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 16px; }

    .improvements-list { display: flex; flex-direction: column; gap: 8px; }

    .improvement-item {
      display: flex; align-items: flex-start; gap: 8px;
      font-size: 13px; color: #475569;
    }
    .bullet { color: #2563eb; font-weight: 700; }

    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .content-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 600px) {
      .welcome-banner { flex-direction: column; gap: 16px; text-align: center; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class HomeComponent implements OnInit {
  currentUser = signal<any>(null);
  jobs = signal<JobOffer[]>([]);
  analysis = signal<CvAnalysis | null>(null);

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.currentUser.set(this.authService.getCurrentUser());

    this.apiService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser.set(user);
        if (user.id) {
          this.apiService.getCvAnalysis(user.id).subscribe({
            next: (a) => this.analysis.set(a),
            error: () => {}
          });
        }
      }
    });

    this.apiService.getRecommendedJobs().subscribe({
      next: (jobs) => this.jobs.set(jobs),
      error: () => {}
    });
  }

  getDashOffset(score: number): number {
    const circumference = 2 * Math.PI * 50;
    return circumference - (score / 100) * circumference;
  }
}
