import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { AuthService } from '../shared/services/auth.service';
import { CvAnalysis } from '../shared/models/models';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="evaluation-page fade-in">

      <!-- Stepper Bar -->
      <div class="page-stepper">
        <div class="ps-item done">
          <span class="ps-check">✓</span>
          <span>Informations personnelles</span>
        </div>
        <div class="ps-line done"></div>
        <div class="ps-item active">
          <span class="ps-num">2</span>
          <span>Évaluation & Score</span>
        </div>
        <div class="ps-line"></div>
        <div class="ps-item">
          <span class="ps-num">3</span>
          <span>Résultat & Offres</span>
        </div>
      </div>

      <!-- Main eval card -->
      <div class="eval-grid">
        <div class="eval-card main-eval">
          <div class="eval-header">
            <div class="eval-badge">2</div>
            <div>
              <h2><span class="accent">ÉVALUATION</span> & SCORE</h2>
            </div>
          </div>

          <div class="eval-content" *ngIf="analysis()">
            <div class="score-area">
              <div class="score-ring-wrap">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="58" fill="none" stroke="#e2e8f0" stroke-width="12"/>
                  <circle cx="70" cy="70" r="58" fill="none" stroke="url(#scoreGrad)" stroke-width="12"
                    [attr.stroke-dasharray]="364"
                    [attr.stroke-dashoffset]="getOffset(analysis()!.score)"
                    stroke-linecap="round"
                    transform="rotate(-90 70 70)"/>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color:#3b82f6"/>
                      <stop offset="100%" style="stop-color:#1a3fa6"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div class="ring-overlay">
                  <span class="ring-score">{{ analysis()!.score }}</span>
                  <span class="ring-sub">/100</span>
                  <span class="ring-label">Score de compai.</span>
                </div>
              </div>

              <div class="score-details">
                <h3>{{ analysis()!.message }}</h3>
                <p class="improve-title">Mais voici les points à améliorer :</p>
                <ul class="improve-list">
                  <li *ngFor="let imp of analysis()!.improvements">
                    <span [innerHTML]="formatImprovement(imp)"></span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- CV Upload -->
            <div class="cv-upload-section">
              <h4>Analysez votre CV</h4>
              <p>Téléchargez votre CV pour une analyse plus précise et un meilleur score.</p>
              <div class="upload-zone" (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event)">
                <input #fileInput type="file" accept=".pdf,.doc,.docx" (change)="onFileSelected($event)" style="display:none">
                <div class="upload-icon">📄</div>
                <div class="upload-text">Glissez votre CV ici ou <span class="upload-link">cliquez pour parcourir</span></div>
                <div class="upload-formats">PDF, DOC, DOCX (max 10MB)</div>
              </div>
              <div *ngIf="uploadStatus()" class="upload-status" [class.success]="uploadSuccess()">
                {{ uploadStatus() }}
              </div>
            </div>
          </div>

          <div *ngIf="isLoading()" class="loading-state">
            <div class="spinner"></div>
            <p>Analyse de votre profil en cours...</p>
          </div>
        </div>

        <!-- How score is calculated -->
        <div class="score-info-card">
          <h3>Comment est calculé ton score ?</h3>
          <p class="score-info-desc">Votre score de 100 est basé sur vos informations personnelles et votre compétences.</p>
          <div class="score-factors">
            <div class="factor-item">
              <span class="factor-icon">📋</span>
              <span>Les compatibilités</span>
            </div>
            <div class="factor-item">
              <span class="factor-icon">🎯</span>
              <span>Tes préférences opérées</span>
            </div>
            <div class="factor-item">
              <span class="factor-icon">📊</span>
              <span>Les maîtrises</span>
            </div>
            <div class="factor-item">
              <span class="factor-icon">💼</span>
              <span>Les taux des offres</span>
            </div>
          </div>

          <div class="score-tips" *ngIf="analysis()">
            <h4>Points forts</h4>
            <div *ngFor="let s of analysis()!.strengths" class="tip-item">
              <span class="tip-check">✓</span>
              <span>{{ s }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA to jobs -->
      <div class="cta-section">
        <div class="cta-content">
          <h3>Prêt à postuler ?</h3>
          <p>Complète ton profil pour maximiser tes chances de succès !</p>
          <a routerLink="/dashboard/jobs" class="btn btn-primary btn-lg">Voir les offres →</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .evaluation-page { max-width: 1100px; }

    .page-stepper {
      display: flex;
      align-items: center;
      background: white;
      border-radius: 12px;
      padding: 16px 24px;
      margin-bottom: 24px;
      gap: 0;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      border: 1px solid var(--gray-100);
    }

    .ps-item {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; font-weight: 500; color: #94a3b8;
    }
    .ps-item.active { color: var(--primary); font-weight: 700; }
    .ps-item.done { color: #16a34a; }

    .ps-check, .ps-num {
      width: 24px; height: 24px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700;
    }
    .ps-check { background: #f0fdf4; color: #16a34a; }
    .ps-num { background: var(--gray-100); color: var(--gray-500); }
    .ps-item.active .ps-num { background: var(--primary); color: white; }

    .ps-line { flex: 1; height: 2px; background: var(--gray-200); margin: 0 12px; }
    .ps-line.done { background: #16a34a; }

    .eval-grid {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 20px;
      margin-bottom: 20px;
    }

    .eval-card {
      background: white;
      border-radius: 16px;
      padding: 28px;
      border: 1px solid var(--gray-100);
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }

    .eval-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--gray-100);
    }

    .eval-badge {
      width: 32px; height: 32px;
      background: var(--primary);
      color: white;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 14px;
    }

    .eval-header h2 { font-size: 18px; font-weight: 700; color: #0f172a; }
    .accent { color: var(--primary); }

    .eval-content { }

    .score-area {
      display: flex;
      gap: 28px;
      align-items: flex-start;
      margin-bottom: 28px;
    }

    .score-ring-wrap {
      position: relative;
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }

    .ring-overlay {
      position: absolute;
      text-align: center;
      display: flex; flex-direction: column; align-items: center;
    }
    .ring-score { font-size: 32px; font-weight: 800; color: #0f172a; line-height: 1; }
    .ring-sub { font-size: 16px; color: #94a3b8; }
    .ring-label { font-size: 11px; color: #94a3b8; margin-top: 2px; }

    .score-details h3 { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 12px; line-height: 1.3; }
    .improve-title { font-size: 14px; color: #64748b; margin-bottom: 10px; }

    .improve-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .improve-list li {
      font-size: 13px; color: #334155;
      display: flex; align-items: flex-start; gap: 6px;
    }
    .improve-list li::before { content: '•'; color: var(--primary); font-weight: 700; }

    .cv-upload-section {
      background: var(--gray-50);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid var(--gray-200);
    }
    .cv-upload-section h4 { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
    .cv-upload-section p { font-size: 13px; color: #64748b; margin-bottom: 16px; }

    .upload-zone {
      border: 2px dashed var(--gray-300);
      border-radius: 10px;
      padding: 28px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .upload-zone:hover { border-color: var(--primary-light); background: #f0f7ff; }
    .upload-icon { font-size: 32px; margin-bottom: 8px; }
    .upload-text { font-size: 14px; color: #475569; }
    .upload-link { color: var(--primary); font-weight: 600; }
    .upload-formats { font-size: 12px; color: #94a3b8; margin-top: 6px; }

    .upload-status { margin-top: 10px; padding: 10px 14px; border-radius: 8px; font-size: 13px; background: #fef3c7; color: #92400e; }
    .upload-status.success { background: #f0fdf4; color: #166534; }

    /* Score info card */
    .score-info-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--gray-100);
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .score-info-card h3 { font-size: 15px; font-weight: 700; margin-bottom: 8px; }
    .score-info-desc { font-size: 13px; color: #64748b; margin-bottom: 16px; line-height: 1.5; }

    .score-factors { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    .factor-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #475569; }
    .factor-icon { font-size: 16px; }

    .score-tips h4 { font-size: 14px; font-weight: 700; margin-bottom: 10px; }
    .tip-item { display: flex; align-items: flex-start; gap: 6px; font-size: 13px; color: #475569; margin-bottom: 6px; }
    .tip-check { color: #16a34a; font-weight: 700; }

    .loading-state { text-align: center; padding: 40px; }
    .spinner {
      width: 36px; height: 36px;
      border: 3px solid var(--gray-200);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .cta-section {
      background: linear-gradient(135deg, #1a3fa6 0%, #2563eb 100%);
      border-radius: 16px;
      padding: 28px 32px;
    }
    .cta-content h3 { color: white; font-size: 20px; margin-bottom: 8px; }
    .cta-content p { color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 16px; }

    @media (max-width: 900px) {
      .eval-grid { grid-template-columns: 1fr; }
      .score-area { flex-direction: column; align-items: center; }
      .page-stepper { overflow-x: auto; }
    }
  `]
})
export class EvaluationComponent implements OnInit {
  analysis = signal<CvAnalysis | null>(null);
  isLoading = signal(true);
  uploadStatus = signal('');
  uploadSuccess = signal(false);
  userId: number | null = null;

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user?.userId) {
      this.userId = user.userId;
      this.apiService.getCvAnalysis(user.userId).subscribe({
        next: (a) => { this.analysis.set(a); this.isLoading.set(false); },
        error: () => this.isLoading.set(false)
      });
    } else {
      this.isLoading.set(false);
    }
  }

  getOffset(score: number): number {
    return 364 - (score / 100) * 364;
  }

  formatImprovement(imp: string): string {
    const parts = imp.split(/(\d+\s*\/\s*\d+|[A-Z]\d+)/g);
    return parts.map((p, i) => {
      if (/\d+\s*\/\s*\d+|[A-Z]\d+/.test(p)) {
        return `<strong>${p}</strong>`;
      }
      return p;
    }).join('');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.uploadFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.uploadFile(file);
  }

  uploadFile(file: File): void {
    if (!this.userId) return;
    this.uploadStatus.set('Téléchargement en cours...');
    this.uploadSuccess.set(false);

    this.apiService.uploadCv(this.userId, file).subscribe({
      next: (a) => {
        this.analysis.set(a);
        this.uploadStatus.set('✓ CV analysé avec succès ! Score mis à jour.');
        this.uploadSuccess.set(true);
      },
      error: () => {
        this.uploadStatus.set('Erreur lors du téléchargement. Veuillez réessayer.');
      }
    });
  }
}
