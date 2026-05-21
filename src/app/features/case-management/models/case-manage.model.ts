export interface CaseManage {
  id?: string;
  clientId: string;
  appearance: string;
  institutionDate: string;
  stateId: string;
  courtTypeId: string;
  benchId: string;
  strength?: string;
  caseCategoryId: string;
  caseTypeId: string;
  titleFirst: string;
  titleFirstPartyType: string;
  titleSecond: string;
  titleSecondPartyType: string;
  caseStageId: string;
  caseNo?: string;
  caseYear?: string;
  cisNumber?: string;
  cisYear?: string;
  cnrNo?: string;
  nextDate?: string;
  linkedWith?: string;
  decision?: CaseDecisionDetail;
}

export interface CaseDecisionDetail {
  impugnedOrderDate?: string;
  stateId?: string;
  courtTypeId?: string;
  courtDistrictId?: string;
  courtComplexId?: string;
  courtId?: string;
  caseCategoryId?: string;
  caseTypeId?: string;
  caseNo?: string;
  caseYear?: string;
  cisNumber?: string;
  cisYear?: string;
  cnrNo?: string;
  officerName?: string;
  cadreId?: string;
}
