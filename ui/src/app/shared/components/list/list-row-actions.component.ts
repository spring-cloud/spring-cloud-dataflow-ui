import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output,
  SimpleChanges
} from '@angular/core';

/**
 * List Row Actions
 */
@Component({
  selector: 'app-list-row-actions',
  template: `
    <div *ngIf="actions" class="actions">
      <ng-container *ngFor="let action of actionsDefault">
        <button *ngIf="!action['divider'] && !action['hidden']" name="{{ action.id }}" type="button" (click)="call(action)"
                class="btn btn-default" title="{{ action.title }}" [disabled]="!!action?.disabled"
                [tooltip]="action.title" delay="500" container="body">
          <span *ngIf="!action['custom']" class="fa fa-{{ action.icon }}"></span>
          <span *ngIf="action['custom']" class="icon-custom icon-custom-{{ action.icon }}"></span>
        </button>
      </ng-container>
      <div class="btn-group" *ngIf="actionsMenu.length > 0" dropdown>
        <button id="button-basic" dropdownToggle type="button" class="btn btn-default"
                aria-controls="dropdown-basic">
          <span class="fa fa-chevron-down"></span>
        </button>
        <ul class="dropdown-menu dropdown-menu-right" *dropdownMenu>
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

  /**
   * List of actions
   */
  private actionsMenu = [];

  /**
   * List of default actions
   * @type {Array}
   */
  private actionsDefault = [];

  /**
   * On Init
   */
  ngOnInit() {
    const actions = this.actions.filter(item => !item['divider'] && !item['hidden']);
    this.actionsDefault = this.actions.filter(item => !!item['isDefault'] && !item['hidden']);
    const diff = actions.filter(item => {
      return !this.actionsDefault.find(i => i['id'] === item['id']);
    });
    if (diff.length == 0) {
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

}
