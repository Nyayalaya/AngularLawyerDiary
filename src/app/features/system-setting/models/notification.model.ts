export interface NotificationSettings {
  id: string;
  userId?: string; // null for global settings
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  smsEnabled: boolean;
  telegramEnabled: boolean;
  emailAddress?: string;
  whatsappNumber?: string;
  smsNumber?: string;
  telegramChatId?: string;
  notificationTypes: NotificationType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationType {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  email: boolean;
  whatsapp: boolean;
  sms: boolean;
  telegram: boolean;
}