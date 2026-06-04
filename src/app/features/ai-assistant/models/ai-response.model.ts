export interface AiResponseModel {
     conversationId: string;

    messageId: string;

    response: string;

    type:
        | 'text'
        | 'summary'
        | 'draft'
        | 'research';

    suggestions?: string[];

    processingTime?: number;
}
