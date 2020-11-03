import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StreamDslComponent } from '../../../shared/component/stream-dsl/stream-dsl.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { StreamServiceMock } from '../../../tests/api/stream.service.mock';
import { GrafanaServiceMock } from '../../../tests/service/grafana.service.mock';
import { ParserService } from '../../../flo/shared/service/parser.service';
import { MultiDeployComponent } from './multi-deploy.component';
import { KeyValueComponent } from '../../../shared/component/key-value/key-value.component';
import { AppServiceMock } from '../../../tests/api/app.service.mock';
import { GroupServiceMock } from '../../../tests/service/group.service.mock';
import { StreamDeployServiceMock } from '../../../tests/service/stream-deploy.service.mock';
import { of, throwError } from 'rxjs';
import { HttpError } from '../../../shared/model/error.model';
import { RoleDirective } from '../../../security/directive/role.directive';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('streams/streams/multi-deploy/multi-deploy.component.ts', () => {

  let component: MultiDeployComponent;
  let fixture: ComponentFixture<MultiDeployComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MultiDeployComponent,
        StreamDslComponent,
        KeyValueComponent,
        RoleDirective
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
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
        AppServiceMock.provider,
        GroupServiceMock.provider,
        StreamDeployServiceMock.provider,
        ParserService,
        ContextServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDeployComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', async (done) => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    done();
  });

  it('should run a deploy', async (done) => {
    const navigate = spyOn((<any>component).router, 'navigateByUrl');
    const spy = spyOn(StreamServiceMock.mock, 'updateStream').and.callFake(() => of({}));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    component.runDeploy();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(navigate).toHaveBeenCalledWith(`streams/list`);
    done();
  });

  it('should display an error', async (done) => {
    const spy = spyOn(StreamServiceMock.mock, 'updateStream').and
      .callFake(() => throwError(new HttpError('Fake error', 404)));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    component.runDeploy();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    done();
  });

});
