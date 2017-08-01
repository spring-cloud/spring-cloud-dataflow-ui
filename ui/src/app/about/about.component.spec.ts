import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {BusyModule, BusyConfig, BUSY_CONFIG_DEFAULTS} from 'tixif-ngx-busy';
import {Injectable, ReflectiveInjector} from '@angular/core';
import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions} from '@angular/http';
import {Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import { AboutComponent } from './about.component';
import {AboutService} from './about.service';
import { Observable } from 'rxjs/Observable';

xdescribe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach( async(() => {

    const dataStub = {
      versionInfo: 'abcd'
    };
    const aboutServiceStub = {
      getAboutInfo(): Observable<any> {
        return Observable.of(
          dataStub
        );
      }
    };

    TestBed.configureTestingModule({
      imports: [BusyModule],
      declarations:   [ AboutComponent],
      providers: [
      // { provide: ActivatedRoute, useValue: activatedRoute },
      // { provide: Router,         useClass: RouterStub},
      // HeroDetailService at this level is IRRELEVANT!
        { provide: AboutService, useValue: {} }
      ]
    })

    // Override component's own provider
    .overrideComponent(AboutComponent, {
      set: {
        providers: [
          { provide: AboutService, useValue: aboutServiceStub }
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance; // BannerComponent test instance
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
