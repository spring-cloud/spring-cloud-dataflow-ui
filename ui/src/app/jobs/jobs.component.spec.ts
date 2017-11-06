import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BusyModule } from 'angular2-busy';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastyService } from 'ng2-toasty';
import { JobsComponent } from './jobs.component';
import { DefinitionStatusComponent } from './components/definition-status.component';
import { JobExecutionStatusComponent } from './components/job-execution-status.component';
import { SearchfilterPipe } from '../shared/pipes/search-filter.pipe';
import { JobsService } from './jobs.service';
import { MockToastyService } from '../tests/mocks/toasty';
import { RouterTestingModule } from '@angular/router/testing';
import { MockJobsService } from '../tests/mocks/jobs';

describe('JobsComponent', () => {
  let component: JobsComponent;
  let fixture: ComponentFixture<JobsComponent>;
  const toastyService = new MockToastyService();

  beforeEach(async(() => {
    const jobsService = new MockJobsService();
    TestBed.configureTestingModule({
      declarations: [
        JobsComponent,
        SearchfilterPipe,
        JobExecutionStatusComponent,
        DefinitionStatusComponent
      ],
      imports: [
        BusyModule,
        NgxPaginationModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: JobsService, useValue: jobsService},
        { provide: ToastyService, useValue: toastyService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsComponent);
    component = fixture.componentInstance;
    toastyService.clearAll();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
