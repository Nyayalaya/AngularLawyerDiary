export interface RegisterRequest {
  userType: number; // 1 = Individual (Lawyer/Client), 2 = Company (Corporate)
  individualInfoDto: IndividualInfoDto | null;
  companyInfoDto: CompanyInfoDto | null;
  email: string;
  contact: string;
  password: string;
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