import { AiActionEnum } from "../enums/ai-action.enum";

export interface SuggestedActionModel
{
     label: string;
    action: AiActionEnum
    payload?: any;
}
