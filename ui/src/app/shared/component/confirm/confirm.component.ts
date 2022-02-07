import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styles: []
})
export class ConfirmComponent {
  isOpen = false;
  @Output() onConfirmed = new EventEmitter();
  @Input() title;
  @Input() yes;

  constructor(private translate: TranslateService) {
    this.title = this.translate.instant('commons.confirmAction');
    this.yes = this.translate.instant('commons.yes');
  }

  open(): void {
    this.isOpen = true;
  }

  confirm(): void {
    this.onConfirmed.emit(true);
    this.isOpen = false;
  }
}
