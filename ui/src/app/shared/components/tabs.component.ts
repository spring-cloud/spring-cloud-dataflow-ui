import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';

/**
 * Generic tab component representing one tab in tabs.
 *
 * @author Janne Valkealahti
 */
@Component({
  selector: 'app-tab',
  styles: [`
    .pane{
      padding: 1em;
    }
  `],
  template: `
    <div [hidden]="!active" class="pane">
      <ng-content></ng-content>
    </div>
  `
})
export class TabComponent {
  /**
   * The text that will be displayed for the tab.
   */
  @Input() tabTitle: string;
  /**
   * Indicates whether a tab is hidden or not.  SHown if true, hidden if false.
   * @type {boolean}
   */
  @Input() active = false;
}

/**
 * Generic tabs component to layout panes.
 *
 * @author Janne Valkealahti
 */
@Component({
  selector: 'app-tabs',
  template: `
    <div class="tab-simple">
      <ul class="nav nav-tabs">
        <li *ngFor="let tab of tabs" (click)="selectTab(tab)" role="presentation" [class.active]="tab.active">
          <a>{{ tab.tabTitle }}</a>
        </li>
      </ul>
      <ng-content></ng-content>
    </div>
  `
})
export class TabsComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter((tab) => tab.active);
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs.toArray().forEach((t) => t.active = false);
    tab.active = true;
  }
}
