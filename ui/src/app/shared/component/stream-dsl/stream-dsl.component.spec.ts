import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { ClipboardCopyService } from '../../service/clipboard-copy.service';
import { StreamDslComponent } from './stream-dsl.component';
import { ParserService } from '../../../flo/shared/service/parser.service';
import { By } from '@angular/platform-browser';

describe('StreamDslComponent', () => {
  let component: StreamDslComponent;
  let fixture: ComponentFixture<StreamDslComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        StreamDslComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        NotificationServiceMock.provider,
        ParserService,
        ClipboardCopyService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamDslComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display a short dsl', () => {
    component.dsl = 'file --foo=bar | log';
    fixture.detectChanges();
    let dsl = fixture.debugElement.query(By.css('.stream-dsl')).nativeElement;
    expect(dsl.textContent).toContain('file | log');
    expect(component.getState()).toBe('collapsed');
    component.dsl = 'foo | bar';
    fixture.detectChanges();
    dsl = fixture.debugElement.query(By.css('.stream-dsl')).nativeElement;
    expect(dsl.textContent).toContain('foo | bar');
    expect(component.getState()).toBe('unexpandable');
  });

  it('should expand/collapse', async (done) => {
    component.dsl = 'file --foo=bar | log';
    fixture.detectChanges();
    let dsl = fixture.debugElement.query(By.css('.stream-dsl')).nativeElement;
    expect(dsl.textContent).toContain('file | log');
    expect(component.getState()).toBe('collapsed');
    component.expand();
    await fixture.whenStable();
    fixture.detectChanges();
    dsl = fixture.debugElement.query(By.css('.stream-dsl')).nativeElement;
    expect(dsl.textContent).toContain('file --foo=bar | log');
    expect(component.getState()).toBe('expanded');
    component.collapse();
    fixture.detectChanges();
    dsl = fixture.debugElement.query(By.css('.stream-dsl')).nativeElement;
    expect(dsl.textContent).toContain('file | log');
    expect(component.getState()).toBe('collapsed');
    done();
  });


});
