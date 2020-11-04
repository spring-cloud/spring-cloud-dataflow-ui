import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { StreamServiceMock } from '../../../tests/api/stream.service.mock';
import { GrafanaServiceMock } from '../../../tests/service/grafana.service.mock';
import { GroupServiceMock } from '../../../tests/service/group.service.mock';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';
import { SettingsServiceMock } from '../../../tests/service/settings.service.mock';
import { DeployComponent } from './deploy.component';
import { StreamDeployService } from '../stream-deploy.service';
import { LoggerService } from '../../../shared/service/logger.service';
import { AppServiceMock } from '../../../tests/api/app.service.mock';
import { ParserService } from '../../../flo/shared/service/parser.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-stream-deploy-builder',
  template: `
    <div>
    </div>`
})
class BuilderMockComponent {
  @Input() id: string;
  @Output() update = new EventEmitter();
  @Output() exportProperties = new EventEmitter();
  @Output() deploy = new EventEmitter();
  @Output() copyProperties = new EventEmitter();
  @Input() properties: Array<string> = [];
  @Input() isDeployed = false;

  constructor() {
  }
}

@Component({
  selector: 'app-stream-deploy-free-text',
  template: `
    <div>
    </div>`
})
class FreeTextMockComponent {
  @Input() id: string;
  @Output() update = new EventEmitter();
  @Output() exportProperties = new EventEmitter();
  @Output() copyProperties = new EventEmitter();
  @Output() deploy = new EventEmitter();
  @Input() properties: Array<string> = [];
  @Input() isDeployed = false;

  constructor() {
  }
}

describe('streams/streams/deploy/deploy.component.ts', () => {

  let component: DeployComponent;
  let fixture: ComponentFixture<DeployComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DeployComponent,
        BuilderMockComponent,
        FreeTextMockComponent
      ],
      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        NotificationServiceMock.provider,
        AppServiceMock.provider,
        StreamServiceMock.provider,
        GrafanaServiceMock.provider,
        GroupServiceMock.provider,
        ContextServiceMock.provider,
        SettingsServiceMock.provider,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ name: 'foo' }),
          },
        },
        StreamDeployService,
        LoggerService,
        ParserService
      ]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(DeployComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', async (done) => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    done();
  });

  it('should run a deploy (success)', async (done) => {
    const spy = spyOn(StreamServiceMock.mock, 'updateStream').and.callThrough();
    const navigate = spyOn((<any>component).router, 'navigate');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    fixture.detectChanges();
    await fixture.whenStable();
    component.runDeploy(['deployer.foo=bar']);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['streams/list']);
    expect(NotificationServiceMock.mock.successNotifications[0].title).toContain('Deploy success');
    done();
  });

  it('should run a deploy (error)', async (done) => {
    const spy = spyOn(StreamServiceMock.mock, 'updateStream');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    fixture.detectChanges();
    await fixture.whenStable();
    component.runDeploy(['deployer.foo=bar']);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalled();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toContain('An error occurred');
    done();
  });

  it('should run a copy', async (done) => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    fixture.detectChanges();
    await fixture.whenStable();
    component.runCopy(['deployer.foo=bar']);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toContain('Copy to clipboard');
    done();
  });

});
