import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { NotificationSettings } from '../models/notification.model';
import { NotificationSettingsService } from '../services/notification-settings.service';

@Injectable({ providedIn: 'root' })
export class NotificationSettingsFacade {
  private notificationSettingsService = inject(NotificationSettingsService);

  loadNotificationSettings(pageNumber = 1, pageSize = 1000): Observable<NotificationSettings[]> {
    return this.notificationSettingsService.getAll(pageNumber, pageSize).pipe(
      map(response => response.data ?? [])
    );
  }

  addNotificationSettings(settings: NotificationSettings): Observable<NotificationSettings> {
    return this.notificationSettingsService.create(settings);
  }

  updateNotificationSettings(settings: NotificationSettings): Observable<NotificationSettings> {
    return this.notificationSettingsService.update(settings);
  }

  deleteNotificationSettings(id: string): Observable<void> {
    return this.notificationSettingsService.deleteById(id);
  }

  saveNotificationSettings(settings: NotificationSettings): Observable<NotificationSettings> {
    return settings.id ? this.updateNotificationSettings(settings) : this.addNotificationSettings(settings);
  }
}