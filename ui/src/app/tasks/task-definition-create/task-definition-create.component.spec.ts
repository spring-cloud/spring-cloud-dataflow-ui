import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { RouterTestingModule } from '@angular/router/testing';
import { FloModule } from 'spring-flo';
import { ModalModule, BsModalService, BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { MetamodelService } from '../components/flo/metamodel.service';
import { RenderService } from '../components/flo/render.service';
import { EditorService } from '../components/flo/editor.service';
import { ContentAssistService } from '../components/flo/content-assist.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockSharedAppService } from '../../tests/mocks/shared-app';
import { MockToolsService } from '../../tests/mocks/mock-tools';
import { ToolsService } from '../components/flo/tools.service';
import { TaskDefinitionCreateComponent } from './task-definition-create.component';
import { LoggerService } from '../../shared/services/logger.service';
import { DATAFLOW_LIST } from 'src/app/shared/components/list/list.component';
import { PagerComponent } from 'src/app/shared/components/pager/pager.component';
import { DATAFLOW_PAGE } from '../../shared/components/page/page.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { NotificationService } from '../../shared/services/notification.service';
import { MockNotificationService } from '../../tests/mocks/notification';

/**
 * Test {@link TaskDefinitionCreateComponent}.
 *
 * @author Janne Valkealahti
 */
describe('TaskCreateComposedTaskComponent', () => {
  let component: TaskDefinitionCreateComponent;
  let fixture: ComponentFixture<TaskDefinitionCreateComponent>;
  let activeRoute: MockActivatedRoute;
  const loggerService = new LoggerService();
  const metamodelService = new MetamodelService(new MockSharedAppService(), loggerService, new MockToolsService());
  const toolsService = new MockToolsService();
  const routingStateService = new MockRoutingStateService();
  const notificationService = new MockNotificationService();

  const commonTestParams = { id: '1' };

  beforeEach(async () => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        TaskDefinitionCreateComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        PagerComponent
      ],
      imports: [
        FormsModule,
        NgxPaginationModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ModalModule,
        FloModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MetamodelService, useValue: metamodelService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: NotificationService, useValue: notificationService },
        { provide: RenderService },
        { provide: EditorService },
        { provide: BsModalService },
        { provide: ContentAssistService },
        { provide: ToolsService, useValue: toolsService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskDefinitionCreateComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
