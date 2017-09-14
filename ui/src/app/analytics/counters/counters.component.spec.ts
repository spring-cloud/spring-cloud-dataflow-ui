import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CountersComponent } from './counters.component';
import {AnalyticsModule} from '../analytics.module';

describe('CounterComponent', () => {
  let component: CountersComponent;
  let fixture: ComponentFixture<CountersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [AnalyticsModule]
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
