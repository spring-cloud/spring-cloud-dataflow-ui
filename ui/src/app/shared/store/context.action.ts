import { createAction, props } from '@ngrx/store';
import { ContextModel } from '../model/context.model';

export const updated = createAction(
  '[Context] update',
  props<ContextModel>()
);
