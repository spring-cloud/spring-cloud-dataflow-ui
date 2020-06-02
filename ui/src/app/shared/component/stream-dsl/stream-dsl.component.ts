import { Component, ViewEncapsulation, Input } from '@angular/core';
import { ParserService } from '../../../flo/shared/service/parser.service';

@Component({
  selector: 'app-stream-dsl',
  template: `
    <ng-container [ngSwitch]="expandable">
      <ng-container *ngIf="true">
        <span>
          {{shortDslText}}
        </span>
      </ng-container>
      <ng-container *ngSwitchCase="false">
        <span *ngIf="getState() === 'unexpandable'">
          {{dsl}}
        </span>
        <span *ngIf="getState() === 'expanded'">
          {{dsl}}
          <a class="less" href="" (click)="$event.preventDefault(); collapse()">&lt;&lt;</a>
        </span>
        <span *ngIf="getState() === 'collapsed'">
          {{shortDslText}}
          <a class="less" href="" (click)="$event.preventDefault(); expand()">&gt;&gt;</a>
        </span>
      </ng-container>
    </ng-container>
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
