import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TaskService } from '../../shared/api/task.service';
import { Platform } from '../../shared/model/platform.model';

@Component({
  selector: 'app-clr-datagrid-platform-filter',
  template: `
    <div>
      <clr-radio-wrapper *ngFor="let platform of platforms">
        <input type="radio" clrRadio (change)="change()" [(ngModel)]="val" value="{{platform.name}}" name="options"/>
        <label>{{platform.name}} ({{platform.type}})</label>
      </clr-radio-wrapper>
    </div>`,
})
export class PlatformFilterComponent implements OnInit {

  private pchanges = new Subject<any>();
  property = 'platform';
  @Input() value = null;
  val = '';
  platforms: Platform[];

  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.taskService.getPlatforms()
      .subscribe((platforms: Platform[]) => {
        this.platforms = platforms;

        if (!this.value) {
          this.value = this.platforms[0].name;
        }
        this.val = this.value;
        this.pchanges.next(true);
      });
  }

  public get changes(): Observable<any> {
    return this.pchanges.asObservable();
  }

  change() {
    if (this.val === 'all') {
      this.value = null;
    } else {
      this.value = (this.val as any);
    }
    this.pchanges.next(true);
  }

  accepts() {
    return true;
  }

  isActive(): boolean {
    return this.value !== null;
  }

}
