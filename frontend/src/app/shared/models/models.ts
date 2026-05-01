// Auth models
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: string;
  city?: string;
  educationLevel?: string;
  speciality?: string;
  graduationYear?: number;
  skills?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  userId: number;
  cvScore: number;
}

// User model
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: string;
  city?: string;
  educationLevel?: string;
  speciality?: string;
  graduationYear?: number;
  skills?: string[];
  cvScore?: number;
  cvFilePath?: string;
}

// Job Offer model
export interface JobOffer {
  id: number;
  title: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  location: string;
  contractType: string;
  description: string;
  requiredSkills: string[];
  category: string;
  postedAt: string;
}

// CV Analysis model
export interface CvAnalysis {
  score: number;
  level: string;
  message: string;
  improvements: string[];
  strengths: string[];
}
