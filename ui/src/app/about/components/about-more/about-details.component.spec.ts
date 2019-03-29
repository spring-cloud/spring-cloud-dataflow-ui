import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockActivatedRoute } from '../../../tests/mocks/activated-route';
import { ActivatedRoute } from '@angular/router';
import { MockAboutService } from '../../../tests/mocks/about';
import { AboutService } from '../../about.service';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AboutDetailsComponent } from './about-details.component';
import { ClipboardModule } from 'ngx-clipboard';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { LoggerService } from '../../../shared/services/logger.service';
import { BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DATAFLOW_PAGE } from '../../../shared/components/page/page.component';
import { DATAFLOW_LIST } from 'src/app/shared/components/list/list.component';
import { PagerComponent } from '../../../shared/components/pager/pager.component';

describe('AboutDetailsComponent', () => {
  let component: AboutDetailsComponent;
  let fixture: ComponentFixture<AboutDetailsComponent>;
  const notificationService = new MockNotificationService();
  let activeRoute: MockActivatedRoute;
  const aboutService = new MockAboutService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    aboutService.isAboutInfoAvailable = true;
    aboutService.featureEnabled = true;
    aboutService.isPlatformSpecificInformationAvailable = true;
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        ClipboardModule,
        BsDropdownModule.forRoot(),
        ReactiveFormsModule,
        TooltipModule.forRoot(),
        FormsModule,
        NgxPaginationModule
      ],
      declarations: [
        AboutDetailsComponent,
        LoaderComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        PagerComponent
      ],
      providers: [
        { provide: AboutService, useValue: aboutService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService },
        { provide: ActivatedRoute, useValue: activeRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDetailsComponent);
    component = fixture.componentInstance;
  });

  it('Should display base information and services are enabled.', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();

    // Verify Enabled Features
    validateColumnValues('enabledFeaturesTable', ['Streams', 'Tasks', 'Schedules', 'Grafana'], 0);
    validateSpansExists(['streamsEnabled', 'tasksEnabled', 'schedulesEnabled', 'grafanaEnabled']);

    // Verify Security Information
    validateColumnValues('securityInformationTable', ['Authentication', 'Authenticated', 'Username', 'Roles'], 0);
    validateSpansExists(['authenticationEnabled', 'authenticateEnabled']);
    validateTdValue('username', 'joe');
    validateTdValue('roles', 'base_role');

    // Starting Version
    validateColumnValues('versionInformationTable', ['Implementation',
      'Core', 'Dashboard',
      'Shell', 'Shell Checksum Sha1', 'Shell Checksum Sha256'], 0);
    validateColumnValues('versionInformationTable',
      ['BAR (FOO)', 'BOO (BAZ)', 'QIX (QUE)', 'QUUX (QUX)', 'checksumSample1', 'checksumSample256'], 0);

    // App Deployer Table
    validateColumnValues('appDeployerTable', ['Implementation Version', 'Name', 'Spi Version',
      'Java Version', 'Platform Api Version', 'Platform Client Version', 'Platform Host Version', 'Platform Type',
      'Spring Boot Version', 'Spring Version'], 0);
    validateColumnValues('appDeployerTable', ['DEP_IMP_VER', 'FOODeployer', 'DEP_SPI_VER',
      'JAV_VER', 'PLA_API_VER', 'PLA_CLI_VER', 'PLA_HOS_VER', 'FOO_PLATFORM', 'SPR_BOO_VER', 'SPR_VER'], 0);

    // App Deployer Platform Specific Table
    validateColumnValues('appDeployerPlatformSpecificTable', ['key1', 'key2'], 0);
    validateColumnValues('appDeployerPlatformSpecificTable', ['value1', 'value2'], 0);

    // Task Launcher Table
    validateColumnValues('taskLauncherTable', ['Implementation Version', 'Name', 'Spi Version',
      'Java Version', 'Platform Api Version', 'Platform Client Version', 'Platform Host Version', 'Platform Type',
      'Spring Boot Version', 'Spring Version', 'key1_task', 'key2_task'], 0);
    validateColumnValues('taskLauncherTable', ['DEP_IMP_VER_TASK', 'FOODeployer_TASK', 'DEP_SPI_VER_TASK',
      'JAV_VER_TASK', 'PLA_API_VER_TASK', 'PLA_CLI_VER_TASK', 'PLA_HOS_VER_TASK', 'FOO_PLATFORM_TASK',
      'SPR_BOO_VER_TASK', 'SPR_VER_TASK', 'value1_task', 'value2_task'], 0);

    // App Task Launcher Platform Specific Table
    validateColumnValues('appTaskLauncherPlatformSpecificTable', ['key1_task', 'key2_task'], 0);
    validateColumnValues('appTaskLauncherPlatformSpecificTable', ['value1_task', 'value2_task'], 0);
  });

  it('Should display base information and services are disabled.', () => {
    aboutService.featureEnabled = false;
    fixture.detectChanges();
    expect(component).toBeTruthy();

    // Verify Enabled Features
    validateColumnValues('enabledFeaturesTable', ['Streams', 'Tasks', 'Schedules', 'Grafana'], 0);
    validateSpansExists(['streamsDisabled', 'tasksDisabled', 'schedulerDisabled', 'grafanaDisabled']);

    // Verify Security Information
    validateColumnValues('securityInformationTable', ['Authentication', 'Authenticated', 'Username', 'Roles'], 0);
    validateSpansExists(['authenticationDisabled', 'authenticateDisabled']);
    validateTdValue('username', 'joe');
    validateTdValue('roles', 'base_role');
  });

  it('Should display no platform specific information available.', () => {
    aboutService.isPlatformSpecificInformationAvailable = false;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    validateTdValue('noAppDeployerPlatformMessage', 'No platform-specific app deployer information available.');
  });

  /*
  Loading state not very import
  todo: Change for a real error state
  it('Should display no server error.', () => {
    aboutService.isAboutInfoAvailable = false;
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css('h1'));
    let el = de.nativeElement;
    expect(el.textContent).toContain('About Details');

    de = fixture.debugElement.query(By.css('h2[id=serverWarningError]'));
    el = de.nativeElement;
    expect(el.textContent).toContain('Obtaining about info from server.');
  });
  */

  /*
  it('Should navigate to the details page.', () => {
    fixture.detectChanges();
    const de: DebugElement = fixture.debugElement.query(By.css('button[id=back-button]'));
    const el: HTMLElement = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');
    fixture.detectChanges();
    el.click();

    expect(navigate).toHaveBeenCalledWith(['about']);
  });
  */

  function validateSpansExists(spans: string[]): void {
    let de;
    for (const idOfSpan of spans) {
      de = fixture.debugElement.query(By.css(`#${idOfSpan}`));
      expect(de.name === idOfSpan);
    }
  }

  function validateColumnValues(idOfTable: string, values: string[], startingIndex: number): void {
    const des = fixture.debugElement.queryAll(By.css(`#${idOfTable} .line`));
    expect(des.length).toBe(values.length);
    let currentPosition = startingIndex;
    for (const currentName of values) {
      expect(des[currentPosition].nativeElement.textContent).toContain(currentName);
      currentPosition += 1;
    }
  }

  function validateTdValue(tdId: string, tdValue: string): void {
    const de = fixture.debugElement.query(By.css(`#${tdId}`));
    expect(de.nativeElement.textContent).toContain(tdValue);
  }
});
