import { AttachmentStatus } from "../enums/attachment-status.enum";

export interface AttachmentModel {
    id: string;
    fileName: string;
    fileType: string;
    size: number;
    url?: string;
    extractedText?: string;
    uploadedAt?: Date;
    status: AttachmentStatus;
}
