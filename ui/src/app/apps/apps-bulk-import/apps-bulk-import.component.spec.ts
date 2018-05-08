import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalRef, ModalModule, PopoverModule } from 'ngx-bootstrap';
import { AppsService } from '../apps.service';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockAppsService } from '../../tests/mocks/apps';
import { AppsBulkImportComponent } from './apps-bulk-import.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BusyService } from '../../shared/services/busy.service';
import { NotificationService } from '../../shared/services/notification.service';

/**
 * Test {@link AppsBulkImportComponent}.
 *
 * @author Damien Vitrac
 */
describe('AppsBulkImportComponent', () => {
  let component: AppsBulkImportComponent;
  let fixture: ComponentFixture<AppsBulkImportComponent>;
  const bsModalRef = new BsModalRef();
  const notificationService = new MockNotificationService();
  const appsService = new MockAppsService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppsBulkImportComponent
      ],
      imports: [
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AppsService, useValue: appsService },
        { provide: BusyService, useValue: new BusyService() },
        { provide: BsModalRef, useValue: bsModalRef },
        { provide: NotificationService, useValue: notificationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsBulkImportComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
