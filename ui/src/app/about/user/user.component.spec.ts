import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {UserComponent} from './user.component';
import {throwError} from 'rxjs';
import {AppError} from 'src/app/shared/model/error.model';
import {NotificationServiceMock} from '../../tests/service/notification.service.mock';
import {SecurityServiceMock} from '../../../app/tests/api/security.service.mock';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../assets/i18n/en.json';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UserComponent],
        imports: [
          FormsModule,
          ClarityModule,
          TranslateTestingModule.withTranslations('en', TRANSLATIONS),
          RouterTestingModule.withRoutes([])
        ],
        providers: [
          SecurityServiceMock.provider,
          NotificationServiceMock.provider
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should catch API error and display a message', async done => {
    spyOn(SecurityServiceMock.mock, 'logout').and.callFake(() => throwError(new AppError('Fake error')));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    expect(NotificationServiceMock.mock.errorNotification[0].message.toString()).toBe('Fake error');
    done();
  });

});
