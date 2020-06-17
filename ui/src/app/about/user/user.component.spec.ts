import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { UserComponent } from './user.component';
import { SecurityServiceMock } from '../../../app/tests/api/security.service.mock';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserComponent ],
      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        SecurityServiceMock.provider,
        // AboutServiceMock.provider,
        // AppServiceMock.provider,
        // NotificationServiceMock.provider,
        // ContextService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
