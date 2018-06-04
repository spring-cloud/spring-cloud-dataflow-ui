import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgBusyModule} from 'ng-busy';
import { AboutComponent } from './about.component';
import {MockNotificationService} from '../../tests/mocks/notification';
import {MockActivatedRoute} from '../../tests/mocks/activated-route';
import {ActivatedRoute} from '@angular/router';
import {MockAboutService} from '../../tests/mocks/about';
import {AboutService} from '../about.service';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import { NotificationService } from '../../shared/services/notification.service';
import { AboutDetailsComponent } from '../components/about-more/about-details.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { MapValuesPipe } from '../../shared/pipes/map-values-pipe.pipe';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  const notificationService = new MockNotificationService();
  let activeRoute: MockActivatedRoute;
  const aboutService = new MockAboutService();


  beforeEach( async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      imports: [
        NgBusyModule,
        RouterTestingModule.withRoutes([]),
        ClipboardModule
      ],
      declarations:   [
        AboutComponent,
        AboutDetailsComponent,
        LoaderComponent,
        MapValuesPipe
      ],
      providers: [
        { provide: AboutService, useValue: aboutService },
        { provide: NotificationService, useValue: notificationService },
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
    let des: DebugElement[] = fixture.debugElement.queryAll(By.css('#properties .line'));
    expect(des.length).toBe(2);
    expect(des[0].nativeElement.textContent).toContain('Name');
    expect(des[0].nativeElement.textContent).toContain('FOO');
    expect(des[1].nativeElement.textContent).toContain('Version');
    expect(des[1].nativeElement.textContent).toContain('BAR');

    des = fixture.debugElement.queryAll(By.css('#dataFlowVersionLinksTable li'));
    expect(des.length).toBe(6);
    expect(des[0].nativeElement.textContent).toContain('Project Page');
    expect(des[0].nativeElement.textContent).toContain('http://cloud.spring.io/spring-cloud-dataflow/');
    expect(des[1].nativeElement.textContent).toContain('Sources');
    expect(des[1].nativeElement.textContent).toContain('https://github.com/spring-cloud/spring-cloud-dataflow');
    expect(des[2].nativeElement.textContent).toContain('Documentation');
    expect(des[2].nativeElement.textContent).toContain('http://docs.spring.io/spring-cloud-dataflow/docs/BOO/reference/htmlsingle/');
    expect(des[3].nativeElement.textContent).toContain('API Docs');
    expect(des[3].nativeElement.textContent).toContain('http://docs.spring.io/spring-cloud-dataflow/docs/BOO/api/');
    expect(des[4].nativeElement.textContent).toContain('Support Forum');
    expect(des[4].nativeElement.textContent).toContain('http://stackoverflow.com/questions/tagged/spring-cloud-dataflow');
    expect(des[5].nativeElement.textContent).toContain('Issue Tracker');
    expect(des[5].nativeElement.textContent).toContain('https://github.com/spring-cloud/spring-cloud-dataflow/issues');
  });

  /*
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
  */

  /*
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
  */

});
