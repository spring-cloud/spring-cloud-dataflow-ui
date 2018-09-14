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
      <button *ngFor="let action of actionsDefault" name="{{ action.id }}" type="button" (click)="call(action)"
              class="btn btn-default" title="{{ action.title }}" [disabled]="!!action?.disabled"
              [tooltip]="action.title" delay="500" container="body">
        <span class="fa fa-{{ action.icon }}"></span>
      </button>
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
                <span *ngIf="action.icon" class="fa fa-{{ action.icon }}"></span>
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
    this.actionsDefault = this.actions.filter(item => !!item['isDefault']);
    if (this.actionsDefault.length !== actions.length) {
      this.actionsMenu = this.actions;
    } else {
      this.actionsMenu = [];
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
