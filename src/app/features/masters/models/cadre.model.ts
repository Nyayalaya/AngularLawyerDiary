import { Translation } from "../../../core/models/translation.model";

export interface Cadre
{
  id: string;
  name: string;
  code: string;
  translations: Translation[];
}
