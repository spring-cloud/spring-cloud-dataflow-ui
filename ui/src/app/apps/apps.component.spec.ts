import { AppsComponent } from './apps.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppServiceMock } from '../tests/api/app.service.mock';
import { AboutServiceMock } from '../tests/api/about.service.mock';
import { SecurityServiceMock } from '../tests/api/security.service.mock';
import { TypeFilterComponent } from './type.filter';
import { UnregisterComponent } from './unregister/unregister.component';
import { NotificationServiceMock } from '../tests/service/notification.service.mock';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { VersionComponent } from './version/version.component';
import { ConfirmComponent } from '../shared/component/confirm/confirm.component';
import { ContextServiceMock } from '../tests/service/context.service.mock';
import { SettingsServiceMock } from '../tests/service/settings.service.mock';
import { DatagridColumnPipe } from '../shared/pipe/datagrid-column.pipe';

describe('apps/apps.component.ts', () => {

  let component: AppsComponent;
  let fixture: ComponentFixture<AppsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppsComponent,
        TypeFilterComponent,
        UnregisterComponent,
        VersionComponent,
        ConfirmComponent,
        DatagridColumnPipe
      ],
      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        AppServiceMock.provider,
        NotificationServiceMock.provider,
        ContextServiceMock.provider,
        SettingsServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsComponent);
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
    expect(title.textContent).toContain('Applications');
    expect(rows.length === 20).toBeTruthy();
    expect(cols.length === 5).toBeTruthy();
    done();
  });

  it('should display the actions', async (done) => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const btnUnregisterApplications = fixture.debugElement.query(By.css('#btnUnregisterApplications'));
    const btnGroupActions = fixture.debugElement.query(By.css('#btnGroupActions')).nativeElement;
    const btnAddApplications = fixture.debugElement.query(By.css('#btnAddApplications')).nativeElement;
    const btnRefresh = fixture.debugElement.query(By.css('#btnRefresh')).nativeElement;
    expect(btnGroupActions).toBeTruthy();
    expect(btnAddApplications).toBeTruthy();
    expect(btnRefresh).toBeTruthy();
    expect(btnUnregisterApplications).toBeNull();
    done();
  });

  it('should display the group mode', async (done) => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    let btnGroupActions = fixture.debugElement.query(By.css('#btnGroupActions')).nativeElement;
    btnGroupActions.click();
    fixture.detectChanges();
    btnGroupActions = fixture.debugElement.query(By.css('#btnGroupActions'));
    const btnUnregisterApplications: HTMLButtonElement = fixture.debugElement
      .query(By.css('#btnUnregisterApplications')).nativeElement;
    const btnRefresh = fixture.debugElement.query(By.css('#btnRefresh'));
    const checkboxes = fixture.debugElement.queryAll(By.css('.datagrid input[type=checkbox]'));
    expect(checkboxes.length === 21).toBeTruthy();
    expect(btnRefresh).toBeNull();
    expect(btnGroupActions).toBeNull();
    expect(btnUnregisterApplications).toBeTruthy();
    expect(btnUnregisterApplications.disabled).toBeTruthy();
    done();
  });

  // it('should display the unregister applications confirmation', async (done) => {
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   fixture.detectChanges();
  //   const btnGroupActions = fixture.debugElement.query(By.css('#btnGroupActions')).nativeElement;
  //   btnGroupActions.click();
  //   fixture.detectChanges();
  //   const btnUnregisterApplications: HTMLButtonElement = fixture.debugElement
  //     .query(By.css('#btnUnregisterApplications')).nativeElement;
  //   const checkboxes: DebugElement[] = fixture.debugElement.queryAll(By.css('.datagrid input[type=checkbox]'));
  //   console.log(checkboxes.length)
  //   checkboxes[1].nativeElement.click();
  //   checkboxes[2].nativeElement.click();
  //   await fixture.whenStable();
  //   fixture.detectChanges();
  //   btnUnregisterApplications.click();
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   fixture.detectChanges();
  //   const modal = fixture.debugElement.query(By.css('app-unregister'));
  //   expect(modal).toBeTruthy();
  //   const title = modal.query(By.css('.modal-title-wrapper')).nativeElement;
  //   expect(title.textContent).toContain('Confirm Unregister Applications');
  //   done();
  // });

  it('should navigate to the application details page (menu)', async (done) => {
    fixture.detectChanges();
    const navigate = spyOn((<any>component).router, 'navigateByUrl');
    await fixture.whenStable();
    fixture.detectChanges();
    component.details(component.page.items[0]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(navigate).toHaveBeenCalledWith('apps/processor/aggregator');
    done();
  });

  it('should navigate to the application details page (datagrid)', async (done) => {
    fixture.detectChanges();
    const navigate = spyOn((<any>component).router, 'navigateByUrl');
    await fixture.whenStable();
    fixture.detectChanges();
    const row = fixture.debugElement.query(By.css('clr-dg-row clr-dg-cell'));
    const link: HTMLElement = row.query(By.css('a')).nativeElement;
    link.click();
    fixture.detectChanges();
    expect(navigate).toHaveBeenCalledWith('apps/processor/aggregator');
    done();
  });

  it('should navigate to the add page', async (done) => {
    fixture.detectChanges();
    const navigate = spyOn((<any>component).router, 'navigateByUrl');
    await fixture.whenStable();
    fixture.detectChanges();
    const btnAddApplications = fixture.debugElement.query(By.css('#btnAddApplications')).nativeElement;
    btnAddApplications.click();
    fixture.detectChanges();
    expect(navigate).toHaveBeenCalledWith('apps/add');
    done();
  });

  it('should sort the datagrid', async (done) => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const refresh = spyOn((<any>component), 'refresh');
    const cols = fixture.debugElement.queryAll(By.css('clr-dg-column'));
    // Name
    cols[0].query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'name', reverse: true }
    });
    cols[0].query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'name', reverse: false }
    });
    // Type
    cols[1].query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'type', reverse: false }
    });
    cols[1].query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'type', reverse: true }
    });
    // Version
    cols[2].query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'version', reverse: false }
    });
    cols[2].query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'version', reverse: true }
    });
    // URI
    cols[3].query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'uri', reverse: false }
    });
    cols[3].query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    expect(refresh).toHaveBeenCalledWith({
      page: { from: 0, to: 19, size: 20, current: 1 },
      sort: { by: 'uri', reverse: true }
    });
    done();
  });

});
