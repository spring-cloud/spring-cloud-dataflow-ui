import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { RouterTestingModule } from '@angular/router/testing';
import { FloModule } from 'spring-flo';
import { ModalModule, BsModalService} from 'ngx-bootstrap';
import { TaskCreateComposedTaskComponent } from './task-create-composed-task.component';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';
import { EditorService } from '../flo/editor.service';
import { ContentAssistService } from '../flo/content-assist.service';
import { BusyModule } from 'angular2-busy';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockSharedAppService } from '../../tests/mocks/shared-app';
import { MockToolsService } from '../../tests/mocks/mock-tools';

/**
 * Test {@link TaskCreateComposedTaskComponent}.
 *
 * @author Janne Valkealahti
 */
describe('TaskCreateComposedTaskComponent', () => {
  let component: TaskCreateComposedTaskComponent;
  let fixture: ComponentFixture<TaskCreateComposedTaskComponent>;
  let activeRoute: MockActivatedRoute;
  const metamodelService = new MetamodelService(new MockSharedAppService(), new MockToolsService());

  const commonTestParams = { id: '1' };

  beforeEach(async () => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        TaskCreateComposedTaskComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        ModalModule,
        FloModule,
        BusyModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: MetamodelService, useValue: metamodelService},
        {provide: RenderService},
        {provide: EditorService},
        {provide: BsModalService},
        {provide: ContentAssistService}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskCreateComposedTaskComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
