import { Component, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

/**
 * Confirm component
 * {@Link ConfirmService}
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-modal-confirm',
  template: `
    <div class="modal-confirm" id="modal-confirm">
      <div class="modal-body">
        <h4 [innerHtml]="title"></h4>
        <p [innerHtml]="description"></p>
      </div>
      <div class="modal-footer">
        <button (click)="bsModalRef.hide()" class="btn btn-default">{{ buttonCancel }}</button>
        <button (click)="validate()" class="btn btn-primary">{{ buttonConfirm }}</button>
      </div>
    </div>
  `
})
export class ConfirmComponent {

  public buttonConfirm = 'Validate';
  public buttonCancel = 'Cancel';

  public title: string;
  public description: string;

  @Output() confirm = new EventEmitter();

  constructor(public bsModalRef: BsModalRef) {
  }

  validate() {
    this.confirm.emit();
    this.bsModalRef.hide();
  }

}
