import {StreamCreateComponent} from './stream-create.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MockActivatedRoute} from '../../tests/mocks/activated-route';
import {MockStreamsService} from '../../tests/mocks/streams';
import {RouterTestingModule} from '@angular/router/testing';
import {StreamsService} from '../streams.service';
import {ActivatedRoute} from '@angular/router';
import { FloModule} from 'spring-flo';

/**
 * Test {@link StreamCreateComponent}.
 *
 * @author Glenn Renfro
 */
describe('StreamCreateComponent', () => {
  let component: StreamCreateComponent;
  let fixture: ComponentFixture<StreamCreateComponent>;
  let activeRoute: MockActivatedRoute;
  const streamsService = new MockStreamsService();
  const commonTestParams = { id: '1' };

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamCreateComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        FloModule
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
    fixture = TestBed.createComponent(StreamCreateComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
