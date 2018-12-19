import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureDisabledComponent } from './feature-disabled.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('FeatureDisabledComponent', () => {
  let component: FeatureDisabledComponent;
  let fixture: ComponentFixture<FeatureDisabledComponent>;
  let debugElement: DebugElement;

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      declarations:   [ FeatureDisabledComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureDisabledComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('FeatureDisabledComponent should be instantiated.', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(debugElement.query(By.css('h1')).nativeElement.innerText).toBe('Feature Disabled');
  });
});
