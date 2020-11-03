import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { StreamServiceMock } from '../../../tests/api/stream.service.mock';
import { GrafanaServiceMock } from '../../../tests/service/grafana.service.mock';
import { StatusComponent } from './status.component';
import { By } from '@angular/platform-browser';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('streams/streams/stream/stream.component.ts', () => {

  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        StatusComponent,
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
        GrafanaServiceMock.provider,
        ContextServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    component.open();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(component).toBeTruthy();
    expect(title.textContent).toContain('Stream status');
    component.close();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.modal-title-wrapper'))).toBeFalsy();
  });

});
