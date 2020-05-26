import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { StreamServiceMock } from '../../../tests/api/stream.service.mock';
import { GrafanaServiceMock } from '../../../tests/service/grafana.service.mock';
import { ContextService } from '../../../shared/service/context.service';
import { CreateComponent } from './create.component';
import { ParserService } from '../../../flo/shared/service/parser.service';
import { StreamFloCreateComponent } from '../../../flo/stream/component/create.component';
import { AppServiceMock } from '../../../tests/api/app.service.mock';
import { MetamodelService } from '../../../flo/stream/metamodel.service';
import { EditorService } from '../../../flo/stream/editor.service';
import { RenderService } from '../../../flo/stream/render.service';
import { ContentAssistServiceMock } from '../../../tests/api/content-assist.service.spec';
import { PropertiesGroupsDialogComponent } from '../../../flo/shared/properties-groups/properties-groups-dialog.component';
import { FloModule } from 'spring-flo';
import { PropertiesDialogComponent } from '../../../flo/shared/properties/properties-dialog.component';
import { DocService } from '../../../flo/shared/service/doc.service';
import { DestroyComponent } from '../destroy/destroy.component';
import { UpperCasePipe } from '@angular/common';

xdescribe('streams/streams/create/create.component.ts', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  const metamodelService = new MetamodelService(AppServiceMock.provider.useValue);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateComponent,
        StreamFloCreateComponent,
        PropertiesGroupsDialogComponent,
          PropertiesDialogComponent,
          UpperCasePipe
      ],
      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        FloModule
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        NotificationServiceMock.provider,
        StreamServiceMock.provider,
        GrafanaServiceMock.provider,
        { provide: MetamodelService, useValue: metamodelService },
        ContentAssistServiceMock.provider,
        ContextService,
        ParserService,
        EditorService,
        RenderService,
        DocService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
