import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ActivatedRoute} from '@angular/router';
import {StreamsComponent} from './streams.component';
import {MockStreamsService} from '../tests/mocks/streams';
import {MockActivatedRoute} from '../tests/mocks/activated-route';
import {RouterTestingModule} from '@angular/router/testing';
import {StreamsService} from './streams.service';
import { RolesDirective } from '../auth/directives/roles.directive';
import { MockAuthService } from '../tests/mocks/auth';
import { AuthService } from '../auth/auth.service';
/**
 * Test {@link StreamsComponent}.
 *
 * @author Glenn Renfro
 */
describe('StreamsComponent', () => {
  let component: StreamsComponent;
  let fixture: ComponentFixture<StreamsComponent>;
  const streamsService = new MockStreamsService();
  const authService = new MockAuthService();
  let activeRoute: MockActivatedRoute;

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        RolesDirective,
        StreamsComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: StreamsService, useValue: streamsService },
        { provide: ActivatedRoute, useValue: activeRoute },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
