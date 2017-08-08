import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BusyModule } from 'tixif-ngx-busy';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastyService } from 'ng2-toasty';
import { Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { AppRegistration } from '../../shared/model/app-registration';
import { ApplicationType } from '../../shared/model/application-type';
import { TaskAppsComponent } from './task-apps.component';
import { MockToastyService } from '../../tests/mocks/toasty';
import { MockTasksService } from '../../tests/mocks/tasks';

describe('TaskAppsComponent', () => {
  let component: TaskAppsComponent;
  let fixture: ComponentFixture<TaskAppsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const toastyService = new MockToastyService();
  const tasksService = new MockTasksService();

  beforeEach(async(() => {
    const routerStub = {};
    TestBed.configureTestingModule({
      declarations: [
        TaskAppsComponent
      ],
      imports: [
        BusyModule,
        NgxPaginationModule
      ],
      providers: [
        { provide: TasksService, useValue: tasksService },
        { provide: ToastyService, useValue: toastyService },
        { provide: Router, useValue: routerStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAppsComponent);
    component = fixture.componentInstance;
    tasksService.testTaskAppRegistrations = [
      new AppRegistration('fakename', ApplicationType.task, 'fakeuri')
    ];
    toastyService.clearAll();
  });

  it('TaskAppsComponent should be created', () => {
    expect(component).toBeTruthy();
  });

  it('task application registered', () => {
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('tbody'));
    el = de.nativeElement;
    expect(el.textContent).toContain('fakename');
    expect(el.textContent).toContain('fakeuri');
    expect(toastyService.testSuccess.length).toBe(1);
    expect(toastyService.testSuccess).toContain('Task apps loaded.');
  });
});
