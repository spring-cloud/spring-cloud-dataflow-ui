import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SecurityServiceMock} from '../../../../tests/api/security.service.mock';
import {AboutServiceMock} from '../../../../tests/api/about.service.mock';
import {NotificationServiceMock} from '../../../../tests/service/notification.service.mock';
import {RuntimeServiceMock} from '../../../../tests/api/runtime.service.mock.spec';
import {GrafanaServiceMock} from '../../../../tests/service/grafana.service.mock';
import {BuilderComponent} from './builder.component';
import {TaskServiceMock} from '../../../../tests/api/task.service.mock';
import {TaskLaunchServiceMock} from '../../../../tests/service/task-launch.service.mock';
import {RoleDirective} from '../../../../security/directive/role.directive';
import {ContextServiceMock} from '../../../../tests/service/context.service.mock';
import {Task} from '../../../../shared/model/task.model';
import {SIMPLE_TASK_DEFAULT, COMPOSED_TASK_DEFAULT} from '../../../../tests/data/task';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../../../assets/i18n/en.json';

describe('tasks-jobs/tasks/launch/builder/builder.component.ts', () => {
  let component: BuilderComponent;
  let fixture: ComponentFixture<BuilderComponent>;
  const TASK_1 = Task.parse(SIMPLE_TASK_DEFAULT);
  const TASK_2 = Task.parse(COMPOSED_TASK_DEFAULT);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BuilderComponent, RoleDirective],
        imports: [
          FormsModule,
          ReactiveFormsModule,
          ClarityModule,
          TranslateTestingModule.withTranslations('en', TRANSLATIONS),
          RouterTestingModule.withRoutes([]),
          BrowserAnimationsModule
        ],
        providers: [
          SecurityServiceMock.provider,
          AboutServiceMock.provider,
          NotificationServiceMock.provider,
          RuntimeServiceMock.provider,
          GrafanaServiceMock.provider,
          TaskServiceMock.provider,
          TaskLaunchServiceMock.provider,
          ContextServiceMock.provider
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created with simple task', () => {
    component.task = TASK_1;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should be created with composed task', () => {
    component.task = TASK_2;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should parse arguments correctly', async () => {
    component.task = TASK_2;
    component.arguments = ['app.t1.0=--arg', 'app.t2.0=--arg'];
    fixture.detectChanges();
    expect(component['getArguments']()).toEqual(jasmine.arrayContaining(['app.t1.0=--arg', 'app.t2.0=--arg']));
  });

  it('should parse and dehydrate properties correctly', async () => {
    component.task = TASK_2;
    component.properties = [
      'app.composed-task-runner.split-thread-max-pool-size=10',
      'deployer.t1.cpu=1',
      'app.t1.timestamp.format=yyyy'
    ];
    fixture.detectChanges();
    expect(component['getProperties']()).toEqual(
      jasmine.arrayContaining([
        'app.composed-task-runner.split-thread-max-pool-size=10',
        'deployer.t1.cpu=1',
        'app.t1.timestamp.format=yyyy'
      ])
    );
  });

  it('should set property value empty when it is cleared', async () => {
    component.task = TASK_2;
    component.properties = [
      'app.composed-task-runner.split-thread-max-pool-size=',
      'deployer.t1.cpu=1',
      'app.t1.timestamp.format=yyyy'
    ];
    fixture.detectChanges();
    expect(component['getProperties']()).toEqual(
      jasmine.arrayContaining([
        'app.composed-task-runner.split-thread-max-pool-size=',
        'deployer.t1.cpu=1',
        'app.t1.timestamp.format=yyyy'
      ])
    );
  });

  it('should have migrations', async () => {
    component.task = TASK_2;
    component.properties = [
      'app.composed-task-runner.composed-task-properties=app.composedtask-t2.app.timestamp.timestamp.format=YYYY',
      'app.t1.timestamp.format=YYYY'
    ];
    fixture.detectChanges();
    expect(component['calculateMigrations']().migratedMatch.length).toBe(1);
    expect(component['calculateMigrations']().migratedNomatch.length).toBe(0);
    expect(component['hasMigrations']()).toBeTruthy();
  });

  it('should not have migrations', async () => {
    component.task = TASK_2;
    component.properties = ['app.t1.timestamp.format=YYYY'];
    fixture.detectChanges();
    expect(component['calculateMigrations']().migratedMatch.length).toBe(0);
    expect(component['calculateMigrations']().migratedNomatch.length).toBe(0);
    expect(component['hasMigrations']()).toBeFalsy();
  });
});
