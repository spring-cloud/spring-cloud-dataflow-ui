import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild
} from '@angular/core';

/**
 * List Row Actions
 */
@Component({
  selector: 'app-list-row-actions',
  template: `
    <div *ngIf="actions" class="actions">
      <ng-container *ngFor="let action of actionsDefault">
        <button *ngIf="!action['divider'] && !action['hidden']" name="{{ action.id }}" type="button"
                (click)="call(action)" class="btn btn-default" title="{{ action.title }}"
                [disabled]="!!action?.disabled" [tooltip]="action.title" delay="500" container="body">
          <span *ngIf="!action['custom']" class="fa fa-{{ action.icon }}"></span>
          <span *ngIf="action['custom']" class="icon-custom icon-custom-{{ action.icon }}"></span>
        </button>
      </ng-container>
      <div class="btn-group" *ngIf="actionsMenu.length > 0" [class.open]="_display">
        <button #showButton type="button" class="btn btn-default" (click)="showMenu()">
          <span class="fa fa-chevron-down"></span>
        </button>
        <ul *ngIf="_display" class="dropdown-menu dropdown-menu-right">
          <ng-container *ngFor="let action of actionsMenu">
            <li *ngIf="!action['divider'] && !action['hidden']">
              <a id="{{ action.id }}" class="dropdown-item" (click)="call(action)"
                 [class.disabled]="!!action?.disabled">
                <span *ngIf="action.icon && !action['custom']" class="fa fa-{{ action.icon }}"></span>
                <span *ngIf="action.icon && action['custom']" class="icon-custom icon-custom-{{ action.icon }}"></span>
                {{ action.title }}
              </a>
            </li>
            <li class="divider" *ngIf="!!action['divider'] && !action['hidden']"></li>
          </ng-container>
        </ul>
      </div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListRowActionsComponent implements OnInit {

  /**
   * Item
   */
  @Input() item: any;

  /**
   * Actions
   */
  @Input() actions: Array<any>;

  /**
   * Action Event
   */
  @Output() action: EventEmitter<any> = new EventEmitter();

  @ViewChild('showButton', { static: false }) showButton;

  /**
   * List of actions
   */
  private actionsMenu = [];

  /**
   * List of default actions
   */
  private actionsDefault = [];

  /**
   * Menu display
   */
  private _display = false;

  constructor(private renderer: Renderer2) {

  }

  /**
   * On Init
   */
  ngOnInit() {
    const actions = [];
    for (let o = 0; o < this.actions.length; o++) {
      const item = this.actions[o];
      if (!item['divider'] && !item['hidden']) {
        actions.push(item);
      }
      if (!!item['isDefault'] && !item['hidden']) {
        this.actionsDefault.push(item);
      }
    }
    const diff = actions.filter(item => {
      return !this.actionsDefault.find(i => i['id'] === item['id']);
    });
    if (diff.length === 0) {
      this.actionsMenu = [];
    } else {
      this.actionsMenu = this.actions;
    }
  }

  /**
   * Call action
   * Emit an Action Event
   */
  call(action) {
    if (!action['disabled']) {
      this.action.emit({ action: action.action, args: this.item });
    }
  }

  showMenu() {
    this._display = true;
    this.renderer.listen(document.body, 'click', (event) => {
      if (!this.showButton.nativeElement.contains(event.target)) {
        this._display = false;
      }
    });
  }

}
