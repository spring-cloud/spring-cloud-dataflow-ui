import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { StreamServiceMock } from '../../../tests/api/stream.service.mock';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs';
import { Stream } from '../../../shared/model/stream.model';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';
import { CloneComponent } from './clone.component';

describe('apps/streams/clone/clone.component.ts', () => {

  let component: CloneComponent;
  let fixture: ComponentFixture<CloneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CloneComponent
      ],
      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        ReactiveFormsModule,
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
    fixture = TestBed.createComponent(CloneComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
    // Stream.parse({ name: 'bar', dslText: 'file|log' }),
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
