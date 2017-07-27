import {AfterContentInit, Component, ContentChildren, Input, QueryList} from '@angular/core';

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
  @Input() tabTitle: string;
  @Input() active = false;
}

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tab-simple">
      <ul class="nav nav-tabs">
        <li *ngFor="let tab of tabs" (click)="selectTab(tab)" role="presentation" [class.active]="tab.active">
          <a>{{tab.tabTitle}}</a>
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
