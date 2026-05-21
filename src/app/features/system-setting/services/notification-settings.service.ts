import { Injectable } from '@angular/core';

import { ApiEndpoints } from '../../../core';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { NotificationSettings } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationSettingsService extends BaseCrudService<NotificationSettings> {
  protected endpoint = ApiEndpoints.NOTIFICATION_SETTINGS.BASE_CONTROLLER_URL;
}