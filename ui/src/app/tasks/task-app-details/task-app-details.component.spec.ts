import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BusyModule } from 'angular2-busy';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { TaskAppDetailsComponent } from './task-app-details.component';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { MockToastyService } from '../../tests/mocks/toasty';
import { MockTasksService } from '../../tests/mocks/tasks';

describe('TaskAppDetailsComponent', () => {
  let component: TaskAppDetailsComponent;
  let fixture: ComponentFixture<TaskAppDetailsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let activeRoute: MockActivatedRoute;
  const toastyService = new MockToastyService();
  const tasksService = new MockTasksService();

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    const routerStub = {};

    TestBed.configureTestingModule({
      declarations: [
        TaskAppDetailsComponent
      ],
      imports: [
        BusyModule
      ],
      providers: [
        { provide: TasksService, useValue: tasksService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: ToastyService, useValue: toastyService },
        { provide: Router, useValue: routerStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAppDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should have matching app title with given param id', () => {
    expect(component).toBeTruthy();
    activeRoute.testParams = { id: 'faketask' };
    tasksService.testAppInfos = { faketask: {name: 'fakename'}};
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;
    expect(el.textContent).toContain('App faketask');
    expect(toastyService.testSuccess.length).toBe(1);
    expect(toastyService.testSuccess).toContain('App info loaded.');
  });
});
