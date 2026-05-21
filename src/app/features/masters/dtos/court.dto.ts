export interface CreateCourtDto {
  name: string;
  code: string;
  courtTypeId: string;
  stateId?: number | null;
  courtDistrictId?: string | null;
  isVirtualCourt: boolean;
}

export type UpdateCourtDto = Partial<CreateCourtDto>;