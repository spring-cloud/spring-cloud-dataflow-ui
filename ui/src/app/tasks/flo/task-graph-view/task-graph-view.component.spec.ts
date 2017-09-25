import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskGraphViewComponent } from './task-graph-view.component';

xdescribe('TaskGraphViewComponent', () => {
  let component: TaskGraphViewComponent;
  let fixture: ComponentFixture<TaskGraphViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskGraphViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskGraphViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
