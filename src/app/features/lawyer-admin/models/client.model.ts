export type ClientType = 'Individual' | 'Corporate';

export interface Client {
  id: string;
  clientType: ClientType;
  name: string;
  mobile: string;
  officePhone?: string;
  email?: string;
  officeEmail?: string;
  referalBy?: string;
  registrationNo?: string;
  propertyName: string;
  address?: string;
}
