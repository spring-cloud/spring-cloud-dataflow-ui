import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { RouterTestingModule } from '@angular/router/testing';
import { JobsService } from '../jobs.service';
import { MockJobsService } from '../../tests/mocks/jobs';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { StepExecutionDetailsComponent } from './step-execution-details.component';
import { JobExecutionStatusComponent } from '../components/job-execution-status.component';
import { DataflowDurationPipe } from '../../shared/pipes/dataflow-duration.pipe';
import { MapValuesPipe } from '../../shared/pipes/map-values-pipe.pipe';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { JOBS_EXECUTIONS_1_STEPS_1 } from '../../tests/mocks/mock-data';
import { MockToastyService } from '../../tests/mocks/toasty';

describe('StepExecutionDetailsComponent', () => {
  let component: StepExecutionDetailsComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<StepExecutionDetailsComponent>;
  let activeRoute: MockActivatedRoute;
  let jobsService: MockJobsService;
  const toastyService = new MockToastyService();

  beforeEach(async(() => {
    jobsService = new MockJobsService();
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        StepExecutionDetailsComponent,
        JobExecutionStatusComponent,
        DataflowDurationPipe,
        MapValuesPipe
      ],
      imports: [
        RouterTestingModule.withRoutes([])
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
    fixture = TestBed.createComponent(StepExecutionDetailsComponent);
    component = fixture.componentInstance;
    toastyService.clearAll();
  });

  it('should be created', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate execution details', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    jobsService.testStepExecutionResource = JOBS_EXECUTIONS_1_STEPS_1;
    fixture.detectChanges();

    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
    expect(el.textContent).toContain('Step Execution Details - Step Execution ID: 1');

    let des: DebugElement[] = fixture.debugElement.queryAll(By.css('table[id=stepExecution] td'));
    expect(des.length).toBe(30);
    expect(des[0].nativeElement.textContent).toContain('Step Execution Id');
    expect(des[1].nativeElement.textContent).toContain('1');
    expect(des[2].nativeElement.textContent).toContain('Job Execution Id');
    expect(des[3].nativeElement.textContent).toContain('1');
    expect(des[4].nativeElement.textContent).toContain('Step Name');
    expect(des[5].nativeElement.textContent).toContain('job1step1');
    expect(des[6].nativeElement.textContent).toContain('Step Type');
    expect(des[7].nativeElement.textContent)
      .toContain('org.springframework.cloud.task.app.timestamp.batch.TimestampBatchTaskConfiguration$1');
    expect(des[8].nativeElement.textContent).toContain('Status');
    expect(des[9].nativeElement.textContent).toContain('COMPLETED');
    expect(des[10].nativeElement.textContent).toContain('Commits');
    expect(des[11].nativeElement.textContent).toContain('1');
    expect(des[12].nativeElement.textContent).toContain('Duration');
    expect(des[13].nativeElement.textContent).toContain('00:00:00.018');
    expect(des[14].nativeElement.textContent).toContain('Filter Count');
    expect(des[15].nativeElement.textContent).toContain('0');
    expect(des[16].nativeElement.textContent).toContain('Process Skips');
    expect(des[17].nativeElement.textContent).toContain('0');
    expect(des[18].nativeElement.textContent).toContain('Reads');
    expect(des[19].nativeElement.textContent).toContain('0');
    expect(des[20].nativeElement.textContent).toContain('Read Skips');
    expect(des[21].nativeElement.textContent).toContain('0');
    expect(des[22].nativeElement.textContent).toContain('Rollbacks');
    expect(des[23].nativeElement.textContent).toContain('0');
    expect(des[24].nativeElement.textContent).toContain('Skips');
    expect(des[25].nativeElement.textContent).toContain('0');
    expect(des[26].nativeElement.textContent).toContain('Writes');
    expect(des[27].nativeElement.textContent).toContain('0');
    expect(des[28].nativeElement.textContent).toContain('Write Skips');
    expect(des[29].nativeElement.textContent).toContain('0');

    des = fixture.debugElement.queryAll(By.css('table[id=stepExecutionContext] td'));
    expect(des.length).toBe(4);
    expect(des[0].nativeElement.textContent).toContain('batch.taskletType');
    expect(des[1].nativeElement.textContent)
      .toContain('org.springframework.cloud.task.app.timestamp.batch.TimestampBatchTaskConfiguration$1');
    expect(des[2].nativeElement.textContent).toContain('batch.stepType');
    expect(des[3].nativeElement.textContent).toContain('org.springframework.batch.core.step.tasklet.TaskletStep');

    de = fixture.debugElement.query(By.css('pre'));
    el = de.nativeElement;
    expect(el.textContent).toContain('N/A');
  });

  it('back should navigate to jobs executions', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    de = fixture.debugElement.query(By.css('button[type=button]'));
    el = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');
    fixture.detectChanges();
    el.click();

    expect(navigate).toHaveBeenCalledWith(['jobs/executions/1']);
  });

  it('should show No Step Execution available.', () => {
    activeRoute.testParams = {jobid: '1', stepid: '3'};
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
    expect(el.textContent).toContain('Step Execution Details - Step Execution ID: 3');

    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;
    expect(el.textContent).toContain('No Step Execution available.');
  });
});
