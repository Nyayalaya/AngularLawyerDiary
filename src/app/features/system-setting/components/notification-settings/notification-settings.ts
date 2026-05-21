import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

import { GenericTable, GenericFormModel } from '../../../../shared';
import { NotificationSettingsFacade } from '../../facade/notification-settings.facade';
import { NotificationSettings, NotificationType } from '../../models/notification.model';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericFormModel],
  templateUrl: './notification-settings.html',
  styleUrls: ['./notification-settings.css']
})
export class NotificationSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private notificationSettingsFacade = inject(NotificationSettingsFacade);

  notificationSettings = signal<NotificationSettings[]>([]);
  loading = signal(false);
  showSettingsForm = signal(false);
  isEditMode = signal(false);

  // Default notification types
  defaultNotificationTypes: NotificationType[] = [
    { id: '1', name: 'Case Updates', description: 'Notifications for case status changes', enabled: true, email: true, whatsapp: false, sms: false, telegram: false },
    { id: '2', name: 'Payment Reminders', description: 'Reminders for upcoming payments', enabled: true, email: true, whatsapp: true, sms: true, telegram: false },
    { id: '3', name: 'System Alerts', description: 'Important system notifications', enabled: true, email: true, whatsapp: false, sms: false, telegram: true },
    { id: '4', name: 'Appointment Reminders', description: 'Court date and appointment reminders', enabled: true, email: true, whatsapp: true, sms: true, telegram: true }
  ];

  settingsForm: FormGroup = this.fb.group({
    id: [''],
    emailEnabled: [false],
    whatsappEnabled: [false],
    smsEnabled: [false],
    telegramEnabled: [false],
    emailAddress: ['', [Validators.email]],
    whatsappNumber: [''],
    smsNumber: [''],
    telegramChatId: [''],
    notificationTypes: this.fb.array([])
  });

  columns = [
    { key: 'id', label: 'Id', isKey: true },
    { key: 'emailEnabled', label: 'Email', type: 'boolean' },
    { key: 'whatsappEnabled', label: 'WhatsApp', type: 'boolean' },
    { key: 'smsEnabled', label: 'SMS', type: 'boolean' },
    { key: 'telegramEnabled', label: 'Telegram', type: 'boolean' }
  ];

  ngOnInit(): void {
    this.loadNotificationSettings();
  }

  get notificationTypesFormArray(): FormArray<FormGroup> {
    return this.settingsForm.get('notificationTypes') as FormArray<FormGroup>;
  }

  loadNotificationSettings(): void {
    this.loading.set(true);
    this.notificationSettingsFacade.loadNotificationSettings().subscribe({
      next: settings => {
        this.notificationSettings.set(settings);
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        Swal.fire('Error', error.message ?? 'Unable to load notification settings.', 'error');
      }
    });
  }

  openAddSettings(): void {
    this.isEditMode.set(false);
    this.settingsForm.reset({
      id: '',
      emailEnabled: false,
      whatsappEnabled: false,
      smsEnabled: false,
      telegramEnabled: false,
      emailAddress: '',
      whatsappNumber: '',
      smsNumber: '',
      telegramChatId: ''
    });

    // Initialize notification types
    this.notificationTypesFormArray.clear();
    this.defaultNotificationTypes.forEach(type => {
      this.notificationTypesFormArray.push(this.createNotificationTypeFormGroup(type));
    });

    this.showSettingsForm.set(true);
  }

  onEdit(settings: NotificationSettings): void {
    this.isEditMode.set(true);
    this.settingsForm.patchValue({
      id: settings.id,
      emailEnabled: settings.emailEnabled,
      whatsappEnabled: settings.whatsappEnabled,
      smsEnabled: settings.smsEnabled,
      telegramEnabled: settings.telegramEnabled,
      emailAddress: settings.emailAddress || '',
      whatsappNumber: settings.whatsappNumber || '',
      smsNumber: settings.smsNumber || '',
      telegramChatId: settings.telegramChatId || ''
    });

    // Initialize notification types
    this.notificationTypesFormArray.clear();
    const typesToUse = settings.notificationTypes?.length ? settings.notificationTypes : this.defaultNotificationTypes;
    typesToUse.forEach(type => {
      this.notificationTypesFormArray.push(this.createNotificationTypeFormGroup(type));
    });

    this.showSettingsForm.set(true);
  }

  createNotificationTypeFormGroup(type: NotificationType): FormGroup {
    return this.fb.group({
      id: [type.id],
      name: [type.name],
      description: [type.description],
      enabled: [type.enabled],
      email: [type.email],
      whatsapp: [type.whatsapp],
      sms: [type.sms],
      telegram: [type.telegram]
    });
  }

  onDelete(settings: NotificationSettings): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete these notification settings?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.notificationSettingsFacade.deleteNotificationSettings(settings.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Notification settings have been deleted.', 'success');
            this.loadNotificationSettings();
          },
          error: error => Swal.fire('Error', error.message ?? 'Unable to delete notification settings.', 'error')
        });
      }
    });
  }

  saveSettings(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    const settings = {
      ...this.settingsForm.getRawValue(),
      notificationTypes: this.notificationTypesFormArray.value
    } as NotificationSettings;

    this.notificationSettingsFacade.saveNotificationSettings(settings).subscribe({
      next: () => {
        Swal.fire('Success', `Notification settings ${settings.id ? 'updated' : 'created'} successfully.`, 'success');
        this.showSettingsForm.set(false);
        this.loadNotificationSettings();
      },
      error: error => Swal.fire('Error', error.message ?? 'Unable to save notification settings.', 'error')
    });
  }

  getNotificationTypeControl(index: number, controlName: string): FormControl {
    return this.notificationTypesFormArray.at(index).get(controlName) as FormControl;
  }
}