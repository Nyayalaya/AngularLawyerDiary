import { Translation } from "../../../core/models/translation.model";

export interface CourtLevel 
{
  id: string;
  name: string;
  code: string;
  translations: Translation[];
}
