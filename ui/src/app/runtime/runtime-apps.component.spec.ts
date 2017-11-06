import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BusyModule } from 'angular2-busy';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastyService } from 'ng2-toasty';
import { ModalModule } from 'ngx-bootstrap';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RuntimeAppsComponent } from './runtime-apps.component';
import { MockToastyService } from '../tests/mocks/toasty';
import { KeyValuePipe } from '../shared/pipes/key-value-filter.pipe';
import { MockRuntimeAppsService } from '../tests/mocks/runtime';
import { RuntimeAppsService } from './runtime-apps.service';
import { RUNTIME_APPS } from '../tests/mocks/mock-data';

describe('RuntimeAppsComponent', () => {
  let component: RuntimeAppsComponent;
  let fixture: ComponentFixture<RuntimeAppsComponent>;
  const toastyService = new MockToastyService();
  const runtimeAppsService = new MockRuntimeAppsService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RuntimeAppsComponent,
        KeyValuePipe
      ],
      imports: [
        BusyModule,
        NgxPaginationModule,
        ModalModule.forRoot()
      ],
      providers: [
        { provide: RuntimeAppsService, useValue: runtimeAppsService },
        { provide: ToastyService, useValue: toastyService }
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

  it('should populate runtime apps', () => {
    runtimeAppsService.testRuntimeApps = RUNTIME_APPS;
    fixture.detectChanges();

    const des: DebugElement[] = fixture.debugElement.queryAll(By.css('table td'));
    expect(des.length).toBe(6);
    expect(des[0].nativeElement.textContent).toContain('foostream.log');
    expect(des[1].nativeElement.textContent).toContain('deployed');
    expect(des[2].nativeElement.textContent).toContain('1');
    expect(des[3].nativeElement.textContent).toContain('foostream.time');
    expect(des[4].nativeElement.textContent).toContain('deployed');
    expect(des[5].nativeElement.textContent).toContain('1');
  });

  it('should call open modal', () => {
    runtimeAppsService.testRuntimeApps = RUNTIME_APPS;
    fixture.detectChanges();

    const des: DebugElement[] = fixture.debugElement.queryAll(By.css('table td'));
    const showModal = spyOn(component, 'showChildModal');

    des[0].query(By.css('a')).nativeElement.click();
    expect(showModal).toHaveBeenCalled();
    // looks like this is as far as we can go. content for
    // modal is not populated which might be a limitation of
    // jasmine. should probably test via selenium.
  });
});
