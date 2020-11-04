import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { AppServiceMock } from '../../tests/api/app.service.mock';
import { NotificationServiceMock } from '../../tests/service/notification.service.mock';
import { RecordServiceMock } from '../../tests/api/record.service.mock';
import { RecordsComponent } from './records.component';
import { DateFilterComponent } from '../../shared/filter/date/date.filter';
import { OperationFilterComponent } from './operation.filter';
import { ActionFilterComponent } from './action.filter';
import { By } from '@angular/platform-browser';
import { DatetimePipe } from '../../shared/pipe/datetime.pipe';
import { RoleDirective } from '../../security/directive/role.directive';
import { ContextServiceMock } from '../../tests/service/context.service.mock';
import { SettingsServiceMock } from '../../tests/service/settings.service.mock';
import { ConfirmComponent } from '../../shared/component/confirm/confirm.component';
import { DatagridColumnPipe } from '../../shared/pipe/datagrid-column.pipe';

describe('manage/records/records.component.ts', () => {

  let component: RecordsComponent;
  let fixture: ComponentFixture<RecordsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        RecordsComponent,
        DateFilterComponent,
        OperationFilterComponent,
        ActionFilterComponent,
        DatetimePipe,
        RoleDirective,
        DatagridColumnPipe
      ],
      imports: [
        FormsModule,
        ClarityModule,
        BrowserAnimationsModule,
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        AppServiceMock.provider,
        NotificationServiceMock.provider,
        RecordServiceMock.provider,
        ContextServiceMock.provider,
        SettingsServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the datagrid, pagination, action bar', async (done) => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const datagrid = fixture.debugElement.query(By.css('clr-datagrid')).nativeElement;
    const pagination = fixture.debugElement.query(By.css('clr-dg-pagination')).nativeElement;
    const actionBar = fixture.debugElement.query(By.css('clr-dg-action-bar')).nativeElement;
    const rows = fixture.debugElement.queryAll(By.css('clr-dg-row'));
    const cols = fixture.debugElement.queryAll(By.css('clr-dg-column'));
    const title = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(datagrid).toBeTruthy();
    expect(pagination).toBeTruthy();
    expect(actionBar).toBeTruthy();
    expect(title.textContent).toContain('Records');
    expect(rows.length === 20).toBeTruthy();
    expect(cols.length === 7).toBeTruthy();
    done();
  });

  it('should sort the datagrid', async (done) => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const refresh = spyOn((<any>component), 'refresh');
    const cols = fixture.debugElement.queryAll(By.css('clr-dg-column'));
    // id
    cols[0].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'id', reverse: false }
    });
    cols[0].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'id', reverse: true }
    });
    // createOn
    cols[1].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'createdOn', reverse: false }
    });
    cols[1].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'createdOn', reverse: true }
    });
    // auditAction
    cols[2].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'auditAction', reverse: false }
    });
    cols[2].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'auditAction', reverse: true }
    });
    // auditOperation
    cols[3].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'auditOperation', reverse: false }
    });
    cols[3].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'auditOperation', reverse: true }
    });
    // correlationId
    cols[4].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'correlationId', reverse: false }
    });
    cols[4].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'correlationId', reverse: true }
    });
    // createdBy
    cols[5].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'createdBy', reverse: false }
    });
    cols[5].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'createdBy', reverse: true }
    });
    // platformName
    cols[6].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'platformName', reverse: false }
    });
    cols[6].query(By.css('button.datagrid-column-title')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'platformName', reverse: true }
    });
    done();
  });

});
