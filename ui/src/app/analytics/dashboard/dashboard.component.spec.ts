import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { NgBusyModule } from 'ng-busy';
import { AnalyticsModule } from '../analytics.module';
import { LoggerService } from '../../shared/services/logger.service';
import { BsDropdownModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        NgBusyModule,
        BsDropdownModule.forRoot(),
        NgxPaginationModule,
        ReactiveFormsModule,
        FormsModule,
        AnalyticsModule
      ],
      providers: [
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
