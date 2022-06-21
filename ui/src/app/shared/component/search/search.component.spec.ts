import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SecurityServiceMock} from '../../../tests/api/security.service.mock';
import {AboutServiceMock} from '../../../tests/api/about.service.mock';
import {NotificationServiceMock} from '../../../tests/service/notification.service.mock';
import {StreamServiceMock} from '../../../tests/api/stream.service.mock';
import {GrafanaServiceMock} from '../../../tests/service/grafana.service.mock';
import {GroupServiceMock} from '../../../tests/service/group.service.mock';
import {SearchComponent} from './search.component';
import {TaskServiceMock} from '../../../tests/api/task.service.mock';
import {AppServiceMock} from '../../../tests/api/app.service.mock';
import {of, throwError} from 'rxjs';
import {TaskPage} from '../../model/task.model';
import {StreamPage} from '../../model/stream.model';
import {AppPage} from '../../model/app.model';
import {By} from '@angular/platform-browser';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../../assets/i18n/en.json';

describe('shared/component/search/search.component.ts', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        TranslateTestingModule.withTranslations('en', TRANSLATIONS),
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        NotificationServiceMock.provider,
        StreamServiceMock.provider,
        TaskServiceMock.provider,
        AppServiceMock.provider,
        GrafanaServiceMock.provider,
        GroupServiceMock.provider
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should run a complete search', async done => {
    const spy1 = spyOn(TaskServiceMock.mock, 'getTasks').and.callFake(() => of(new TaskPage()));
    const spy2 = spyOn(StreamServiceMock.mock, 'getStreams').and.callFake(() => of(new StreamPage()));
    const spy3 = spyOn(AppServiceMock.mock, 'getApps').and.callFake(() => of(new AppPage()));
    const spy4 = spyOn(AboutServiceMock.mock, 'isFeatureEnabled').and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
    component.search.setValue('foo');
    setTimeout(() => {
      fixture.detectChanges();
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy3).toHaveBeenCalledTimes(1);
      expect(spy4).toHaveBeenCalledTimes(2);
      expect(component.isNoResult()).toBeTruthy();
      done();
    }, 320);
  });

  it('should run a search without streams', async done => {
    const spy1 = spyOn(TaskServiceMock.mock, 'getTasks').and.callFake(() => of(new TaskPage()));
    const spy2 = spyOn(StreamServiceMock.mock, 'getStreams');
    const spy3 = spyOn(AppServiceMock.mock, 'getApps').and.callFake(() => of(new AppPage()));
    const spy4 = spyOn(AboutServiceMock.mock, 'isFeatureEnabled').and.callFake(feature =>
      Promise.resolve(feature !== 'streams')
    );

    fixture.detectChanges();
    component.search.setValue('foo');
    setTimeout(() => {
      fixture.detectChanges();
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).not.toHaveBeenCalled();
      expect(spy3).toHaveBeenCalledTimes(1);
      expect(spy4).toHaveBeenCalledTimes(2);
      expect(component.isNoResult()).toBeTruthy();
      done();
    }, 320);
  });

  it('should run a search without tasks', async done => {
    const spy1 = spyOn(TaskServiceMock.mock, 'getTasks');
    const spy2 = spyOn(StreamServiceMock.mock, 'getStreams').and.callFake(() => of(new StreamPage()));
    const spy3 = spyOn(AppServiceMock.mock, 'getApps').and.callFake(() => of(new AppPage()));
    const spy4 = spyOn(AboutServiceMock.mock, 'isFeatureEnabled').and.callFake(feature =>
      Promise.resolve(feature !== 'tasks')
    );

    fixture.detectChanges();
    component.search.setValue('foo');
    setTimeout(() => {
      fixture.detectChanges();
      expect(spy1).not.toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy3).toHaveBeenCalledTimes(1);
      expect(spy4).toHaveBeenCalledTimes(2);
      expect(component.isNoResult()).toBeTruthy();
      done();
    }, 320);
  });

  it('should display an error (stream)', async done => {
    spyOn(StreamServiceMock.mock, 'getStreams').and.callFake(() => throwError('error'));
    fixture.detectChanges();
    component.search.setValue('foo');
    setTimeout(() => {
      fixture.detectChanges();
      expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
      expect(NotificationServiceMock.mock.errorNotification[0].message).toContain('error');
      done();
    }, 320);
  });

  it('should display an error (task)', async done => {
    spyOn(TaskServiceMock.mock, 'getTasks').and.callFake(() => throwError('error'));
    fixture.detectChanges();
    component.search.setValue('foo');
    setTimeout(() => {
      fixture.detectChanges();
      expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
      expect(NotificationServiceMock.mock.errorNotification[0].message).toContain('error');
      done();
    }, 320);
  });

  it('should display an error (app)', async done => {
    spyOn(AppServiceMock.mock, 'getApps').and.callFake(() => throwError('error'));
    fixture.detectChanges();
    component.search.setValue('foo');
    setTimeout(() => {
      fixture.detectChanges();
      expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
      expect(NotificationServiceMock.mock.errorNotification[0].message).toContain('error');
      done();
    }, 320);
  });

  it('should clear the search', async done => {
    fixture.detectChanges();
    component.search.setValue('foo');
    setTimeout(() => {
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.debugElement.query(By.css('.btn-clear')).nativeElement;
      button.click();
      fixture.detectChanges();
      expect(component.searching.apps).toBeFalsy();
      expect(component.searching.streams).toBeFalsy();
      expect(component.searching.tasks).toBeFalsy();
      expect(component.results.apps).toBeNull();
      expect(component.results.tasks).toBeNull();
      expect(component.results.streams).toBeNull();
      expect(component.search.value).toBe('');
      done();
    }, 320);
  });

  it('should remove the search on blur', async done => {
    fixture.detectChanges();
    component.search.setValue('foo');
    setTimeout(() => {
      fixture.detectChanges();
      component.onInputBlur();
      setTimeout(() => {
        fixture.detectChanges();
        expect(component.searching.apps).toBeFalsy();
        expect(component.searching.streams).toBeFalsy();
        expect(component.searching.tasks).toBeFalsy();
        expect(component.results.apps).toBeNull();
        expect(component.results.tasks).toBeNull();
        expect(component.results.streams).toBeNull();
        expect(component.search.value).toBe('');
        done();
      }, 220);
    }, 320);
  });

  describe('should use key shortcut', () => {
    beforeEach(async done => {
      fixture.detectChanges();
      component.search.setValue('foo');
      component.inputQuickSearch.nativeElement.focus();
      setTimeout(() => {
        fixture.detectChanges();
        done();
      }, 320);
    });

    // it('Escape', async done => {
    //   const event = new KeyboardEvent('keyDown', { keyCode: 27 });
    //   component.onKeyDown(event);
    //   fixture.detectChanges();
    //   setTimeout(() => {
    //     fixture.detectChanges();
    //     expect(component.searching.apps).toBeFalsy();
    //     expect(component.searching.streams).toBeFalsy();
    //     expect(component.searching.tasks).toBeFalsy();
    //     expect(component.results.apps).toBeNull();
    //     expect(component.results.tasks).toBeNull();
    //     expect(component.results.streams).toBeNull();
    //     expect(component.search.value).toBe('');
    //     done();
    //   }, 220);
    // });

    // it('Down/Up/Enter', async done => {
    //   const navigate = spyOn((<any>component).router, 'navigateByUrl');
    //   component.onKeyDown(new KeyboardEvent('keyDown', { keyCode: 40 }));
    //   component.onKeyDown(new KeyboardEvent('keyDown', { keyCode: 38 }));
    //   component.onKeyDown(new KeyboardEvent('keyDown', { keyCode: 39 }));
    //   component.onKeyDown(new KeyboardEvent('keyDown', { keyCode: 37 }));
    //   component.onKeyDown(new KeyboardEvent('keyDown', { keyCode: 13 }));
    //   fixture.detectChanges();
    //   expect(navigate.calls.mostRecent().args[0].toString()).toBe('/apps/processor/aggregator');
    //   done();
    // });
  });
});
