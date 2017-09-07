import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphChartComponent } from './graph-chart.component';

describe('GraphChartComponent', () => {
  let component: GraphChartComponent;
  let fixture: ComponentFixture<GraphChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphChartComponent ]
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
