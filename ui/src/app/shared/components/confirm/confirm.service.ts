import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ConfirmComponent } from './confirm.component';
import { Observable } from 'rxjs';

/**
 * Confirm Service.
 *
 * @author Damien Vitrac
 */
@Injectable()
export class ConfirmService {

  private bsModalConfirm: BsModalRef;

  constructor(private modalService: BsModalService) {
  }

  /**
   * Used to display a confirm modal
   *
   * this.confirmService.open(`Title`, `Description`).subscribe(() => {
   *     // Success code
   * })
   *
   * @param {string} title
   * @param {string} description
   * @param {any} options
   * @returns {Observable<any>} Confirm observable
   */
  open(title: string, description: string, options: any = {}): Observable<any> {
    this.bsModalConfirm = this.modalService.show(ConfirmComponent, {ignoreBackdropClick: true});
    this.bsModalConfirm.content.title = title;
    this.bsModalConfirm.content.description = description;
    if (options.confirm) {
      this.bsModalConfirm.content.buttonConfirm = options.confirm;
    }
    if (options.cancel) {
      this.bsModalConfirm.content.buttonCancel = options.cancel;
    }
    return this.bsModalConfirm.content.confirm;
  }

}
