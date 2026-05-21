// ============================================================================
// USER PROFILE MODEL
// ============================================================================

export interface Address {
  id?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Contact {
  id?: string;
  contactType: string; // 'Phone', 'Email', 'WhatsApp', etc.
  contactValue: string;
  isVerified?: boolean;
  isDefault?: boolean;
}

export interface ProfessionalInfo {
  id?: string;
  professionalTitle: string;
  specialization: string;
  licenseNumber?: string;
  yearsOfExperience: number;
  barCouncilName?: string;
  barCouncilRegistrationNumber?: string;
  qualifications?: string;
}

export interface WorkLocation {
  id?: string;
  locationName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isDefault?: boolean;
}

export interface BillingInfo {
  id?: string;
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  billingAddress: Address;
  taxId?: string;
  companyName?: string;
}

export interface UserProfileModel {
  userId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  profileImageUrl?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  isActive: boolean;
  addresses: Address[];
  contacts: Contact[];
  professionalInfo?: ProfessionalInfo;
  workLocations: WorkLocation[];
  organizationName?: string;
  isOrganizationOwner: boolean;
  parentUserId?: string;
  role?: string;
  billingInfo?: BillingInfo;
}
