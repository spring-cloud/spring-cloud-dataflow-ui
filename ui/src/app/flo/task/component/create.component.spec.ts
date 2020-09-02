import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskFloCreateComponent } from './create.component';
import { MetamodelService } from '../metamodel.service';
import { LoggerService } from '../../../shared/service/logger.service';
import { MockSharedAppService } from '../../../tests/service/app.service.mock';
import { ToolsServiceMock } from '../../../tests/service/task-tools.service.mock';
import { TaskFloModule } from '../../task-flo.module';
import { StoreModule } from '@ngrx/store';

/**
 * Test {@link TaskDefinitionCreateComponent}.
 *
 * @author Janne Valkealahti
 */
describe('TaskFloCreateComponent', () => {
  let component: TaskFloCreateComponent;
  let fixture: ComponentFixture<TaskFloCreateComponent>;
  const loggerService = new LoggerService();
  const metamodelService = new MetamodelService(new MockSharedAppService(), loggerService, new ToolsServiceMock());

  const commonTestParams = { id: '1' };

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        TaskFloModule,
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
    fixture = TestBed.createComponent(TaskFloCreateComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
