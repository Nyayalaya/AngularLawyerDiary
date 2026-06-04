export class ApiEndpoints {
    static readonly AUTH =
        {
            LOGIN: 'Auth/login',
            REGISTER: 'Auth/register',
            REFRESH_TOKEN: 'Auth/refresh-token',
            LOGOUT: "Auth/logout"
        };

    static readonly COURT_TYPE =
        {
            BASE_CONTROLLER_URL: 'CourtType'
        };
    static readonly STATE =
        {
            BASE_CONTROLLER_URL: 'State'
        };
    static readonly CASE_STAGE =
        {
            BASE_CONTROLLER_URL: 'CaseStage'
        };
    static readonly COURT_LEVEL =
        {
            BASE_CONTROLLER_URL: 'CourtLevel'
        };
    static readonly CASE_CATEGORY =
        {
            BASE_CONTROLLER_URL: 'CaseCategory'
        };
    static readonly CADRE =
        {
            BASE_CONTROLLER_URL: 'Cadre'
        };
    static readonly CLIENT =
        {
            BASE_CONTROLLER_URL: 'Client',
            REFERRALS: 'Client/referrals'
        };
    static readonly ROLE =
        {
            BASE_CONTROLLER_URL: 'RoleManager',
            PERMISSIONS: 'RoleManager/{{role_id}}/permissions',
            UPDATE_PERMISSIONS: 'RoleManager/{{role_id}}/permissions'
        };
    static readonly CASE_MANAGEMENT =
        {
            BASE_CONTROLLER_URL: 'Case'
        };
    static readonly COURT_DISTRICT =
        {
            BASE_CONTROLLER_URL: 'CourtDistrict'
        };
    static readonly PROCEEDING_TYPE =
        {
            BASE_CONTROLLER_URL: 'ProceedingHead'
        };
    static readonly PROCEEDING =
        {
            BASE_CONTROLLER_URL: 'ProceedingSubHead'
        };
    static readonly WORK_TYPE =
        {
            BASE_CONTROLLER_URL: 'WorkMaster'
        };
    static readonly WORK =
        {
            BASE_CONTROLLER_URL: 'WorkMasterSub'
        };

    static readonly USER =
        {
            BASE_CONTROLLER_URL: 'User',
            PROFILE: 'profile/{{user_id}}',
            UPDATE_PROFILE: 'profile/{{user_id}}',
            CHANGE_PASSWORD: 'profile/{{user_id}}/change-password',
            ADDRESS: 'profile/{{user_id}}/address',
            UPDATE_ADDRESS: 'profile/{{user_id}}/address/{{address_id}}',
            DELETE_ADDRESS: 'profile/{{user_id}}/address/{{address_id}}',
            CONTACT: 'profile/{{user_id}}/contact',
            UPDATE_CONTACT: 'profile/{{user_id}}/contact/{{contact_id}}',
            DELETE_CONTACT: 'profile/{{user_id}}/contact/{{contact_id}}',
            WORK_LOCATION: 'profile/{{user_id}}/work-location',
            UPDATE_WORK_LOCATION: 'profile/{{user_id}}/work-location/{{location_id}}',
            DELETE_WORK_LOCATION: 'profile/{{user_id}}/work-location/{{location_id}}',
            BILLING: 'profile/{{user_id}}/billing',
            UPDATE_BILLING: 'profile/{{user_id}}/billing/{{billing_id}}',
            DELETE_BILLING: 'profile/{{user_id}}/billing/{{billing_id}}'
        };

    static readonly FORM =
        {
            FORMTYPE: 'form/form-type',
            FORMMASTER: 'form/form-master',
            FORMSUBTYPE: 'form/form-subtype',
            FORMTEMPLATE: 'form/form-template'
        };

    static readonly COURT =
        {
            BASE_CONTROLLER_URL: 'Court'
        };

    static readonly FEATURE =
        {
            BASE_CONTROLLER_URL: 'Feature'
        };

    static readonly SUBSCRIPTION_PLAN =
        {
            BASE_CONTROLLER_URL: 'SubscriptionPlan'
        };

    static readonly NOTIFICATION_SETTINGS =
        {
            BASE_CONTROLLER_URL: 'NotificationSettings'
        };

    static readonly DATA_INTEGRATION =
        {
            BASE_CONTROLLER_URL: 'DataIntegration',
            SYNC: 'DataIntegration/{{id}}/sync'
        };

    static readonly COURT_COMPLEX =
        {
            BASE_CONTROLLER_URL: 'CourtComplex'
        };

    static readonly SYSTEM_USERS  =
        {
            BASE_CONTROLLER_URL: 'SystemUsers'
        };  
}
