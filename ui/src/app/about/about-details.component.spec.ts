import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BusyModule} from 'tixif-ngx-busy';
import {ToastyService} from 'ng2-toasty';
import {MockToastyService} from '../tests/mocks/toasty';
import {MockActivatedRoute} from '../tests/mocks/activated-route';
import {ActivatedRoute} from '@angular/router';
import {MockAboutService} from '../tests/mocks/about';
import {AboutService} from './about.service';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {AboutDetailsComponent} from './about-details.component';
import {StompService} from 'ng2-stomp-service';
import {KeyValuePipe} from '../shared/pipes/key-value-filter.pipe';
import {ClipboardModule} from 'ngx-clipboard/dist';

describe('AboutDetailsComponent', () => {
  let component: AboutDetailsComponent;
  let fixture: ComponentFixture<AboutDetailsComponent>;
  const toastyService = new MockToastyService();
  let activeRoute: MockActivatedRoute;
  const aboutService = new MockAboutService();
  const stompService = new StompService();

  beforeEach(async(() => {
    aboutService.isAboutInfoAvailable = true;
    aboutService.isFeatureEnabled = true;
    aboutService.isPlatformSpecificInformationAvailable = true;
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      imports: [
        BusyModule,
        RouterTestingModule.withRoutes([]),
        ClipboardModule
      ],
      declarations: [AboutDetailsComponent, KeyValuePipe],
      providers: [
        {provide: AboutService, useValue: aboutService},
        {provide: ToastyService, useValue: toastyService},
        {provide: ActivatedRoute, useValue: activeRoute},
        {provide: StompService, useValue: stompService}
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

    // verify Data Flow Server Implementation
    validateColumnValues('dataFlowVersionTable', ['Name', 'Version'], 0);
    validateColumnValues('dataFlowVersionTable', ['FOO', 'BAR'], 1);

    // Verify Enabled Features
    validateColumnValues('enabledFeaturesTable', ['Analytics', 'Streams', 'Tasks', 'Skipper Mode'], 0);
    validateSpansExists(['analyticsEnabled', 'streamsEnabled', 'tasksEnabled', 'skipperEnabled']);

    // Verify Security Information
    validateColumnValues('securityInformationTable', ['Authentication', 'Authorization',
      'Form Login', 'Authenticated', 'Username', 'Roles'], 0);
    validateSpansExists(['authenticationEnabled', 'authorizationEnabled', 'formLoginEnabled', 'authenticateEnabled']);
    validateTdValue('username', 'joe');
    validateTdValue('roles', 'base_role');

    // Starting Version
    validateColumnValues('versionInformationTable', ['Implementation',
      'Core', 'Dashboard',
      'Shell', 'Shell Checksum Sha1', 'Shell Checksum Sha256'], 0);
    validateColumnValues('versionInformationTable',
      ['BAR (FOO)', 'BOO (BAZ)', 'QIX (QUE)', 'QUUX (QUX)', 'checksumSample1', 'checksumSample256'], 1);

    // App Deployer Table
    validateColumnValues('appDeployerTable', ['Implementation Version', 'Name', 'Spi Version',
      'Java Version', 'Platform Api Version', 'Platform Client Version', 'Platform Host Version', 'Platform Type',
      'Spring Boot Version', 'Spring Version'], 0);
    validateColumnValues('appDeployerTable', ['DEP_IMP_VER', 'FOODeployer', 'DEP_SPI_VER',
      'JAV_VER', 'PLA_API_VER', 'PLA_CLI_VER', 'PLA_HOS_VER', 'FOO_PLATFORM', 'SPR_BOO_VER', 'SPR_VER'], 1);

    // App Deployer Platform Specific Table
    validateColumnValues('appDeployerPlatformSpecificTable', ['key1', 'key2'], 0);
    validateColumnValues('appDeployerPlatformSpecificTable', ['value1', 'value2'], 1);

    // Task Launcher Table
    validateColumnValues('taskLauncherTable', ['Implementation Version', 'Name', 'Spi Version',
      'Java Version', 'Platform Api Version', 'Platform Client Version', 'Platform Host Version', 'Platform Type',
      'Spring Boot Version', 'Spring Version'], 0);
    validateColumnValues('taskLauncherTable', ['DEP_IMP_VER_TASK', 'FOODeployer_TASK', 'DEP_SPI_VER_TASK',
      'JAV_VER_TASK', 'PLA_API_VER_TASK', 'PLA_CLI_VER_TASK', 'PLA_HOS_VER_TASK', 'FOO_PLATFORM_TASK',
      'SPR_BOO_VER_TASK', 'SPR_VER_TASK'], 1);

    // App Task Launcher Platform Specific Table
    validateColumnValues('appTaskLauncherPlatformSpecificTable', ['key1_task', 'key2_task'], 0);
    validateColumnValues('appTaskLauncherPlatformSpecificTable', ['value1_task', 'value2_task'], 1);
  });

  it('Should display base information and services are disabled.', () => {
    aboutService.isFeatureEnabled = false;
    fixture.detectChanges();
    expect(component).toBeTruthy();

    // Verify Enabled Features
    validateColumnValues('enabledFeaturesTable', ['Analytics', 'Streams', 'Tasks', 'Skipper Mode'], 0);
    validateSpansExists(['analyticsDisabled', 'streamsDisabled', 'tasksDisabled', 'skipperDisabled']);

    // Verify Security Information
    validateColumnValues('securityInformationTable', ['Authentication', 'Authorization',
      'Form Login', 'Authenticated', 'Username', 'Roles'], 0);
    validateSpansExists(['authenticationDisabled', 'authorizationDisabled', 'formLoginDisabled', 'authenticateDisabled']);
    validateTdValue('username', 'joe');
    validateTdValue('roles', 'base_role');
  });

  it('Should display no platform specific information available.', () => {
    aboutService.isPlatformSpecificInformationAvailable = false;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    validateTdValue('noAppDeployerPlatformMessage', 'No platform-specific app deployer information available.');
    validateTdValue('noTaskLauncherPlatformMessage', 'No platform-specific task launcher information available.');
  });

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

  it('Should navigate to the details page.', () => {
    fixture.detectChanges();
    const de: DebugElement = fixture.debugElement.query(By.css('button[id=back-button]'));
    const el: HTMLElement = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');
    fixture.detectChanges();
    el.click();

    expect(navigate).toHaveBeenCalledWith(['about']);
  });

  function validateSpansExists(spans: string[]): void {
    let de;
    for (const idOfSpan of spans) {
      de = fixture.debugElement.query(By.css('span[id=' + idOfSpan + ']'));
      expect(de.name === idOfSpan);
    }
  }

  function validateColumnValues(idOfTable: string, values: string[], startingIndex: number): void {
    const des = fixture.debugElement.queryAll(By.css('table[id="' + idOfTable + '"] td'));
    expect(des.length).toBe(values.length * 2);
    let currentPosition = startingIndex;
    for (const currentName of values) {
      expect(des[currentPosition].nativeElement.textContent).toContain(currentName);
      currentPosition += 2;
    }
  }

  function validateTdValue(tdId: string, tdValue: string): void {
    const de = fixture.debugElement.query(By.css('td[id=' + tdId + ']'));
    expect(de.nativeElement.textContent).toContain(tdValue);
  }
});
