import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Stream } from '../../../shared/model/stream.model';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { StreamServiceMock } from '../../../tests/api/stream.service.mock';
import { ContextService } from '../../../shared/service/context.service';
import { StreamComponent } from './stream.component';
import { DestroyComponent } from '../destroy/destroy.component';
import { UndeployComponent } from '../undeploy/undeploy.component';
import { GrafanaStreamDirective } from '../../../shared/grafana/grafana.directive';
import { GrafanaServiceMock } from '../../../tests/service/grafana.service.mock';

describe('streams/streams/stream/stream.component.ts', () => {

  let component: StreamComponent;
  let fixture: ComponentFixture<StreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StreamComponent,
        DestroyComponent,
        UndeployComponent,
        GrafanaStreamDirective
      ],
      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        NotificationServiceMock.provider,
        StreamServiceMock.provider,
        GrafanaServiceMock.provider,
        ContextService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
