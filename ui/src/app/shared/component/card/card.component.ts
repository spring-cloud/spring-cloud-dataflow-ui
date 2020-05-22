import { AfterContentInit, Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ContextService } from '../../service/context.service';
import get from 'lodash.get';
import set from 'lodash.set';

@Component({
  selector: 'app-view-card',
  templateUrl: './card.component.html',
  styles: []
})
export class CardComponent implements AfterContentInit {

  @ContentChild(TemplateRef) template: TemplateRef<any>;
  @Input() keyContext = '';
  @Input() name = '';
  @Input() id = '';
  @Input() titleModal = '';
  @Input() active = true;
  @Output() onChange = new EventEmitter();
  context: any;

  constructor(private contextService: ContextService) {
  }

  ngAfterContentInit(): void {
    this.context = this.contextService.get(this.keyContext);
    if (this.name && this.id) {
      const isActiveGlobal = (get(this.context, this.id, true));
      const isActive = (get(this.context, `child.${this.name}.${this.id}`, null));
      if (isActive !== null) {
        this.active = isActive;
      } else if (isActiveGlobal !== null) {
        this.active = isActiveGlobal;
      }
    }
  }

  toggle() {
    if (this.name && this.id) {
      this.contextService.update(`${this.keyContext}.child.${this.name}.${this.id}`, !this.active);
    }
    this.active = !this.active;
    this.onChange.emit(this.active);
    return false;
  }

}
