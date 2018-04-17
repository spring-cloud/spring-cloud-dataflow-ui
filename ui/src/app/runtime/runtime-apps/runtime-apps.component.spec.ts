import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgxPaginationModule} from 'ngx-pagination';
import {ToastyService} from 'ng2-toasty';
import {ModalModule, BsModalService} from 'ngx-bootstrap';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {RuntimeAppsComponent} from './runtime-apps.component';
import {MockToastyService} from '../../tests/mocks/toasty';
import {KeyValuePipe} from '../../shared/pipes/key-value-filter.pipe';
import {MockRuntimeAppsService} from '../../tests/mocks/runtime';
import {RuntimeAppsService} from '../runtime-apps.service';
import {RUNTIME_APPS} from '../../tests/mocks/mock-data';
import {RuntimeAppStateComponent} from '../components/runtime-app-state/runtime-app-state.component';
import {RuntimeAppComponent} from '../runtime-app/runtime-app.component';
import {NgBusyModule} from 'ng-busy';
import {MockModalService} from '../../tests/mocks/modal';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

describe('RuntimeAppsComponent', () => {
  let component: RuntimeAppsComponent;
  let fixture: ComponentFixture<RuntimeAppsComponent>;
  const toastyService = new MockToastyService();
  const runtimeAppsService = new MockRuntimeAppsService();
  const modalService = new MockModalService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RuntimeAppsComponent,
        KeyValuePipe,
        RuntimeAppStateComponent,
        LoaderComponent
      ],
      imports: [
        NgBusyModule,
        NgxPaginationModule,
        ModalModule.forRoot()
      ],
      providers: [
        {provide: RuntimeAppsService, useValue: runtimeAppsService},
        {provide: BsModalService, useValue: modalService},
        {provide: ToastyService, useValue: toastyService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuntimeAppsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  describe('1 page', () => {

    beforeEach(() => {
      runtimeAppsService.testRuntimeApps = RUNTIME_APPS;
      fixture.detectChanges();
    });

    it('should populate runtime apps', () => {
      const des: DebugElement[] = fixture.debugElement.queryAll(By.css('#table tr td'));
      expect(des.length).toBe(8);
      expect(des[0].nativeElement.textContent).toContain('foostream.log');
      expect(des[1].nativeElement.textContent).toContain('DEPLOYED');
      expect(des[2].nativeElement.textContent).toContain('1');
      expect(des[4].nativeElement.textContent).toContain('foostream.time');
      expect(des[5].nativeElement.textContent).toContain('DEPLOYING');
      expect(des[6].nativeElement.textContent).toContain('1');
    });

    it('should not display the pagination', () => {
      expect(fixture.debugElement.query(By.css('#pagination'))).toBeNull();
    });

    it('should call open modal', () => {
      const des: DebugElement[] = fixture.debugElement.queryAll(By.css('#table tr td'));
      const spy = spyOn(modalService, 'show');
      des[3].query(By.css('.btn-default')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(RuntimeAppComponent, {class: 'modal-xl'});
    });

    it('should refresh the page', () => {
      const spy = spyOn(component, 'loadRuntimeApps');
      fixture.debugElement.query(By.css('button[name=refresh]')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('2 pages', () => {

    beforeEach(() => {
      runtimeAppsService.testRuntimeApps = {
        _embedded: {
          appStatusResourceList: Array.from({length: 10}).map((a, index) => {
            return {
              deploymentId: `foostream${{index}}.time`,
              state: `deploying`,
              instances: {_embedded: {appInstanceStatusResourceList: []}},
              _links: {self: {href: `http://localhost:9393/runtime/apps/foostream${{index}}.time`}}
            };
          })
        },
        page: {
          totalElements: 14,
          totalPages: 2,
          number: 0,
          size: 10
        }
      };
      fixture.detectChanges();
    });

    it('should refresh the page', () => {
      const spy = spyOn(runtimeAppsService, 'getRuntimeApps');
      fixture.debugElement.query(By.css('button[name=refresh]')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith({ page: 0, size: 10});
    });

    it('should navigation to the page 2', () => {
      const spy = spyOn(runtimeAppsService, 'getRuntimeApps');
      fixture.debugElement.queryAll(By.css('#pagination a'))[0].nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith({ page: 1, size: 10});
    });

  });

  describe('No result', () => {

    beforeEach(() => {
      runtimeAppsService.testRuntimeApps = {
        page: {
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: 10
        }
      };
      fixture.detectChanges();
    });

    it('should display a message', () => {
      expect(fixture.debugElement.query(By.css('#no-result'))).toBeTruthy();
    });

    it('should not display the table and the pagination', () => {
      expect(fixture.debugElement.query(By.css('#pagination'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#table'))).toBeNull();
    });

    it('should refresh the result', () => {
      const spy = spyOn(component, 'loadRuntimeApps');
      fixture.debugElement.query(By.css('button[name=refresh]')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

  });

});
