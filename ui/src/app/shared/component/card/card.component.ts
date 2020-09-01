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
import { SettingsService } from '../../../settings/settings.service';
import { map, mergeMap } from 'rxjs/operators';
import { SettingModel } from '../../model/setting.model';

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

  settings: SettingModel[];

  constructor(private settingsService: SettingsService) {
  }

  ngAfterContentInit(): void {
    this.settingsService.getContext(this.keyContext)
      .pipe(
        mergeMap(global => this.settingsService.getContext(`${this.keyContext}/${this.name}`)
          .pipe(
            map(settings => {
              return { global, settings };
            })
          ))
      )
      .subscribe(({ global, settings }) => {
        this.settings = settings;
        const isActiveGlobal = get(global.find(sett => sett.name === this.id), 'value', true);
        const isActive = get(settings.find(sett => sett.name === this.id), 'value', null);
        if (isActive !== null) {
          this.active = isActive;
        } else if (isActiveGlobal !== null) {
          this.active = isActiveGlobal;
        }
      });
  }

  toggle() {
    if (this.name && this.id) {
      const settings = this.settings.filter(sett => sett.name !== this.name);
      settings.push({ name: this.id, value: !this.active });
      this.settingsService.updateContext(`${this.keyContext}/${this.name}`, settings);
    }
    this.onChange.emit(this.active);
    return false;
  }

}
