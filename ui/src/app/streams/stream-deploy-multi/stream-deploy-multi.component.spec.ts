import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BusyModule} from 'tixif-ngx-busy';
import {ToastyService} from 'ng2-toasty';
import {MockToastyService} from '../../tests/mocks/toasty';
import {MockStreamsService} from '../../tests/mocks/streams';
import {StreamsService} from '../streams.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StreamDeployMultiComponent} from './stream-deploy-multi.component';
import {DeploymentPropertiesComponent} from '../stream-definitions/deployment-properties/deployment-properties.component';
import {BsModalRef, ModalModule} from 'ngx-bootstrap';
import {MockBsModalRef} from '../../tests/mocks/modal';
import {By} from '@angular/platform-browser';
import {StreamDefinition} from '../model/stream-definition';
import {MocksSharedAboutService} from '../../tests/mocks/shared-about';
import {SharedAboutService} from '../../shared/services/shared-about.service';

/**
 * Test {@link StreamDeployMultiComponent}.
 *
 * @author Vitrac Damien
 */
describe('StreamDeployMultiComponent', () => {
  let component: StreamDeployMultiComponent;
  let fixture: ComponentFixture<StreamDeployMultiComponent>;

  const toastyService = new MockToastyService();
  const streamsService = new MockStreamsService();
  const sharedAboutService = new MocksSharedAboutService();
  const bsModalRef = new MockBsModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StreamDeployMultiComponent,
        DeploymentPropertiesComponent
      ],
      imports: [
        BusyModule,
        FormsModule,
        ModalModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        {provide: StreamsService, useValue: streamsService},
        {provide: BsModalRef, useValue: bsModalRef},
        {provide: SharedAboutService, useValue: sharedAboutService},
        {provide: ToastyService, useValue: toastyService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamDeployMultiComponent);
    component = fixture.componentInstance;
    toastyService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the stream definitions', () => {
    component.streamDefinitions = [
      new StreamDefinition('foo', 'foo', 'foo'),
      new StreamDefinition('bar', 'bar', 'bar'),
    ];
    fixture.detectChanges();
    const elModal: HTMLElement = fixture.debugElement.query(By.css('#table-stream')).nativeElement;
    expect(elModal.textContent).toContain('foo');
    expect(elModal.textContent).toContain('bar');
    expect(elModal.textContent).toContain('Edit deployment parameters');
  });

  it('should display the parameter form when you click Edit deployment parameters', () => {
    component.streamDefinitions = [
      new StreamDefinition('foo', 'foo', 'foo')
    ];
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
    component.streamDefinitions = [
      new StreamDefinition('foo', 'foo', 'foo'),
      new StreamDefinition('bar', 'bar', 'bar'),
    ];
    fixture.detectChanges();
    const bt: HTMLElement = fixture.debugElement.queryAll(By.css('.modal-footer .btn'))[1].nativeElement;
    const deployMultipleStreamDefinitions = spyOn(streamsService, 'deployMultipleStreamDefinitions');
    bt.click();
    fixture.detectChanges();
    expect(deployMultipleStreamDefinitions).toHaveBeenCalled();
  });

  it('Should call the close action (header close)', () => {
    fixture.detectChanges();
    const spy = spyOn(bsModalRef, 'hide');
    const bt: HTMLElement = fixture.debugElement.query(By.css('#panel-streams .modal-header .close')).nativeElement;
    bt.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('Should call the close action (footer close)', () => {
    fixture.detectChanges();
    const spy = spyOn(bsModalRef, 'hide');
    const bt: HTMLElement = fixture.debugElement.query(By.css('#panel-streams .modal-footer .btn-default')).nativeElement;
    bt.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

});
