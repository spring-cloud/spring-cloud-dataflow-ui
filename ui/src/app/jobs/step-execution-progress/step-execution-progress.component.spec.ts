import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { ProgressbarModule } from 'ngx-bootstrap';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { JobsService } from '../jobs.service';
import { MockJobsService } from '../../tests/mocks/jobs';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { StepExecutionProgressComponent } from './step-execution-progress.component';
import { JOBS_EXECUTIONS_1_STEPS_1_PROGRESS } from '../../tests/mocks/mock-data';
import { MockToastyService } from '../../tests/mocks/toasty';

describe('StepExecutionProgressComponent', () => {
  let component: StepExecutionProgressComponent;
  let fixture: ComponentFixture<StepExecutionProgressComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let activeRoute: MockActivatedRoute;
  let jobsService: MockJobsService;
  const toastyService = new MockToastyService();

  beforeEach(async(() => {
    jobsService = new MockJobsService();
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        StepExecutionProgressComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        ProgressbarModule.forRoot()
      ],
      providers: [
        { provide: JobsService, useValue: jobsService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: ToastyService, useValue: toastyService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepExecutionProgressComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    jobsService.testStepExecutionProgress = JOBS_EXECUTIONS_1_STEPS_1_PROGRESS;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate execution progress', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    jobsService.testStepExecutionProgress = JOBS_EXECUTIONS_1_STEPS_1_PROGRESS;
    fixture.detectChanges();

    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
    expect(el.textContent).toContain('Step Execution Progress for Step \'job1step1\'');
  });

  it('refresh should refresh data', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    jobsService.testStepExecutionProgress = JOBS_EXECUTIONS_1_STEPS_1_PROGRESS;
    de = fixture.debugElement.query(By.css('button[id=refresh]'));
    el = de.nativeElement;
    const refresh = spyOn((<any>component), 'refresh');
    fixture.detectChanges();
    el.click();

    expect(refresh).toHaveBeenCalled();
  });

  it('back should navigate to step execution details', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    jobsService.testStepExecutionProgress = JOBS_EXECUTIONS_1_STEPS_1_PROGRESS;
    de = fixture.debugElement.query(By.css('button[id=back]'));
    el = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');
    fixture.detectChanges();
    el.click();

    expect(navigate).toHaveBeenCalledWith(['jobs/executions/1/1']);
  });
});
