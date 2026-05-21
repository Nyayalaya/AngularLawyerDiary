import { Translation } from "../../../core/models/translation.model";

export interface WorkType {
  id: string;
  name: string;
  code: string;
  translations: Translation[];
}
