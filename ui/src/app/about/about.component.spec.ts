import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BusyModule} from 'tixif-ngx-busy';
import { AboutComponent } from './about.component';
import {ToastyService} from 'ng2-toasty';
import {MockToastyService} from '../tests/mocks/toasty';
import {MockActivatedRoute} from '../tests/mocks/activated-route';
import {ActivatedRoute} from '@angular/router';
import {MockAboutService} from '../tests/mocks/about';
import {AboutService} from './about.service';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  const toastyService = new MockToastyService();
  let activeRoute: MockActivatedRoute;
  const aboutService = new MockAboutService();


  beforeEach( async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      imports: [
        BusyModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations:   [ AboutComponent ],
      providers: [
        { provide: AboutService, useValue: aboutService },
        { provide: ToastyService, useValue: toastyService },
        { provide: ActivatedRoute, useValue: activeRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
  });

  it('About displays base server and link information.', () => {
    aboutService.isAboutInfoAvailable = true;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    let des: DebugElement[] = fixture.debugElement.queryAll(By.css('table[id=dataFlowVersionTable] td'));
    expect(des.length).toBe(4);
    expect(des[0].nativeElement.textContent).toContain('Name');
    expect(des[1].nativeElement.textContent).toContain('FOO');
    expect(des[2].nativeElement.textContent).toContain('Version');
    expect(des[3].nativeElement.textContent).toContain('BAR');

    des = fixture.debugElement.queryAll(By.css('table[id=dataFlowVersionLinksTable] td'));
    expect(des.length).toBe(12);
    expect(des[0].nativeElement.textContent).toContain('Project Page');
    expect(des[1].nativeElement.textContent).toContain('http://cloud.spring.io/spring-cloud-dataflow/');
    expect(des[2].nativeElement.textContent).toContain('Sources');
    expect(des[3].nativeElement.textContent).toContain('https://github.com/spring-cloud/spring-cloud-dataflow');
    expect(des[4].nativeElement.textContent).toContain('Documentation');
    expect(des[5].nativeElement.textContent).toContain('http://docs.spring.io/spring-cloud-dataflow/docs/BOO/reference/htmlsingle/');
    expect(des[6].nativeElement.textContent).toContain('API Docs');
    expect(des[7].nativeElement.textContent).toContain('http://docs.spring.io/spring-cloud-dataflow/docs/BOO/api/');
    expect(des[8].nativeElement.textContent).toContain('Support Forum');
    expect(des[9].nativeElement.textContent).toContain('http://stackoverflow.com/questions/tagged/spring-cloud-dataflow');
    expect(des[10].nativeElement.textContent).toContain('Issue Tracker');
    expect(des[11].nativeElement.textContent).toContain('https://github.com/spring-cloud/spring-cloud-dataflow/issues');
  });

  it('Should display headers only on no server available.', () => {
    aboutService.isAboutInfoAvailable = false;
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css('h1'));
    let el = de.nativeElement;
    expect(el.textContent).toContain('About');

    de = fixture.debugElement.query(By.css('h2[id=serverWarningError]'));
    el = de.nativeElement;
    expect(el.textContent).toContain('Obtaining about info from server.');
  });

  it('Should navigate to the details page.', () => {
    aboutService.isAboutInfoAvailable = true;
    fixture.detectChanges();
    const de: DebugElement = fixture.debugElement.query(By.css('button[type=button]'));
    const el: HTMLElement = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');
    fixture.detectChanges();
    el.click();

    expect(navigate).toHaveBeenCalledWith(['about/details']);
  });
});
