import { ConversationContextModel } from "./conversation-context.model";

export interface AiRequestModel {
     conversationId?: string;

    message: string;

    context?: ConversationContextModel;

    attachmentIds?: string[];
}
