import { TypeFilterComponent } from './type.filter';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../tests/api/security.service.mock';
import { AboutServiceMock } from '../tests/api/about.service.mock';
import { AppServiceMock } from '../tests/api/app.service.mock';
import { NotificationServiceMock } from '../tests/service/notification.service.mock';
import { By } from '@angular/platform-browser';

describe('apps/type.filter.ts', () => {

  let component: TypeFilterComponent;
  let fixture: ComponentFixture<TypeFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TypeFilterComponent,
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
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeFilterComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set the value', () => {
    component.value = 'processor';
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.val).toBe('processor');
    const radio = fixture.debugElement.queryAll(By.css('input[type=radio]'));
    radio[0].nativeElement.click();
    fixture.detectChanges();
    expect(component.value).toBeNull();
    radio[1].nativeElement.click();
    fixture.detectChanges();
    expect(`${component.value}`).toBe('source');
    expect(component.isActive()).toBeTruthy();
    expect(component.accepts(null)).toBeTruthy();
  });

});
