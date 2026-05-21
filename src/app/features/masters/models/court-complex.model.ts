export interface CourtComplex {
    id: string;
    name: string;
    code: string;
    courtId: string;
    courtName?: string;
    stateId: number;
    stateName?: string;
    courtDistrictId?: string | null;
    courtDistrictName?: string;
    isVirtualComplex: boolean;
    address: string;
}