import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {AppsService} from '../apps.service';
import {ToastyService} from 'ng2-toasty';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AppsBulkImportValidator} from './apps-bulk-import.validator';
import {BulkImportParams} from '../components/apps.interface';
import {Subject} from 'rxjs/Subject';
import {BusyService} from '../../shared/services/busy.service';
import {takeUntil} from 'rxjs/operators';

/**
 * Applications Bulk Import
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-apps',
  templateUrl: './apps-bulk-import.component.html'
})
export class AppsBulkImportComponent {

  constructor() {
  }
}
