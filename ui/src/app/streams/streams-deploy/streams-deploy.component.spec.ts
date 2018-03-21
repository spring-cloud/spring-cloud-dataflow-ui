import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgBusyModule} from 'ng-busy';
import {ToastyService} from 'ng2-toasty';
import {MockToastyService} from '../../tests/mocks/toasty';
import {MockStreamsService} from '../../tests/mocks/streams';
import {StreamsService} from '../streams.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StreamsDeployComponent} from './streams-deploy.component';
import {DeploymentPropertiesComponent} from '../streams/deployment-properties/deployment-properties.component';
import {BsModalRef, ModalModule} from 'ngx-bootstrap';
import {By} from '@angular/platform-browser';
import {StreamDefinition} from '../model/stream-definition';
import {MocksSharedAboutService} from '../../tests/mocks/shared-about';
import {SharedAboutService} from '../../shared/services/shared-about.service';
import {KeyValuePipe} from '../../shared/pipes/key-value-filter.pipe';
import {BusyService} from '../../shared/services/busy.service';
import {MockAuthService} from '../../tests/mocks/auth';
import {AuthService} from '../../auth/auth.service';
import {TruncatePipe} from '../../shared/pipes/truncate.pipe';
import {StreamDslComponent} from '../../shared/components/dsl/dsl.component';

/**
 * Test {@link StreamsDeployComponent}.
 *
 * @author Vitrac Damien
 */
describe('StreamsDeployComponent', () => {
  let component: StreamsDeployComponent;
  let fixture: ComponentFixture<StreamsDeployComponent>;

  const toastyService = new MockToastyService();
  const streamsService = new MockStreamsService();
  const sharedAboutService = new MocksSharedAboutService();
  const bsModalRef = new BsModalRef();
  const authService = new MockAuthService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StreamsDeployComponent,
        DeploymentPropertiesComponent,
        KeyValuePipe,
        StreamDslComponent,
        TruncatePipe
      ],
      imports: [
        NgBusyModule,
        FormsModule,
        ModalModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        {provide: AuthService, useValue: authService},
        {provide: StreamsService, useValue: streamsService},
        {provide: BsModalRef, useValue: bsModalRef},
        {provide: BusyService, useValue: new BusyService()},
        {provide: SharedAboutService, useValue: sharedAboutService},
        {provide: ToastyService, useValue: toastyService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsDeployComponent);
    component = fixture.componentInstance;
    toastyService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the stream definitions', () => {
    component.open({
      streamDefinitions: [
        new StreamDefinition('foo', 'foo', 'foo'),
        new StreamDefinition('bar', 'bar', 'bar'),
      ]
    });
    fixture.detectChanges();
    const elModal: HTMLElement = fixture.debugElement.query(By.css('#table-stream')).nativeElement;
    expect(elModal.textContent).toContain('foo');
    expect(elModal.textContent).toContain('bar');
    expect(elModal.textContent).toContain('Edit deployment properties');
  });

  it('should display the parameter form when you click Edit deployment parameters', () => {
    component.open({
      streamDefinitions: [
        new StreamDefinition('foo', 'foo', 'foo'),
      ]
    });
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.query(By.css('#table-stream .btn')).nativeElement;
    el.click();
    fixture.detectChanges();
    const panelStream = fixture.debugElement.query(By.css('#panel-streams'));
    const panelParameters = fixture.debugElement.query(By.css('#panel-parameters')).nativeElement;
    expect(panelStream == null).toBeTruthy();
    expect(panelParameters == null).not.toBeTruthy();
  });

  it('Should call the right Stream Service method when the multi deploy modal is validated', () => {
    component.open({
      streamDefinitions: [
        new StreamDefinition('foo', 'foo', 'foo'),
        new StreamDefinition('bar', 'bar', 'bar'),
      ]
    });
    fixture.detectChanges();
    const bt: HTMLElement = fixture.debugElement.queryAll(By.css('.modal-footer .btn'))[1].nativeElement;
    const deployMultipleStreamDefinitions = spyOn(streamsService, 'deployMultipleStreamDefinitions');
    bt.click();
    fixture.detectChanges();
    expect(deployMultipleStreamDefinitions).toHaveBeenCalled();
  });

  it('Should call the close action (header close)', () => {
    component.open({
      streamDefinitions: [
        new StreamDefinition('foo', 'foo', 'foo'),
        new StreamDefinition('bar', 'bar', 'bar'),
      ]
    });
    fixture.detectChanges();
    const spy = spyOn(bsModalRef, 'hide');
    const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-header .close')).nativeElement;
    bt.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('Should call the close action (footer close)', () => {
    component.open({
      streamDefinitions: [
        new StreamDefinition('foo', 'foo', 'foo'),
        new StreamDefinition('bar', 'bar', 'bar'),
      ]
    });
    fixture.detectChanges();
    const spy = spyOn(bsModalRef, 'hide');
    const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-footer .btn-default')).nativeElement;
    bt.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

});
