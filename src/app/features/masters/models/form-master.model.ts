export interface FormMasterModel {
  id: string;
  formTypeId: string;
  formTypeName: string;
  name: string;
  code: string;
  description?: string | null;
}