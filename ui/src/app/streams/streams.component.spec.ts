import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import {ActivatedRoute} from '@angular/router';
import {StreamsComponent} from './streams.component';
import {MockStreamsService} from '../tests/mocks/streams';
import {MockActivatedRoute} from '../tests/mocks/activated-route';
import {RouterTestingModule} from '@angular/router/testing';
import {StreamsService} from './streams.service';
import {BsModalService} from 'ngx-bootstrap';
import { RolesDirective } from '../auth/directives/roles.directive';
import { MockAuthService } from '../tests/mocks/auth';
import { AuthService } from '../auth/auth.service';
import { MocksSharedAboutService } from '../tests/mocks/shared-about';
import { SharedAboutService } from '../shared/services/shared-about.service';
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
  const aboutService = new MocksSharedAboutService();

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
        { provide: SharedAboutService, useValue: aboutService },
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
