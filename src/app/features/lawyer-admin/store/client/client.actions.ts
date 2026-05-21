import { createAction, props } from '@ngrx/store';

import { Client } from '../../models/client.model';

export const loadClients = createAction(
  '[Client] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadClientsSuccess = createAction(
  '[Client] Load Success',
  props<{
    clients: Client[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>()
);

export const loadClientsFailure = createAction(
  '[Client] Load Failure',
  props<{ error: string }>()
);

export const addClient = createAction(
  '[Client] Add',
  props<{ client: Client }>()
);

export const addClientSuccess = createAction(
  '[Client] Add Success',
  props<{ client: Client }>()
);

export const addClientFailure = createAction(
  '[Client] Add Failure',
  props<{ error: string }>()
);

export const updateClient = createAction(
  '[Client] Update',
  props<{ client: Client }>()
);

export const updateClientSuccess = createAction(
  '[Client] Update Success',
  props<{ client: Client }>()
);

export const updateClientFailure = createAction(
  '[Client] Update Failure',
  props<{ error: string }>()
);

export const deleteClient = createAction(
  '[Client] Delete',
  props<{ id: string }>()
);

export const deleteClientSuccess = createAction(
  '[Client] Delete Success',
  props<{ id: string }>()
);

export const deleteClientFailure = createAction(
  '[Client] Delete Failure',
  props<{ error: string }>()
);
