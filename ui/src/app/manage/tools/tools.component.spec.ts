import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {TypeFilterComponent} from '../../apps/type.filter';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SecurityServiceMock} from '../../tests/api/security.service.mock';
import {AboutServiceMock} from '../../tests/api/about.service.mock';
import {NotificationServiceMock} from '../../tests/service/notification.service.mock';
import {ToolsComponent} from './tools.component';
import {StreamServiceMock} from '../../tests/api/stream.service.mock';
import {TaskServiceMock} from '../../tests/api/task.service.mock';
import {StreamExportComponent} from './stream/export.component';
import {StreamImportComponent} from './stream/import.component';
import {TaskExportComponent} from './task/export.component';
import {TaskImportComponent} from './task/import.component';
import {CardComponent} from '../../shared/component/card/card.component';
import {ImportExportServiceMock} from '../../tests/service/import-export.service.mock';
import {By} from '@angular/platform-browser';
import {RoleDirective} from '../../security/directive/role.directive';
import {ContextServiceMock} from '../../tests/service/context.service.mock';
import {CleanupComponent} from './cleanup/cleanup.component';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../assets/i18n/en.json';

describe('manage/tools/import-export.component.ts', () => {
  let component: ToolsComponent;
  let fixture: ComponentFixture<ToolsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToolsComponent,
        TypeFilterComponent,
        StreamExportComponent,
        StreamImportComponent,
        TaskExportComponent,
        TaskImportComponent,
        CleanupComponent,
        CardComponent,
        RoleDirective
      ],
      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        TranslateTestingModule.withTranslations('en', TRANSLATIONS)
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        StreamServiceMock.provider,
        TaskServiceMock.provider,
        NotificationServiceMock.provider,
        ImportExportServiceMock.provider,
        ContextServiceMock.provider
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    NotificationServiceMock.mock.clearAll();
    fixture = TestBed.createComponent(ToolsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should open the stream export modal', () => {
    component.run('export-stream');
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const title = fixture.debugElement.query(By.css('app-manage-stream-export .modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Export stream(s)');
  });

  it('should open the stream export modal', () => {
    component.run('import-stream');
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const title = fixture.debugElement.query(By.css('app-manage-stream-import .modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Import stream(s)');
  });

  it('should open the task export modal', () => {
    component.run('export-task');
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const title = fixture.debugElement.query(By.css('app-manage-task-export .modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Export task(s)');
  });

  it('should open the task export modal', () => {
    component.run('import-task');
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const title = fixture.debugElement.query(By.css('app-manage-task-import .modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Import task(s)');
  });
});
