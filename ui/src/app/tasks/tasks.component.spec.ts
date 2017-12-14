import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { AppRoutingModule } from '../app-routing.module';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RolesDirective } from '../auth/directives/roles.directive';
import { MockAuthService } from '../tests/mocks/auth';
import { AuthService } from '../auth/auth.service';
import { SharedAboutService } from '../shared/services/shared-about.service';
import { MocksSharedAboutService } from '../tests/mocks/shared-about';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const authService = new MockAuthService();
  const aboutService = new MocksSharedAboutService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasksComponent, RolesDirective ],
      imports: [AppRoutingModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: SharedAboutService, useValue: aboutService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
    expect(el.textContent).toContain('Tasks');
  });

});
