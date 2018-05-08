import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CountersComponent } from './counters.component';
import { AnalyticsModule } from '../analytics.module';
import { LoggerService } from '../../shared/services/logger.service';

describe('CounterComponent', () => {
  let component: CountersComponent;
  let fixture: ComponentFixture<CountersComponent>;
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [AnalyticsModule],
      providers: [
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountersComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
