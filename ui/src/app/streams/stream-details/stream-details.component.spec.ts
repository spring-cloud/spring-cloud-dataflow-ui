import {async, ComponentFixture, TestBed} from '@angular/core/testing';


import {StreamDetailsComponent} from './stream-details.component';
import {MockStreamsService} from '../../tests/mocks/streams';
import {MockActivatedRoute} from '../../tests/mocks/activated-route';
import {RouterTestingModule} from '@angular/router/testing';
import {StreamsService} from '../streams.service';
import {ActivatedRoute} from '@angular/router';

/**
 * Test {@link StreamDetailsComponent}.
 *
 * @author Glenn Renfro
 */
describe('StreamDetailsComponent', () => {
  let component: StreamDetailsComponent;
  let fixture: ComponentFixture<StreamDetailsComponent>;
  let activeRoute: MockActivatedRoute;
  const streamsService = new MockStreamsService();
  const commonTestParams = { id: '1' };

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamDetailsComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {provide: StreamsService, useValue: streamsService},
        {provide: ActivatedRoute, useValue: activeRoute },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(StreamDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
