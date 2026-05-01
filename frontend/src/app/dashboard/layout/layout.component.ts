import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ApiService } from '../../shared/services/api.service';
import { User } from '../../shared/models/models';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="sidebarOpen()">
        <div class="sidebar-brand">
          <div class="brand-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="white" fill-opacity="0.15"/>
              <path d="M7 12a3 3 0 013-3h8a3 3 0 013 3v4a3 3 0 01-3 3h-8a3 3 0 01-3-3v-4z" stroke="white" stroke-width="1.5"/>
              <circle cx="14" cy="8" r="3" stroke="white" stroke-width="1.5"/>
            </svg>
          </div>
          <span class="brand-text">Workly</span>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-item">
            <span class="nav-icon">⊞</span>
            <span>Tableau de bord</span>
          </a>
          <a routerLink="/dashboard/profile" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">◉</span>
            <span>Mon profil</span>
          </a>
          <a routerLink="/dashboard/evaluation" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">◈</span>
            <span>Évaluations</span>
          </a>
          <a routerLink="/dashboard/jobs" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">⬡</span>
            <span>Offres</span>
          </a>
          <a routerLink="/dashboard/jobs" routerLinkActive="none" class="nav-item">
            <span class="nav-icon">⬟</span>
            <span>Entreprises</span>
          </a>
          <a routerLink="/dashboard" routerLinkActive="none" class="nav-item">
            <span class="nav-icon">✉</span>
            <span>Messages</span>
          </a>
          <a routerLink="/dashboard" routerLinkActive="none" class="nav-item">
            <span class="nav-icon">⚙</span>
            <span>Paramètres</span>
          </a>
        </nav>

        <div class="sidebar-help">
          <div class="help-icon">?</div>
          <div>
            <div class="help-title">Besoin d'aide ?</div>
            <div class="help-sub">Consulte notre FAQ,<br>et contacte notre équipe</div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="main-wrapper">
        <!-- Header -->
        <header class="header">
          <div class="header-left">
            <button class="mobile-menu-btn" (click)="sidebarOpen.set(!sidebarOpen())">☰</button>
            <nav class="header-nav">
              <a routerLink="/dashboard" class="header-nav-link">Tableau de bord</a>
              <a routerLink="/dashboard/jobs" class="header-nav-link">Offres</a>
              <a routerLink="/dashboard/jobs" class="header-nav-link">Entreprises</a>
              <a routerLink="/dashboard" class="header-nav-link">Conseils</a>
            </nav>
          </div>
          <div class="header-right">
            <button class="icon-btn" title="Notifications">
              <span>🔔</span>
              <span class="notif-dot"></span>
            </button>
            <button class="icon-btn" title="Messages">
              <span>✉</span>
            </button>
            <div class="user-menu" (click)="userMenuOpen.set(!userMenuOpen())">
              <div class="user-avatar">
                {{ getInitials() }}
              </div>
              <span class="user-name hide-mobile">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</span>
              <span>▾</span>

              <div class="dropdown-menu" *ngIf="userMenuOpen()">
                <a routerLink="/dashboard/profile" class="dropdown-item">Mon profil</a>
                <a routerLink="/dashboard/evaluation" class="dropdown-item">Évaluation</a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item danger" (click)="logout()">Se déconnecter</button>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell { display: flex; min-height: 100vh; background: #f0f4fc; }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-width);
      min-width: var(--sidebar-width);
      background: linear-gradient(180deg, #1a3fa6 0%, #0f2a6e 100%);
      display: flex;
      flex-direction: column;
      padding: 20px 0;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 20px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 8px;
    }

    .brand-logo {
      width: 36px; height: 36px;
      background: rgba(255,255,255,0.15);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }

    .brand-text { font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 20px; color: white; }

    .sidebar-nav { flex: 1; padding: 8px 12px; }

    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px;
      border-radius: 10px;
      color: rgba(255,255,255,0.65);
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      margin-bottom: 2px;
    }

    .nav-item:hover { background: rgba(255,255,255,0.08); color: white; }

    .nav-item.active {
      background: rgba(255,255,255,0.15);
      color: white;
      font-weight: 600;
    }

    .nav-icon { font-size: 16px; width: 20px; text-align: center; }

    .sidebar-help {
      margin: 16px 12px;
      padding: 14px;
      background: rgba(255,255,255,0.08);
      border-radius: 12px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }

    .help-icon {
      width: 28px; height: 28px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 13px; font-weight: 700;
      flex-shrink: 0;
    }

    .help-title { color: white; font-size: 13px; font-weight: 600; margin-bottom: 2px; }
    .help-sub { color: rgba(255,255,255,0.55); font-size: 12px; line-height: 1.4; }

    /* Header */
    .main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }

    .header {
      height: var(--header-height);
      background: white;
      border-bottom: 1px solid var(--gray-100);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }

    .header-left { display: flex; align-items: center; gap: 24px; }
    .header-right { display: flex; align-items: center; gap: 8px; }

    .header-nav { display: flex; gap: 4px; }

    .header-nav-link {
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-600);
      transition: all 0.2s;
    }
    .header-nav-link:hover { background: var(--gray-100); color: var(--gray-900); }

    .icon-btn {
      width: 36px; height: 36px;
      border: none; background: transparent;
      border-radius: 8px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
      position: relative;
      transition: background 0.2s;
    }
    .icon-btn:hover { background: var(--gray-100); }

    .notif-dot {
      position: absolute;
      top: 7px; right: 7px;
      width: 8px; height: 8px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid white;
    }

    .user-menu {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 10px;
      border-radius: 10px;
      cursor: pointer;
      position: relative;
      transition: background 0.2s;
    }
    .user-menu:hover { background: var(--gray-100); }

    .user-avatar {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px;
      font-weight: 700;
    }

    .user-name { font-size: 14px; font-weight: 600; color: var(--gray-800); }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      border: 1px solid var(--gray-100);
      min-width: 180px;
      overflow: hidden;
      z-index: 200;
    }

    .dropdown-item {
      display: block;
      padding: 10px 16px;
      font-size: 14px;
      color: var(--gray-700);
      text-decoration: none;
      cursor: pointer;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      font-family: inherit;
      transition: background 0.15s;
    }
    .dropdown-item:hover { background: var(--gray-50); }
    .dropdown-item.danger { color: #dc2626; }

    .dropdown-divider { height: 1px; background: var(--gray-100); margin: 4px 0; }

    .mobile-menu-btn {
      display: none;
      background: none; border: none; cursor: pointer;
      font-size: 20px; padding: 4px;
    }

    .main-content { flex: 1; padding: 28px; overflow-y: auto; }

    @media (max-width: 768px) {
      .sidebar { position: fixed; left: -100%; z-index: 300; transition: left 0.3s; }
      .sidebar.open { left: 0; }
      .mobile-menu-btn { display: flex; }
      .header-nav { display: none; }
      .main-content { padding: 16px; }
    }
  `]
})
export class LayoutComponent implements OnInit {
  sidebarOpen = signal(false);
  userMenuOpen = signal(false);
  currentUser = signal<any>(null);

  constructor(private authService: AuthService, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser.set(this.authService.getCurrentUser());
    this.apiService.getCurrentUser().subscribe({
      next: (user) => this.currentUser.set(user),
      error: () => {}
    });
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
