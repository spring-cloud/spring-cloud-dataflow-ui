import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RoleDirective } from '../../../security/directive/role.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { TaskServiceMock } from '../../../tests/api/task.service.mock';
import { GroupServiceMock } from '../../../tests/service/group.service.mock';
import { ToolsServiceMock } from '../../../tests/service/task-tools.service.mock';
import { LaunchComponent } from './launch.component';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { KeyValueComponent } from '../../../shared/component/key-value/key-value.component';

describe('tasks-jobs/tasks/launch/launch.component.ts', () => {

  let component: LaunchComponent;
  let fixture: ComponentFixture<LaunchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        LaunchComponent,
        RoleDirective,
        KeyValueComponent
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
        TaskServiceMock.provider,
        GroupServiceMock.provider,
        ToolsServiceMock.provider,
        ContextServiceMock.provider,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({name: 'task1'}),
          },
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should launch the task', async (done: DoneFn) => {
    fixture.detectChanges();
    await fixture.whenStable();
    component.form.get('args').setValue('app.foo=bar');
    component.form.get('props').setValue('app.bar=foo');
    fixture.detectChanges();
    component.launch();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toContain('Launch task');
    done();
  });

});
