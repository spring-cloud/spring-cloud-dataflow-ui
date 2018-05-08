import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphChartComponent } from './graph-chart.component';
import { LoggerService } from '../../../shared/services/logger.service';

describe('GraphChartComponent', () => {
  let component: GraphChartComponent;
  let fixture: ComponentFixture<GraphChartComponent>;
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphChartComponent ],
      providers: [
        { provide: LoggerService, useValue: loggerService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphChartComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
