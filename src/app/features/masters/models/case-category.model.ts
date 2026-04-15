import { Translation } from "../../../core/models/translation.model";

export interface CaseCategory 
{
  id: string;
  name: string;
  courtTypeId: string;
  courtTypeName?: string;
  translations: Translation[];
}
