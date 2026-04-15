import { createAction, props } from '@ngrx/store';
import { CourtDistrict } from '../../models/court-district.model';

export const loadCourtDistricts = createAction(
  '[CourtDistrict] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadCourtDistrictsSuccess = createAction(
  '[CourtDistrict] Load Success',
  props<{ courtDistricts: CourtDistrict[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadCourtDistrictsFailure = createAction(
  '[CourtDistrict] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addCourtDistrict = createAction(
  '[CourtDistrict] Add',
  props<{ courtDistrict: CourtDistrict }>()
);

export const addCourtDistrictSuccess = createAction(
  '[CourtDistrict] Add Success',
  props<{ courtDistrict: CourtDistrict }>()
);

export const addCourtDistrictFailure = createAction(
  '[CourtDistrict] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateCourtDistrict = createAction(
  '[CourtDistrict] Update',
  props<{ courtDistrict: CourtDistrict }>()
);

export const updateCourtDistrictSuccess = createAction(
  '[CourtDistrict] Update Success',
  props<{ courtDistrict: CourtDistrict }>()
);

export const updateCourtDistrictFailure = createAction(
  '[CourtDistrict] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteCourtDistrict = createAction(
  '[CourtDistrict] Delete',
  props<{ id: string }>()
);

export const deleteCourtDistrictSuccess = createAction(
  '[CourtDistrict] Delete Success',
  props<{ id: string }>()
);

export const deleteCourtDistrictFailure = createAction(
  '[CourtDistrict] Delete Failure',
  props<{ error: string }>()
);

// SUBMIT BY STATE (Bulk submission)
export const submitDistrictsByState = createAction(
  '[CourtDistrict] Submit By State',
  props<{ stateId: number; districts: CourtDistrict[]; languages: any[] }>()
);

export const submitDistrictsByStateSuccess = createAction(
  '[CourtDistrict] Submit By State Success',
  props<{ courtDistricts: CourtDistrict[] }>()
);

export const submitDistrictsByStateFailure = createAction(
  '[CourtDistrict] Submit By State Failure',
  props<{ error: string }>()
);
