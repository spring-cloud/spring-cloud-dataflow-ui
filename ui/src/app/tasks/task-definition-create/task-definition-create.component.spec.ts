import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { RouterTestingModule } from '@angular/router/testing';
import { MetamodelService } from '../components/flo/metamodel.service';
import { MockSharedAppService } from '../../tests/mocks/shared-app';
import { MockToolsService } from '../../tests/mocks/mock-tools';
import { TaskDefinitionCreateComponent } from './task-definition-create.component';
import { LoggerService } from '../../shared/services/logger.service';
import { TasksModule } from '../tasks.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

  const commonTestParams = { id: '1' };

  beforeEach(async () => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      imports: [
        TasksModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: MetamodelService, useValue: metamodelService }
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
