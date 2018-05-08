import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartComponent } from './bar-chart.component';
import { LoggerService } from '../../../shared/services/logger.service';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BarChartComponent],
      providers: [
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
