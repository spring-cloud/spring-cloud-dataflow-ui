import { Component, ViewEncapsulation, Input } from '@angular/core';
import { ParserService } from '../../../flo/shared/service/parser.service';

@Component({
  selector: 'app-stream-dsl',
  template: `<span class="stream-dsl">
      <span *ngIf="!expandable">
        {{shortDslText}}
      </span>
      <span *ngIf="expandable">
        <span *ngIf="getState() === 'unexpandable'">
          {{dslText}}
        </span>
        <span *ngIf="getState() === 'expanded'">
          {{dslText}}
          <a class="less" href="" (click)="$event.preventDefault(); collapse()">&lt;&lt;</a>
        </span>
        <span *ngIf="getState() === 'collapsed'">
          {{shortDslText}}
          <a class="less" href="" (click)="$event.preventDefault(); expand()">&gt;&gt;</a>
        </span>
      </span>
    </span>
  `,
  encapsulation: ViewEncapsulation.None
})
export class StreamDslComponent {
  opened = false;
  state: 'unexpandable' | 'expanded' | 'collapsed';
  dslText: string;
  shortDslText: string;
  @Input() expandable = true;

  @Input('dsl')
  set dsl(dsl: string) {
    if (this.dslText !== dsl) {
      this.dslText = dsl;
      this.shortDslText = this.parserService.simplifyDsl(dsl);
      if (this.dsl === this.shortDslText) {
        this.state = 'unexpandable';
      } else {
        this.state = this.opened ? 'expanded' : 'collapsed';
      }
    }
  }

  get dsl() {
    return this.dslText;
  }

  constructor(private parserService: ParserService) {
  }

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
