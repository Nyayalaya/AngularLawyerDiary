import { ConversionType } from "../enums/conversion-type.enum";
import { ConversationContextModel } from "./conversation-context.model";
import { MessageModel } from "./message.model";

export interface ConversionModel 
{
    id: string;

    title: string;

    type: ConversionType;

    createdAt: Date;

    updatedAt?: Date;

    lastMessage?: string;

    lastMessageAt?: Date;

    messages: MessageModel[];

    context?: ConversationContextModel;

    isPinned?: boolean;
}
