import { UserRole } from '../../../features/auth/models/login-response.model';

export interface SystemUser {
  id: string;
  userType:string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  registeredDate: string;
  subscription?: string;
  status: boolean;
  subscriptionPlanId?: string;
  subscriptionPlanName?: string;
  featureIds: string[];
  lastLogin?: string;
}
