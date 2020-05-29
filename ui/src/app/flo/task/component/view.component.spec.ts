import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewComponent } from './view.component';
import { MockSharedAppService } from '../../../tests/service/app.service.mock';
import { MetamodelService } from '../metamodel.service';
import { RenderService } from '../render.service';
import { LoggerService } from '../../../shared/service/logger.service';
import { MockToolsService } from '../../../tests/service/task-tools.service.mock';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  const metamodelService = new MetamodelService(new MockSharedAppService(), new LoggerService(), new MockToolsService());
  const renderService = new RenderService(metamodelService);


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewComponent ],
      providers: [
        { provide: MetamodelService, useValue: metamodelService },
        { provide: RenderService, useValue: renderService }
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
