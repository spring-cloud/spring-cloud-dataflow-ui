import {Component} from '@angular/core';
import {RuntimeApp} from '../model/runtime-app';
import {Observable} from 'rxjs/Observable';
import {BsModalRef} from 'ngx-bootstrap';

/**
 * Component that display a Runtime application.
 *
 * @author Ilayaperumal Gopinathan
 * @author Vitrac Damien
 */
@Component({
  selector: 'app-runtime-app',
  styleUrls: ['./styles.scss'],
  templateUrl: './runtime-app.component.html',
})
export class RuntimeAppComponent {

  /**
   * Observable of Runtime Application
   */
  runtimeApp$: Observable<RuntimeApp>;

  /**
   * Constructor
   *
   * @param {BsModalRef} modalRef
   */
  constructor(private modalRef: BsModalRef) {
  }

  /**
   * Set the runtime application
   *
   * @param {RuntimeApp} runtimeApp
   */
  open(runtimeApp: RuntimeApp) {
    this.runtimeApp$ = Observable.of(runtimeApp);
  }

  /**
   * Hide the modal
   */
  cancel() {
    this.modalRef.hide();
  }

}
