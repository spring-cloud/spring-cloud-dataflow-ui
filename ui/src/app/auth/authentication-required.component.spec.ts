import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AuthenticationRequiredComponent } from './authentication-required.component';
import { DATAFLOW_PAGE } from '../shared/components/page/page.component';
import { PagerComponent } from '../shared/components/pager/pager.component';
import { TippyDirective } from '../shared/directives/tippy.directive';

describe('AuthenticationRequiredComponent', () => {
  let component: AuthenticationRequiredComponent;
  let fixture: ComponentFixture<AuthenticationRequiredComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuthenticationRequiredComponent,
        DATAFLOW_PAGE,
        TippyDirective
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationRequiredComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('AuthenticationRequiredComponent should be instantiated.', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(debugElement.query(By.css('h1')).nativeElement.innerText).toContain('Authentication required');
  });
});
