import { RecordService } from '../../shared/api/record.service';
import { DateTime } from 'luxon';
import { Observable, of } from 'rxjs';
import { RecordActionType, RecordOperationType, RecordPage } from '../../shared/model/record.model';
import { catchError, delay, map } from 'rxjs/operators';
import { ErrorUtils } from '../../shared/support/error.utils';
import { GET_ACTION_TYPES, GET_OPERATION_TYPES, GET_RECORDS } from '../data/record';

export class RecordServiceMock {

  static mock: RecordServiceMock = null;

  getRecords(page: number, size: number, search?: string, action?: string, operation?: string, fromDate?: DateTime,
             toDate?: DateTime, sort?: string, order?: string): Observable<RecordPage> {
    return of(GET_RECORDS)
      .pipe(
        delay(1),
        map(RecordPage.parse),
        catchError(ErrorUtils.catchError)
      );
  }

  getOperationTypes(): Observable<RecordOperationType[]> {
    return of(GET_OPERATION_TYPES)
      .pipe(
        delay(1),
        map(items => {
          return items.map(RecordOperationType.parse);
        }),
      );
  }

  getActionTypes(): Observable<RecordActionType[]> {
    return of(GET_ACTION_TYPES)
      .pipe(
        delay(1),
        map(items => {
          return items.map(RecordActionType.parse);
        }),
      );
  }

  static get provider() {
    if (!RecordServiceMock.mock) {
      RecordServiceMock.mock = new RecordServiceMock();
    }
    return { provide: RecordService, useValue: RecordServiceMock.mock };
  }

}
