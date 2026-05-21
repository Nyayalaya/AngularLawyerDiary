import { Translation } from "../../../core/models/translation.model";

export interface Proceeding {
  id: string;
  proceedingTypeId: string;
  proceedingType?: string;
  name: string;
  code: string;
  translations: Translation[];
}
