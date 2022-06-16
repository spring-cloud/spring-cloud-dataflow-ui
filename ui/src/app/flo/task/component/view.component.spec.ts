import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ViewComponent} from './view.component';
import {MockSharedAppService} from '../../../tests/service/app.service.mock';
import {MetamodelService} from '../metamodel.service';
import {RenderService} from '../render.service';
import {LoggerService} from '../../../shared/service/logger.service';
import {ToolsServiceMock} from '../../../tests/service/task-tools.service.mock';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../../assets/i18n/en.json';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {TaskFloModule} from '../../task-flo.module';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  const metamodelService = new MetamodelService(
    new MockSharedAppService(),
    new LoggerService(),
    new ToolsServiceMock()
  );
  const renderService = new RenderService(metamodelService);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewComponent],
      imports: [
        StoreModule.forRoot({}),
        TaskFloModule,
        TranslateTestingModule.withTranslations('en', TRANSLATIONS),
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {provide: MetamodelService, useValue: metamodelService},
        {provide: RenderService, useValue: renderService}
      ]
    }).compileComponents();
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
