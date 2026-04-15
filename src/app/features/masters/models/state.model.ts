import { Translation } from "../../../core/models/translation.model";

export interface StateModel {
  id: number;
  name:string;
  code: string;
  translations: Translation[];
}
