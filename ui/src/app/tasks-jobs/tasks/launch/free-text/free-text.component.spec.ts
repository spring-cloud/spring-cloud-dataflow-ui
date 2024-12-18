import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FreeTextComponent} from './free-text.component';
import {RoleDirective} from '../../../../security/directive/role.directive';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../../../assets/i18n/en.json';

describe('tasks-jobs/tasks/launch/free-text/free-text.component.ts', () => {
  let component: FreeTextComponent;
  let fixture: ComponentFixture<FreeTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FreeTextComponent, RoleDirective],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        TranslateTestingModule.withTranslations('en', TRANSLATIONS),
        BrowserAnimationsModule
      ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTextComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    component.properties = ['foo=bar'];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load a properties file', done => {
    fixture.detectChanges();
    const file = new File(['a=a'], 'filename');
    const fileList: FileList = {
      length: 1,
      item: () => null,
      0: file
    };
    const event = {target: {files: fileList}} as any;
    component.propertiesFileChange(event);
    setTimeout(() => {
      fixture.detectChanges();
      expect(component.formGroup.get('pinput').value).toContain('a=a');
      done();
    }, 500);
  });

  it('should load a arguments file', done => {
    fixture.detectChanges();
    const file = new File(['a=a'], 'filename');
    const fileList: FileList = {
      length: 1,
      item: () => null,
      0: file
    };
    const event = {target: {files: fileList}} as any;
    component.argumentsFileChange(event);
    setTimeout(() => {
      fixture.detectChanges();
      expect(component.formGroup.get('ainput').value).toContain('a=a');
      done();
    }, 500);
  });

  it('should parse arguments correctly', () => {
    const args = ['app.t1.0=--arg', 'app.t2.0=--arg'].join('\n');
    fixture.detectChanges();
    component.formGroup.get('ainput').setValue(args);
    expect(component['getCleanArguments']()).toEqual(jasmine.arrayContaining(['app.t1.0=--arg', 'app.t2.0=--arg']));
  });
});
