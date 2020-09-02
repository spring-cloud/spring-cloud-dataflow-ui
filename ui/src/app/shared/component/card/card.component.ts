import {
  AfterContentInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef
} from '@angular/core';
import get from 'lodash.get';
import { map, mergeMap } from 'rxjs/operators';
import { SettingModel } from '../../model/setting.model';
import { ContextService } from '../../service/context.service';
import { ContextModel } from '../../model/context.model';

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

  context: ContextModel[];

  constructor(private contextService: ContextService) {
  }

  ngAfterContentInit(): void {
    this.contextService.getContext(this.keyContext)
      .pipe(
        mergeMap(global => this.contextService.getContext(`${this.keyContext}/${this.name}`)
          .pipe(
            map(context => {
              return { global, context };
            })
          ))
      )
      .subscribe(({ global, context }) => {
        this.context = context;
        const isActiveGlobal = get(global.find(sett => sett.name === this.id), 'value', true);
        const isActive = get(context.find(sett => sett.name === this.id), 'value', null);
        if (isActive !== null) {
          this.active = isActive;
        } else if (isActiveGlobal !== null) {
          this.active = isActiveGlobal;
        }
      });
  }

  toggle() {
    if (this.name && this.id) {
      const context = this.context.filter(ct => ct.name !== this.id);
      context.push({ name: this.id, value: !this.active });
      this.contextService.updateContext(`${this.keyContext}/${this.name}`, context);
    }
    this.onChange.emit(this.active);
    return false;
  }

}
