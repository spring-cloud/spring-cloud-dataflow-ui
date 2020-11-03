import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StreamHistory } from '../../../shared/model/stream.model';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { StreamServiceMock } from '../../../tests/api/stream.service.mock';
import { RollbackComponent } from './rollback.component';
import { GET_STREAM_HISTORY } from '../../../tests/data/stream';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs';
import { RoleDirective } from '../../../security/directive/role.directive';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('streams/streams/rollback/rollback.component.ts', () => {

  let component: RollbackComponent;
  let fixture: ComponentFixture<RollbackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        RollbackComponent,
        RoleDirective
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
        NotificationServiceMock.provider,
        StreamServiceMock.provider,
        ContextServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollbackComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    component.open(StreamHistory.parse(GET_STREAM_HISTORY));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display a success message', async (done) => {
    component.open(StreamHistory.parse(GET_STREAM_HISTORY));
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Rollback success');
    done();
  });

  it('should display an error', async (done) => {
    spyOn(StreamServiceMock.mock, 'rollbackStream').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    component.open(StreamHistory.parse(GET_STREAM_HISTORY));
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    done();
  });

});
