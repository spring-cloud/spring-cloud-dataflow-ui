import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamHistoryStatusComponent } from './stream-status.component';

/**
 * Test {@link StreamHistoryComponent}.
 *
 * @author Damien Vitrac
 */
describe('StreamHistoryStatusComponent', () => {
  let component: StreamHistoryStatusComponent;
  let fixture: ComponentFixture<StreamHistoryStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StreamHistoryStatusComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamHistoryStatusComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
