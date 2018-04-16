import { DebugElement, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TruncatorWidthProviderDirective } from './truncator-width-provider.directive';
import { TruncatorComponent } from './truncator.component';

@Component({
  template: `
    <div id="wrapperDiv" [style.width.px]="divWidth">
     <dataflow-truncator [input]="inputText" [trailPosition]="trailPosition" [trail]="trail"></dataflow-truncator>
    </div>
  `
  })
  class TestTruncatorComponent {
    public inputText = 'foobar';
    public trailPosition = 'end';
    public trail = '…';
    public divWidth = 200;
  }

describe('TruncatorComponent', () => {

  let component: TestTruncatorComponent;
  let fixture: ComponentFixture<TestTruncatorComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTruncatorComponent, TestTruncatorComponent,
        TruncatorComponent,
        TruncatorWidthProviderDirective],
      providers: [TruncatorComponent]
    });
    fixture = TestBed.createComponent(TestTruncatorComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('#wrapperDiv span'));
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have a value', () => {
    fixture.detectChanges();
    expect(inputEl.nativeElement.textContent).toEqual('foobar');
  });
});
