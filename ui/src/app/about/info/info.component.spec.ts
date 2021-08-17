import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SecurityServiceMock} from '../../tests/api/security.service.mock';
import {AboutServiceMock} from '../../tests/api/about.service.mock';
import {AppServiceMock} from '../../tests/api/app.service.mock';
import {NotificationServiceMock} from '../../tests/service/notification.service.mock';
import {InfoComponent} from './info.component';

describe('about/info/info.component.ts', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InfoComponent],
        imports: [FormsModule, ClarityModule, RouterTestingModule.withRoutes([]), BrowserAnimationsModule],
        providers: [
          SecurityServiceMock.provider,
          AboutServiceMock.provider,
          AppServiceMock.provider,
          NotificationServiceMock.provider
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
