import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BubbleChartComponent } from './bubble-chart.component';
import { LoggerService } from '../../../shared/services/logger.service';

describe('BubbleChartComponent', () => {
  let component: BubbleChartComponent;
  let fixture: ComponentFixture<BubbleChartComponent>;
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleChartComponent ],
      providers: [
        { provide: LoggerService, useValue: loggerService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleChartComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
