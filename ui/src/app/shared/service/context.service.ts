import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { contextFeatureKey, getContext, getContexts, State } from '../store/context.reducer';
import { updated } from '../store/context.action';
import { ContextModel } from '../model/context.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContextService {

  constructor(private store: Store<State>) {
  }

  dispatch(context: ContextModel): void {
    this.store.dispatch(updated(context));
  }

  getContext(name: string): Observable<ContextModel[]> {
    return this.store.pipe(
      select((state) => getContext(state[contextFeatureKey], name) as ContextModel[] || [])
    );
  }

  getContexts(): Observable<ContextModel[]> {
    return this.store.pipe(select(getContexts));
  }

  updateContext(name: string, contexts: ContextModel[]) {
    this.store.dispatch(updated({ name, value: contexts }));
  }

}
