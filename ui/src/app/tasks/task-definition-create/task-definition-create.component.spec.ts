import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { RouterTestingModule } from '@angular/router/testing';
import { FloModule } from 'spring-flo';
import { ModalModule, BsModalService} from 'ngx-bootstrap';
import { MetamodelService } from '../components/flo/metamodel.service';
import { RenderService } from '../components/flo/render.service';
import { EditorService } from '../components/flo/editor.service';
import { ContentAssistService } from '../components/flo/content-assist.service';
import { NgBusyModule } from 'ng-busy';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockSharedAppService } from '../../tests/mocks/shared-app';
import { MockToolsService } from '../../tests/mocks/mock-tools';
import { ToolsService } from '../components/flo/tools.service';
import { TaskDefinitionCreateComponent } from './task-definition-create.component';

/**
 * Test {@link TaskDefinitionCreateComponent}.
 *
 * @author Janne Valkealahti
 */
describe('TaskCreateComposedTaskComponent', () => {
  let component: TaskDefinitionCreateComponent;
  let fixture: ComponentFixture<TaskDefinitionCreateComponent>;
  let activeRoute: MockActivatedRoute;
  const metamodelService = new MetamodelService(new MockSharedAppService(), new MockToolsService());
  const toolsService = new MockToolsService();

  const commonTestParams = { id: '1' };

  beforeEach(async () => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        TaskDefinitionCreateComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        ModalModule,
        FloModule,
        NgBusyModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: MetamodelService, useValue: metamodelService},
        {provide: RenderService},
        {provide: EditorService},
        {provide: BsModalService},
        {provide: ContentAssistService},
        {provide: ToolsService, useValue: toolsService}
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
