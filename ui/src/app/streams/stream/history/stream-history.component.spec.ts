import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStreamsService } from '../../../tests/mocks/streams';
import { MockActivatedRoute } from '../../../tests/mocks/activated-route';
import { RouterTestingModule } from '@angular/router/testing';
import { StreamsService } from '../../streams.service';
import { ActivatedRoute } from '@angular/router';
import { FloModule } from 'spring-flo';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { BsModalService } from 'ngx-bootstrap';
import { MockModalService } from '../../../tests/mocks/modal';
import { StreamStatusComponent } from '../../components/stream-status/stream-status.component';
import { AppTypeComponent } from '../../../apps/components/app-type/app-type.component';
import { RolesDirective } from '../../../auth/directives/roles.directive';
import { StreamDslComponent } from '../../../shared/components/dsl/dsl.component';
import { STREAM_DEFINITIONS } from '../../../tests/mocks/mock-data';
import { MockAuthService } from '../../../tests/mocks/auth';
import { AuthService } from '../../../auth/auth.service';
import { MocksSharedAboutService } from '../../../tests/mocks/shared-about';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { DeploymentPropertiesInfoComponent } from '../../streams/deployment-properties-info/deployment-properties-info.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { StreamHistoryComponent } from './stream-history.component';
import { StreamHistoryStatusComponent } from '../../components/stream-history-status/stream-status.component';
import { By } from '@angular/platform-browser';
import { MockConfirmService } from '../../../tests/mocks/confirm';
import { ConfirmService } from '../../../shared/components/confirm/confirm.service';
import { DataflowDateTimePipe } from '../../../shared/pipes/dataflow-date-time.pipe';

/**
 * Test {@link StreamHistoryComponent}.
 *
 * @author Damien Vitrac
 */
describe('StreamHistoryComponent', () => {
  let component: StreamHistoryComponent;
  let fixture: ComponentFixture<StreamHistoryComponent>;
  let activeRoute: MockActivatedRoute;
  const streamsService = new MockStreamsService();
  const commonTestParams = { id: '1' };
  const notificationService = new MockNotificationService();
  const modalService = new MockModalService();
  const authService = new MockAuthService();
  const aboutService = new MocksSharedAboutService();
  const loggerService = new LoggerService();
  const confirmService = new MockConfirmService();

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamHistoryComponent,
        StreamStatusComponent,
        AppTypeComponent,
        StreamDslComponent,
        RolesDirective,
        DeploymentPropertiesInfoComponent,
        LoaderComponent,
        StreamHistoryStatusComponent,
        DataflowDateTimePipe
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        FloModule
      ],
      providers: [
        { provide: StreamsService, useValue: streamsService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: BsModalService, useValue: modalService },
        { provide: SharedAboutService, useValue: aboutService },
        { provide: AuthService, useValue: authService },
        { provide: NotificationService, useValue: notificationService },
        { provide: ConfirmService, useValue: confirmService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(StreamHistoryComponent);
    component = fixture.componentInstance;

    streamsService.streamDefinitions = JSON.parse(JSON.stringify(STREAM_DEFINITIONS));
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].status = 'deployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].status = 'deployed';
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate 2 history', () => {
    fixture.detectChanges();

    const trs = fixture.debugElement.queryAll(By.css('#table-history tbody tr'));
    expect(trs.length).toBe(2);

    const tds0 = trs[0].queryAll(By.css('td'));
    const tds1 = trs[1].queryAll(By.css('td'));

    expect(tds0.length).toBe(6);
    expect(tds1.length).toBe(6);

    expect(tds0[0].nativeElement.textContent).toBe('2');
    expect(tds0[2].nativeElement.textContent).toContain('DEPLOYED');
    expect(tds0[3].nativeElement.textContent).toContain('Upgrade complete');
    expect(tds0[4].nativeElement.textContent).toContain('default');

    expect(tds0[5].query(By.css('button')).nativeElement.hasAttribute('disabled')).toBeTruthy();

    expect(tds1[0].nativeElement.textContent).toBe('1');
    expect(tds1[2].nativeElement.textContent).toContain('DELETED');
    expect(tds1[3].nativeElement.textContent).toContain('Delete complete');
    expect(tds1[4].nativeElement.textContent).toContain('default');
    expect(tds1[5].query(By.css('button')).nativeElement.hasAttribute('disabled')).toBeFalsy();
  });

  xit('should perform a rollback', () => {
    const spy = spyOn(component, 'rollback');
    fixture.detectChanges();
    const trs = fixture.debugElement.queryAll(By.css('#table-history tbody tr'));
    expect(trs.length).toBe(2);
    const tds = trs[1].queryAll(By.css('td'));
    const action: HTMLElement = tds[5].query(By.css('button')).nativeElement;
    action.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should perform a rollback and display a success message', () => {
    fixture.detectChanges();
    const trs = fixture.debugElement.queryAll(By.css('#table-history tbody tr'));
    expect(trs.length).toBe(2);
    const tds = trs[1].queryAll(By.css('td'));
    const action: HTMLElement = tds[5].query(By.css('button')).nativeElement;
    action.click();
    fixture.detectChanges();
    expect(notificationService.testSuccess[0]).toContain('Successful stream rollback to version');
  });

});
