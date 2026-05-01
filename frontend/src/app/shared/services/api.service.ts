import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, JobOffer, CvAnalysis } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // User
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me`);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  getCvAnalysis(userId: number): Observable<CvAnalysis> {
    return this.http.get<CvAnalysis>(`${this.apiUrl}/users/${userId}/cv-analysis`);
  }

  uploadCv(userId: number, file: File): Observable<CvAnalysis> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CvAnalysis>(`${this.apiUrl}/users/${userId}/upload-cv`, formData);
  }

  // Jobs
  getAllJobs(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/jobs`);
  }

  getRecommendedJobs(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/jobs/recommended`);
  }
}
