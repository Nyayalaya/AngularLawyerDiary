export interface FormTypeModel {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  displayOrder: number;
  isactive: boolean;
}