import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgBusyModule} from 'ng-busy';
import {ToastyService} from 'ng2-toasty';
import {MockToastyService} from '../../tests/mocks/toasty';
import {MockStreamsService} from '../../tests/mocks/streams';
import {STREAM_DEFINITIONS} from '../../tests/mocks/mock-data';
import {StreamsService} from '../streams.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {MockActivatedRoute} from '../../tests/mocks/activated-route';
import {ActivatedRoute} from '@angular/router';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {StreamDeployComponent} from './stream-deploy.component';
import {MockComponent} from '../../tests/mocks/mock-component';
import {MocksSharedAboutService} from '../../tests/mocks/shared-about';
import {SharedAboutService} from '../../shared/services/shared-about.service';
import { BusyService } from '../../shared/services/busy.service';

/**
 * Test {@link StreamDeployComponent}.
 *
 * @author Glenn Renfro
 */
describe('StreamDeployComponent', () => {
  let component: StreamDeployComponent;
  let fixture: ComponentFixture<StreamDeployComponent>;
  const toastyService = new MockToastyService();
  const streamsService = new MockStreamsService();
  const sharedAboutService = new MocksSharedAboutService();
  let activeRoute: MockActivatedRoute;
  const commonTestParams = { id: '1' };

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamDeployComponent
      ],
      imports: [
        NgBusyModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: 'streams/definitions', component: MockComponent }])
      ],
      providers: [
        {provide: BusyService, useValue: new BusyService()},
        {provide: StreamsService, useValue: streamsService},
        {provide: ActivatedRoute, useValue: activeRoute },
        {provide: SharedAboutService, useValue: sharedAboutService },
        {provide: ToastyService, useValue: toastyService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(StreamDeployComponent);
    component = fixture.componentInstance;
    toastyService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('Should execute deploy for stream', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    fixture.detectChanges();
    const de: DebugElement = fixture.debugElement.query(By.css('button[id=deployBtn]'));
    const el: HTMLElement = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');
    el.click();

    expect(navigate).toHaveBeenCalledWith(['streams/definitions']);
    expect(toastyService.testSuccess).toContain('Successfully deployed stream definition "1"');
  });

  it('Should execute deploy for stream with properties', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    fixture.detectChanges();
    const de: DebugElement = fixture.debugElement.query(By.css('button[id=deployBtn]'));
    const el: HTMLElement = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');
    component.deploymentProperties.setValue('app.bar=foo\napp.aaa=bbb=ccc\napp.ddd=eee');
    el.click();
    expect(component.propertiesAsMap['app.bar']).toBe('foo');
    expect(component.propertiesAsMap['app.aaa']).toBe('bbb=ccc');
    expect(component.propertiesAsMap['app.ddd']).toBe('eee');

    expect(navigate).toHaveBeenCalledWith(['streams/definitions']);
    expect(toastyService.testSuccess).toContain('Successfully deployed stream definition "1"');
  });

  it('Should return back to stream definitions page', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    fixture.detectChanges();
    const de: DebugElement = fixture.debugElement.query(By.css('button[id=backBtn]'));
    const el: HTMLElement = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');
    el.click();

    expect(navigate).toHaveBeenCalledWith(['streams/definitions']);
    expect(toastyService.testSuccess.length).toBe(0);
  });
});
