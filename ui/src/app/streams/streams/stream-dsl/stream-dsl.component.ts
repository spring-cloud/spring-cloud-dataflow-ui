import { ElementRef, Component, ViewEncapsulation, Input } from '@angular/core';
import { ParserService } from '../../../flo/shared/service/parser.service';

@Component({
  selector: 'stream-dsl',
  templateUrl: 'stream-dsl.component.html',
  styleUrls: ['./stream-dsl.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StreamDslComponent {

  opened = false;

  private state: 'unexpandable' | 'expanded' | 'collapsed';

  @Input('dsl')
  set dsl(dsl: string) {
    if (this._dsl !== dsl) {
      this._dsl = dsl;
      this.shortDsl = this.parserService.simplifyDsl(dsl);
      if (this.dsl === this.shortDsl) {
        this.state = 'unexpandable';
      } else {
        this.state = this.opened ? 'expanded' : 'collapsed'
      }
    }
  }

  get dsl() {
    return this._dsl;
  }

  private _dsl: string;

  shortDsl: string;

  constructor(private el: ElementRef, private parserService: ParserService) {}

  getState() {
    return this.state;
  }

  expand() {
    if (this.state !== 'unexpandable') {
      this.state = 'expanded';
    }
  }

  collapse() {
    if (this.state !== 'unexpandable') {
      this.state = 'collapsed';
    }
  }

}
