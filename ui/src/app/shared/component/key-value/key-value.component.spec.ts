import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { KeyValueComponent } from './key-value.component';
import { ClipboardCopyService } from '../../service/clipboard-copy.service';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';

describe('KeyValueComponent', () => {
  let component: KeyValueComponent;
  let fixture: ComponentFixture<KeyValueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        KeyValueComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        NotificationServiceMock.provider,
        ClipboardCopyService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValueComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Valid and invalid state (no custom validation)', () => {

    it('Should be valid', () => {
      component.text = 'foo=bar';
      fixture.detectChanges();
      expect(component.isInvalid).toBeFalsy();

      component.text = 'foo=bar\nfoo1=foo2';
      fixture.detectChanges();
      expect(component.isInvalid).toBeFalsy();

      component.text = '=';
      fixture.detectChanges();
      expect(component.isInvalid).toBeFalsy();

      component.text = '=bar';
      fixture.detectChanges();
      expect(component.isInvalid).toBeFalsy();

      component.text = 'foo=';
      fixture.detectChanges();
      expect(component.isInvalid).toBeFalsy();
    });

    it('Should be invalid', () => {
      component.text = 'foo';
      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(component.isInvalid).toBeTruthy();

      component.text = 'foo=bar\nfoo1';
      fixture.detectChanges();
      expect(component.isInvalid).toBeTruthy();
    });

  });

  describe('Valid and invalid state with custom validation(s) on the key/value', () => {

    beforeEach(() => {
      component.validators.value = [];
      component.validators.key = [];
    });

    it('Validator on the key', () => {
      component.validators.key = [Validators.required];

      component.text = 'foo=bar';
      fixture.detectChanges();
      expect(component.isInvalid).toBeFalsy();

      component.text = 'foo=';
      fixture.detectChanges();
      expect(component.isInvalid).toBeFalsy();

      component.text = '=bar';
      fixture.detectChanges();
      expect(component.isInvalid).toBeTruthy();

      component.text = '=';
      fixture.detectChanges();
      expect(component.isInvalid).toBeTruthy();
    });

    it('Validator on the value', () => {
      component.validators.value = [Validators.required];

      component.text = 'foo=bar';
      fixture.detectChanges();
      expect(component.isInvalid).toBeFalsy();

      component.text = '=bar';
      fixture.detectChanges();
      expect(component.isInvalid).toBeFalsy();

      component.text = 'foo=';
      fixture.detectChanges();
      expect(component.isInvalid).toBeTruthy();

      component.text = '=';
      fixture.detectChanges();
      expect(component.isInvalid).toBeTruthy();
    });

    it('Validator on the key and the value', () => {
      component.validators.key = [Validators.required];
      component.validators.value = [Validators.required];

      component.text = 'foo=bar';
      fixture.detectChanges();
      expect(component.isInvalid).toBeFalsy();

      component.text = '=bar';
      fixture.detectChanges();
      expect(component.isInvalid).toBeTruthy();

      component.text = 'foo=';
      fixture.detectChanges();
      expect(component.isInvalid).toBeTruthy();

      component.text = '=';
      fixture.detectChanges();
      expect(component.isInvalid).toBeTruthy();
    });

  });

  describe('Import a file and copy clipboard', () => {

    it('should import a file', (done) => {
      const event = { target: { files: [new Blob(['a=a'])] } };
      component.fileChange(event);
      setTimeout(() => {
        fixture.detectChanges();
        expect(component.form.get('textarea').value).toContain('a=a');
        done();
      }, 1000);
    });

    it('should copy the content and display a success notification', () => {
      component.form.get('textarea').setValue('foo=bar');
      fixture.detectChanges();
      component.copyClipboard();
      fixture.detectChanges();
      expect(NotificationServiceMock.mock.successNotifications[0].title).toContain('Content copied');
      expect(NotificationServiceMock.mock.successNotifications[0].message).toContain('The content have been copied to your clipboard.');
    });

  });

});
