import { Translation } from "../../../core/models/translation.model";

export interface CaseStage 
{
  id: string;
  name: string;
  code: string;
  translations: Translation[];
}