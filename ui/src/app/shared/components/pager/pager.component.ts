import {
  Component, Output, EventEmitter, Input, OnChanges, SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';

/**
 * Pager component
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-pager',
  styleUrls: ['./styles.scss'],
  template: `
    <div class="app-pager dropup">
      <div class="app-pager-text">
        items per page:
      </div>
      <div class="btn-group" dropdown>
        <button dropdownToggle type="button" class="select">
          {{ size }} <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" id="dropdown-basic" *dropdownMenu>
          <li *ngFor="let s of SIZE_LIST" [class.active]="s === size">
            <a (click)="doSizeChange(s)" class="dropdown-item">{{ s }}</a>
          </li>
        </ul>
      </div>
      <span class="app-pager-divider"></span>
      <div class="app-pager-text">
        <strong>{{ values.from }}-{{ values.to }}</strong>
        {{ getItemLabel(values.to - values.from + 1) }} of <strong>{{ values.of }}</strong>
        {{ getItemLabel(values.of) }}
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagerComponent implements OnChanges {

  SIZE_LIST = [20, 30, 50, 100];

  @Input() page: number;

  @Input() total: number;

  @Input() size: number;

  @Output() sizeChange = new EventEmitter<number>();

  @Input() item = 'item';

  @Input() items = 'items';

  values = {
    from: 0,
    to: 0,
    of: 0
  };

  getItemLabel(size) {
    return (size > 1) ? this.items : this.item;
  }

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    let page = this.page;
    let size = this.size;
    let total = this.total;
    if (changes.page) {
      page = changes.page.currentValue;
    }
    if (changes.size) {
      size = changes.size.currentValue;
    }
    if (changes.total) {
      total = changes.total.currentValue;
    }
    this.values.from = ((page) * size) + 1;
    this.values.of = total;
    this.values.to = (page + 1) * size;

    if (this.values.of < this.values.to) {
      this.values.to = this.values.of;
    }
  }

  doSizeChange(size) {
    this.sizeChange.emit(size);
  }

}
