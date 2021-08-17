import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {App} from '../../model/app.model';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styles: []
})
export class ConfirmComponent {
  isOpen = false;
  @Output() onConfirmed = new EventEmitter();
  @Input() title = 'Confirm action';
  @Input() yes = 'Yes';

  open(): void {
    this.isOpen = true;
  }

  confirm(): void {
    this.onConfirmed.emit(true);
    this.isOpen = false;
  }
}
