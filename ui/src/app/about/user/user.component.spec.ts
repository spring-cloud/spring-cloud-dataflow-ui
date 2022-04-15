import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {UserComponent} from './user.component';
import {throwError} from 'rxjs';
import {HttpError} from 'src/app/shared/model/error.model';
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
        providers: [SecurityServiceMock.provider, NotificationServiceMock.provider]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    NotificationServiceMock.mock.clearAll();
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
