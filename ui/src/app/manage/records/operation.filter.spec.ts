import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { AppServiceMock } from '../../tests/api/app.service.mock';
import { NotificationServiceMock } from '../../tests/service/notification.service.mock';
import { RecordServiceMock } from '../../tests/api/record.service.mock';
import { By } from '@angular/platform-browser';
import { OperationFilterComponent } from './operation.filter';
import { ContextServiceMock } from '../../tests/service/context.service.mock';

describe('manage/records/operation.filter.ts', () => {

  let component: OperationFilterComponent;
  let fixture: ComponentFixture<OperationFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        OperationFilterComponent,
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
        ContextServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationFilterComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set the value', async (done) => {
    component.value = 'STREAM';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.val).toBe('STREAM');
    const radio = fixture.debugElement.queryAll(By.css('input[type=radio]'));
    radio[0].nativeElement.click();
    fixture.detectChanges();
    expect(component.value).toBeNull();
    radio[1].nativeElement.click();
    fixture.detectChanges();
    expect(`${component.value}`).toBe('APP_REGISTRATION');
    expect(component.isActive()).toBeTruthy();
    expect(component.accepts(null)).toBeTruthy();
    done();
  });

});
