import { Translation } from "../../../core/models/translation.model";

export interface ProceedingType {
  id: string;
  name: string;
  code: string;
  translations: Translation[];
}
