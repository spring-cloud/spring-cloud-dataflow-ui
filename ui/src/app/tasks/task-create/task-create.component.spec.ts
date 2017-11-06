import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BusyModule } from 'angular2-busy';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TasksService } from '../tasks.service';
import { TaskCreateComponent } from './task-create.component';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { MockToastyService } from '../../tests/mocks/toasty';
import { MockTasksService } from '../../tests/mocks/tasks';

describe('TaskCreateComponent', () => {
  let component: TaskCreateComponent;
  let fixture: ComponentFixture<TaskCreateComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let activeRoute: MockActivatedRoute;
  const toastyService = new MockToastyService();
  const tasksService = new MockTasksService();
  const commonTestParams = { id: 'faketask' };
  const commonTestAppInfos = { faketask: {
    name: 'fakename',
    options: [
      {id: 'fakename.opt1', name: 'opt1', defaultValue: 'val1'}
    ]}};


  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        TaskCreateComponent
      ],
      imports: [
        BusyModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: TasksService, useValue: tasksService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: ToastyService, useValue: toastyService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCreateComponent);
    component = fixture.componentInstance;
    toastyService.clearAll();
  });

  function updateDefinitionName(definitionName: string) {
    component.definitionName.setValue(definitionName);
  }

  it('task create component should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have matching app title with given param id', () => {
    activeRoute.testParams = commonTestParams;
    tasksService.testAppInfos = commonTestAppInfos;
    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
    fixture.detectChanges();

    expect(el.textContent).toContain('Create Definition for Task App faketask');
    expect(toastyService.testSuccess.length).toBe(1);
    expect(toastyService.testSuccess).toContain('App info loaded.');
  });

  it('should warn about empty initial definition name', () => {
    activeRoute.testParams = commonTestParams;
    tasksService.testAppInfos = commonTestAppInfos;
    de = fixture.debugElement.query(By.css('[id=commonDefinitionParameters] > div'));
    el = de.nativeElement;

    fixture.detectChanges();
    expect(el.classList.contains('has-warning')).toBe(true);
    expect(el.classList.contains('has-feedback')).toBe(true);

    de = fixture.debugElement.query(By.css('[id=commonDefinitionParameters] p.help-block'));
    el = de.nativeElement;
    expect(el.textContent).toContain('Cannot be empty.');
  });

  it('should warn about empty illegal definition name', () => {
    activeRoute.testParams = commonTestParams;
    tasksService.testAppInfos = commonTestAppInfos;
    de = fixture.debugElement.query(By.css('[id=commonDefinitionParameters] > div'));
    el = de.nativeElement;

    updateDefinitionName('fake task');
    fixture.detectChanges();
    expect(el.classList.contains('has-warning')).toBe(true);
    expect(el.classList.contains('has-feedback')).toBe(true);

    de = fixture.debugElement.query(By.css('[id=commonDefinitionParameters] p.help-block'));
    el = de.nativeElement;
    expect(el.textContent).toContain('Cannot have spaces.');
  });

  it('should warn about same definition name', () => {
    activeRoute.testParams = commonTestParams;
    tasksService.testAppInfos = commonTestAppInfos;
    de = fixture.debugElement.query(By.css('[id=commonDefinitionParameters] > div'));
    el = de.nativeElement;

    updateDefinitionName('validtaskname');
    fixture.detectChanges();
    expect(el.classList.contains('has-warning')).toBe(false);
    expect(el.classList.contains('has-feedback')).toBe(false);

    updateDefinitionName('faketask');
    fixture.detectChanges();
    expect(el.classList.contains('has-warning')).toBe(true);
    expect(el.classList.contains('has-feedback')).toBe(true);

    de = fixture.debugElement.query(By.css('[id=commonDefinitionParameters] p.help-block'));
    el = de.nativeElement;
    expect(el.textContent).toContain('Cannot be same as faketask.');
  });

  it('should have plain initial resulting definition', () => {
    activeRoute.testParams = commonTestParams;
    tasksService.testAppInfos = commonTestAppInfos;
    de = fixture.debugElement.query(By.css('pre'));
    el = de.nativeElement;

    fixture.detectChanges();
    expect(el.textContent).toContain('fakename');
  });

  it('should add parameter to resulting definition if included', () => {
    activeRoute.testParams = commonTestParams;
    tasksService.testAppInfos = commonTestAppInfos;
    de = fixture.debugElement.query(By.css('pre'));
    el = de.nativeElement;

    fixture.detectChanges();
    component.includeForm.controls['fakename.opt1.include'].setValue(true);
    fixture.detectChanges();
    expect(el.textContent).toContain('fakename --fakename.opt1="val1"');
  });

  it('should have submit disabled until valid', () => {
    activeRoute.testParams = commonTestParams;
    tasksService.testAppInfos = commonTestAppInfos;
    de = fixture.debugElement.query(By.css('button[type=submit]'));
    el = de.nativeElement;
    fixture.detectChanges();
    expect(de.nativeElement.disabled).toBe(true);

    updateDefinitionName('validtaskname');
    fixture.detectChanges();
    expect(de.nativeElement.disabled).toBe(false);
  });

  it('Submit button should navigate to tasks definitions on click', () => {
    activeRoute.testParams = commonTestParams;
    tasksService.testAppInfos = commonTestAppInfos;
    de = fixture.debugElement.query(By.css('button[type=submit]'));
    el = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');

    updateDefinitionName('validtaskname');
    fixture.detectChanges();
    el.click();
    expect(navigate).toHaveBeenCalledWith(['tasks/definitions']);
  });

  it('Back button should navigate to tasks apps on click', () => {
    activeRoute.testParams = commonTestParams;
    tasksService.testAppInfos = commonTestAppInfos;
    de = fixture.debugElement.query(By.css('button[type=button]'));
    el = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');

    fixture.detectChanges();
    el.click();
    expect(navigate).toHaveBeenCalledWith(['tasks/apps']);
  });
});
