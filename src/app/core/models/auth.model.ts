export interface LoginRequest 
{
  email: string;
  password: string;
}
export interface RegisterRequest {
  userType: number; // 1 = Individual (Lawyer/Client), 2 = Company (Corporate)
  individualInfoDto: IndividualInfoDto | null;
  companyInfoDto: CompanyInfoDto | null;
  email: string;
  contact: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface AuthResponse {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  isProfileComplete: boolean;
}

export interface User {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  isProfileComplete: boolean;
}



export interface IndividualInfoDto {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: number | null;
  enrollmentNumber: string;
}

export interface CompanyInfoDto {
  companyName: string;
  registrationNumber: string;
  incorporationDate: string|null; // ISO string
  gstNumber: string;
  autherizedPerson: string;
}