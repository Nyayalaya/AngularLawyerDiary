import { Routes } from '@angular/router';

import { RolesPermissionsComponent } from './components/roles-permissions/roles-permissions';
import { FeatureManagementComponent } from './components/feature-management/feature-management';
import { SubscriptionPlansComponent } from './components/subscription-plans/subscription-plans';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings';
import { DataIntegrationComponent } from './components/data-integration/data-integration';
import { SystemUsersComponent } from './components/system-users/system-users';

export const systemSettingRoutes: Routes = [
  { path: 'system-users', component: SystemUsersComponent },
  { path: 'roles-permissions', component: RolesPermissionsComponent },
  { path: 'feature-management', component: FeatureManagementComponent },
  { path: 'subscriptions', component: SubscriptionPlansComponent },
  { path: 'notification-settings', component: NotificationSettingsComponent },
  { path: 'integration', component: DataIntegrationComponent }
];
