import { BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs';

export abstract class Modal {

  /**
   * Reference modal
   */
  private _modalRef;

  /**
   * Constructor
   * @param {BsModalRef} modalRef
   */
  constructor(modalRef: BsModalRef) {
    this._modalRef = modalRef;
  }

  /**
   * Init the modal
   */
  abstract open(args): Observable<any>;

  /**
   * Close the modal
   */
  public cancel() {
    this._modalRef.hide();
  }

}
