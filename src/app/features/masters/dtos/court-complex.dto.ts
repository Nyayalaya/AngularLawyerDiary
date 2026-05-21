export interface CreateCourtComplexDto {
  name: string;
  code: string;
  courtId: string;
  stateId: number;
  courtDistrictId?: string | null;
  isVirtualComplex: boolean;
  address: string;
}

export type UpdateCourtComplexDto = Partial<CreateCourtComplexDto>;
