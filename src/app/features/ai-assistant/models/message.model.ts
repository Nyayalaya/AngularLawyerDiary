import { MessageStatus } from "../enums/message-status.enum";
import { MessageType } from "../enums/message-type.enum";
import { SenderType } from "../enums/sender-type.enum";
import { AttachmentModel } from "./attachment.model";
import { SuggestedActionModel } from "./suggested-action.mode";

export interface MessageModel {
     id: string;
    conversationId: string;
    sender: SenderType;
    type: MessageType;
    content: string;
    timestamp: Date;
    status: MessageStatus;
    attachments?: AttachmentModel[];
    suggestions?: SuggestedActionModel[];
    isStreaming?: boolean;
    isError?: boolean;
    metadata?: MessageMetadataModel;
}

export interface MessageMetadataModel {

    model?: string;
    tokens?: number;
    processingTime?: number;
    referencedCases?: string[];
    referencedActs?: string[];
    confidence?: number;
}
