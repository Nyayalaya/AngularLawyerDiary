import { Translation } from "../../../core/models/translation.model";

export interface Work {
  id: string;
  workTypeId: string;
  workTypeName?: string;
  work: string;
  translations: Translation[];
}
