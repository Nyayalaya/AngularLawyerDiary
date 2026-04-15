export class ApiEndpoints {
    static readonly AUTH =
        {
            LOGIN: 'Auth/login',
            REGISTER: 'Auth/register',
            REFRESH_TOKEN: 'Auth/refresh-token',
            LOGOUT:"Auth/logout"
        };

    static readonly  COURT_TYPE=
        {
            BASE_CONTROLLER_URL: 'CourtType'
        };
    static readonly  STATE=
        {
            BASE_CONTROLLER_URL: 'State'
        };
    static readonly  CASE_STAGE=
        {
            BASE_CONTROLLER_URL: 'CaseStage'
        };
    static readonly  COURT_LEVEL=
        {
            BASE_CONTROLLER_URL: 'CourtLevel'
        };
    static readonly  CASE_CATEGORY=
        {
            BASE_CONTROLLER_URL: 'CaseCategory'
        };
    static readonly  CADRE=
    {
        BASE_CONTROLLER_URL: 'Cadre'
    };
    static readonly  COURT_DISTRICT=
    {
        BASE_CONTROLLER_URL: 'CourtDistrict'
    };
}
