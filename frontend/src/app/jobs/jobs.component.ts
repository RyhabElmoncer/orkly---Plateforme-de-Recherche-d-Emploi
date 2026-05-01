import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../shared/services/api.service';
import { JobOffer } from '../shared/models/models';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="jobs-page fade-in">
      <div class="page-header">
        <div>
          <h1>Offres d'emploi</h1>
          <p class="text-muted">{{ filteredJobs().length }} offres disponibles</p>
        </div>
        <div class="header-actions">
          <input type="text" class="search-input" placeholder="🔍  Rechercher une offre..." [(ngModel)]="searchQuery" (ngModelChange)="filterJobs()">
          <select class="filter-select" [(ngModel)]="selectedCategory" (ngModelChange)="filterJobs()">
            <option value="">Toutes catégories</option>
            <option value="Développement">Développement</option>
            <option value="Marketing">Marketing</option>
            <option value="Data">Data</option>
            <option value="Design">Design</option>
            <option value="Management">Management</option>
          </select>
        </div>
      </div>

      <div *ngIf="isLoading()" class="loading-grid">
        <div *ngFor="let i of [1,2,3,4,5,6]" class="skeleton-card"></div>
      </div>

      <div class="jobs-grid" *ngIf="!isLoading()">
        <div *ngFor="let job of filteredJobs()" class="job-card" (click)="selectedJob.set(job)">
          <div class="job-card-header">
            <div class="company-logo" [style.background]="job.companyColor">
              {{ job.companyInitials }}
            </div>
            <div class="contract-badge" [class]="getContractClass(job.contractType)">
              {{ job.contractType }}
            </div>
          </div>

          <div class="job-card-body">
            <h3 class="job-title">{{ job.title }}</h3>
            <div class="job-meta">
              <span>🏢 {{ job.company }}</span>
              <span>📍 {{ job.location }}</span>
            </div>
            <p class="job-description">{{ job.description }}</p>
          </div>

          <div class="job-card-footer">
            <div class="skills-list">
              <span *ngFor="let skill of job.requiredSkills?.slice(0,3)" class="skill-pill">{{ skill }}</span>
            </div>
            <button class="btn btn-primary btn-sm">Voir l'offre</button>
          </div>
        </div>
      </div>

      <!-- Job Detail Modal -->
      <div class="modal-overlay" *ngIf="selectedJob()" (click)="selectedJob.set(null)">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="selectedJob.set(null)">✕</button>

          <div class="modal-header">
            <div class="company-logo large" [style.background]="selectedJob()!.companyColor">
              {{ selectedJob()!.companyInitials }}
            </div>
            <div>
              <h2>{{ selectedJob()!.title }}</h2>
              <p>{{ selectedJob()!.company }} · {{ selectedJob()!.location }}</p>
            </div>
          </div>

          <div class="modal-body">
            <div class="modal-badges">
              <span class="badge badge-blue">{{ selectedJob()!.contractType }}</span>
              <span class="badge badge-purple">{{ selectedJob()!.category }}</span>
            </div>

            <h4>Description</h4>
            <p>{{ selectedJob()!.description }}</p>

            <h4>Compétences requises</h4>
            <div class="skills-list">
              <span *ngFor="let s of selectedJob()!.requiredSkills" class="skill-tag selected">{{ s }}</span>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline" (click)="selectedJob.set(null)">Fermer</button>
            <button class="btn btn-primary btn-lg">Postuler maintenant →</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .jobs-page { max-width: 1200px; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      gap: 16px;
      flex-wrap: wrap;
    }
    .page-header h1 { font-size: 24px; font-weight: 800; margin-bottom: 4px; }
    .header-actions { display: flex; gap: 10px; flex-wrap: wrap; }

    .search-input {
      padding: 10px 16px;
      border: 1.5px solid var(--gray-200);
      border-radius: 10px;
      font-family: inherit;
      font-size: 14px;
      width: 260px;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-input:focus { border-color: var(--primary-light); }

    .filter-select {
      padding: 10px 14px;
      border: 1.5px solid var(--gray-200);
      border-radius: 10px;
      font-family: inherit;
      font-size: 14px;
      outline: none;
      background: white;
      cursor: pointer;
      appearance: none;
      padding-right: 28px;
    }

    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .job-card {
      background: white;
      border-radius: 14px;
      padding: 20px;
      border: 1.5px solid var(--gray-100);
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .job-card:hover { border-color: var(--primary-light); box-shadow: 0 6px 20px rgba(37,99,235,0.1); transform: translateY(-2px); }

    .job-card-header { display: flex; justify-content: space-between; align-items: flex-start; }

    .company-logo {
      width: 48px; height: 48px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 14px; color: white;
    }
    .company-logo.large { width: 60px; height: 60px; font-size: 18px; }

    .contract-badge {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-cdi { background: #f0fdf4; color: #16a34a; }
    .badge-stage { background: #eff6ff; color: #2563eb; }
    .badge-cdd { background: #fff7ed; color: #ea580c; }

    .job-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .job-meta { display: flex; gap: 12px; font-size: 12px; color: #64748b; margin-bottom: 6px; }
    .job-description { font-size: 13px; color: #64748b; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

    .job-card-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }

    .skills-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-pill { padding: 3px 10px; background: #eff6ff; color: #2563eb; border-radius: 12px; font-size: 12px; font-weight: 500; }

    .loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .skeleton-card {
      height: 220px;
      background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
      background-size: 200% 100%;
      border-radius: 14px;
      animation: shimmer 1.4s infinite;
    }
    @keyframes shimmer { to { background-position: -200% 0; } }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 1000;
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: fadeIn 0.2s ease;
    }

    .modal-card {
      background: white;
      border-radius: 20px;
      width: 100%;
      max-width: 560px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      animation: fadeInUp 0.3s cubic-bezier(0.16,1,0.3,1);
    }

    .modal-close {
      position: absolute; top: 16px; right: 16px;
      width: 32px; height: 32px;
      border: none; border-radius: 8px;
      background: var(--gray-100); cursor: pointer;
      font-size: 14px; color: #64748b;
      display: flex; align-items: center; justify-content: center;
    }

    .modal-header { display: flex; align-items: center; gap: 16px; padding: 24px 24px 0; margin-bottom: 16px; }
    .modal-header h2 { font-size: 20px; font-weight: 800; }
    .modal-header p { font-size: 14px; color: #64748b; }

    .modal-body { padding: 0 24px 16px; }
    .modal-badges { display: flex; gap: 8px; margin-bottom: 16px; }
    .modal-body h4 { font-size: 14px; font-weight: 700; margin: 16px 0 8px; }
    .modal-body p { font-size: 14px; color: #475569; line-height: 1.6; }

    .modal-footer {
      display: flex; justify-content: flex-end; gap: 12px;
      padding: 16px 24px 24px;
      border-top: 1px solid var(--gray-100);
    }
  `]
})
export class JobsComponent implements OnInit {
  jobs = signal<JobOffer[]>([]);
  filteredJobs = signal<JobOffer[]>([]);
  selectedJob = signal<JobOffer | null>(null);
  isLoading = signal(true);
  searchQuery = '';
  selectedCategory = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllJobs().subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        this.filteredJobs.set(jobs);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  filterJobs(): void {
    let filtered = this.jobs();
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.requiredSkills?.some(s => s.toLowerCase().includes(q))
      );
    }
    if (this.selectedCategory) {
      filtered = filtered.filter(j => j.category === this.selectedCategory);
    }
    this.filteredJobs.set(filtered);
  }

  getContractClass(type: string): string {
    return `contract-badge badge-${type?.toLowerCase() || 'cdi'}`;
  }
}
