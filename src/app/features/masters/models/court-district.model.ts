import { Translation } from "../../../core/models/translation.model";

export interface CourtDistrict
{
  id: string;
  name: string;
  stateId: number;
  stateName?: string;
  translations: Translation[];
}
