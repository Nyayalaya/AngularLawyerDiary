import { Translation } from "../../../core/models/translation.model";

export interface Court {
    id: string;
    name: string;
    code: string;

    courtTypeId: string;
    courtTypeName?: string;

    stateId: number;
    stateName?: string;

    courtDistrictId?: string | null;
    courtDistrictName?: string;

    isVirtualCourt: boolean;
    translations: Translation[];
}