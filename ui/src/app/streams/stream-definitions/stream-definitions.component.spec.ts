import {async, ComponentFixture, TestBed, tick} from '@angular/core/testing';
import {BusyModule} from 'tixif-ngx-busy';
import {NgxPaginationModule} from 'ngx-pagination';
import {ToastyService} from 'ng2-toasty';
import {ModalModule, PopoverModule} from 'ngx-bootstrap';
import {MockToastyService} from '../../tests/mocks/toasty';
import {KeyValuePipe} from '../../shared/pipes/key-value-filter.pipe';
import {MockStreamsService} from '../../tests/mocks/streams';
import {STREAM_DEFINITIONS} from '../../tests/mocks/mock-data';
import {StreamDefinitionsComponent} from './stream-definitions.component';
import {StreamsService} from '../streams.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {MockActivatedRoute} from '../../tests/mocks/activated-route';
import {ActivatedRoute} from '@angular/router';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {StreamDefinition} from '../model/stream-definition';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { MockAuthService } from '../../tests/mocks/auth';
import { AuthService } from '../../auth/auth.service';
import { GraphViewComponent } from '../../shared/flo/graph-view/graph-view.component';
import { FloModule } from 'spring-flo';
import { StreamGraphDefinitionComponent } from '../stream-graph-definition/stream-graph-definition.component';
import {TriStateButtonComponent} from '../../shared/components/tri-state-button.component';
import {TriStateCheckboxComponent} from '../../shared/components/tri-state-checkbox.component';
import {DeploymentPropertiesComponent} from './deployment-properties/deployment-properties.component';

/**
 * Test {@link StreamDefinitionsComponent}.
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
describe('StreamDefinitionsComponent', () => {
  let component: StreamDefinitionsComponent;
  let fixture: ComponentFixture<StreamDefinitionsComponent>;
  const toastyService = new MockToastyService();

  const streamsService = new MockStreamsService();
  const authService = new MockAuthService();
  let activeRoute: MockActivatedRoute;

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        KeyValuePipe,
        RolesDirective,
        GraphViewComponent,
        StreamGraphDefinitionComponent,
        StreamDefinitionsComponent,
        TriStateButtonComponent,
        TriStateCheckboxComponent,
        DeploymentPropertiesComponent
      ],
      imports: [
        BusyModule,
        NgxPaginationModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        FormsModule,
        FloModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: StreamsService, useValue: streamsService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: ToastyService, useValue: toastyService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamDefinitionsComponent);
    component = fixture.componentInstance;
    toastyService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate stream definitions', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    fixture.detectChanges();
    const des: DebugElement[] = fixture.debugElement.queryAll(By.css('table[id=streamDefinitionsTable] tr:first-child td'));
    expect(des.length).toBe(6);
    expect(des[2].nativeElement.textContent).toContain('foo2');
    expect(des[3].nativeElement.textContent).toContain('time |log');
    expect(des[4].nativeElement.textContent).toContain('undeployed');
  });

  it('Should navigate to the details page.', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    fixture.detectChanges();
    const de: DebugElement = fixture.debugElement.query(By.css('button[title=Details]'));
    const el: HTMLElement = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');
    el.click();

    expect(navigate).toHaveBeenCalledWith(['streams/definitions/foo2']);
  });

  it('Should navigate to the deployment page.', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    fixture.detectChanges();
    const de: DebugElement = fixture.debugElement.query(By.css('button[title=Deploy]'));
    const el: HTMLElement = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');
    el.click();

    expect(navigate).toHaveBeenCalledWith(['streams/definitions/foo2/deploy']);
  });

  it('Should navigate to the destroy popup.', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    fixture.detectChanges();
    const de: DebugElement = fixture.debugElement.query(By.css('button[title=Destroy]'));
    const el: HTMLElement = de.nativeElement;
    const showModal = spyOn(component, 'showChildModal');
    el.click();

    expect(showModal).toHaveBeenCalled();
  });

  it('Should show stream definition undeployed toasty message.', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].status = 'deployed';
    fixture.detectChanges();
    const de: DebugElement = fixture.debugElement.query(By.css('button[title=Undeploy]'));
    const el: HTMLElement = de.nativeElement;
    el.click();
    expect(toastyService.testSuccess).toContain('Successfully undeployed stream definition "foo2"');
  });

  it('Should expand and collapse items on page', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    fixture.detectChanges();
    let de: DebugElement = fixture.debugElement.query(By.css('button[id=expandAll]'));
    let el: HTMLElement = de.nativeElement;

    expect(streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].isExpanded).toBe(undefined);
    el.click();
    expect(streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].isExpanded).toBe(true);

    de = fixture.debugElement.query(By.css('button[id=collapseAll]'));
    el = de.nativeElement;

    el.click();
    expect(streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].isExpanded).toBe(false);
  });

  it('Should give successful toasty message after retrieving another page', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    fixture.detectChanges();
    component.getPage(2);
    expect(toastyService.testSuccess).toContain('Stream definitions loaded.');
  });

  it('Should give successful toasty message after destroying stream definition.', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    fixture.detectChanges();
    const streamDefinition = new StreamDefinition('foo2', 'time |log', 'undeployed');
    component.proceed(streamDefinition);
    expect(toastyService.testSuccess).toContain('Successfully destroyed stream definition "foo2"');
  });

  it('Should display the multi deploy modal for each selected stream definitions', (done) => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].status = 'undeployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].isSelected = true;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].status = 'deployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].isSelected = true;
    fixture.detectChanges();
    const elModal: HTMLElement = fixture.debugElement.query(By.css('div[id=deployMultipleStreamDefinitionsModal]')).nativeElement;
    const de: DebugElement[] = fixture.debugElement.queryAll(By.css('.col-actions .btn'));
    const el: HTMLElement = de[0].nativeElement;
    el.click();
    fixture.detectChanges();
    setTimeout(() => {
      expect(elModal.className).toContain('in');
      expect(elModal.textContent).toContain('foo2');
      expect(elModal.textContent).toContain('Add deployment properties');
      expect(elModal.textContent).not.toContain('foo3');
      done();
    }, 1000);
  });

  it('Should call the right Stream Service method when the multi deploy modal is validated', (done) => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].status = 'undeployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].isSelected = true;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].status = 'deployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].isSelected = true;
    fixture.detectChanges();
    const de: DebugElement[] = fixture.debugElement.queryAll(By.css('.col-actions .btn'));
    const el: HTMLElement = de[0].nativeElement;
    const bt: HTMLElement = fixture.debugElement.queryAll(
      By.css('div[id=deployMultipleStreamDefinitionsModal] .modal-footer .btn'))[1].nativeElement;
    const deployMultipleStreamDefinitions = spyOn(streamsService, 'deployMultipleStreamDefinitions');
    el.click();
    fixture.detectChanges();
    setTimeout(() => {
      bt.click();
      fixture.detectChanges();
      expect(deployMultipleStreamDefinitions).toHaveBeenCalled();
      done();
    }, 1000);
  });

  it('Should not display the multi deploy modal if no stream definition is selected ', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].status = 'deployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].isSelected = true;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].status = 'deployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].isSelected = true;
    fixture.detectChanges();
    const de: DebugElement[] = fixture.debugElement.queryAll(By.css('.col-actions .btn'));
    const el: HTMLElement = de[0].nativeElement;
    el.click();
    fixture.detectChanges();
    const show = spyOn(component.deployMultipleStreamDefinitionsModal, 'show');
    expect(show).not.toHaveBeenCalled();
  });

  it('Should display the multi undeploy modal when the stream definitions are selected', (done) => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].status = 'undeployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].isSelected = true;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].status = 'deployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].isSelected = true;
    fixture.detectChanges();
    const elModal: HTMLElement = fixture.debugElement.query(By.css('div[id=undeployMultipleStreamDefinitionsModal]')).nativeElement;
    const de: DebugElement[] = fixture.debugElement.queryAll(By.css('.col-actions .btn'));
    const el: HTMLElement = de[1].nativeElement;
    el.click();
    fixture.detectChanges();
    setTimeout(() => {
      expect(elModal.className).toContain('in');
      expect(elModal.textContent).not.toContain('foo2');
      expect(elModal.textContent).toContain('foo3');
      done();
    }, 1000);
  });

  it('Should call the right Stream Service method when the multi undeploy is validated', (done) => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].status = 'undeployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].isSelected = true;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].status = 'deployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].isSelected = true;
    fixture.detectChanges();
    const de: DebugElement[] = fixture.debugElement.queryAll(By.css('.col-actions .btn'));
    const el: HTMLElement = de[1].nativeElement;
    const bt: HTMLElement = fixture.debugElement.queryAll(
      By.css('div[id=undeployMultipleStreamDefinitionsModal] .modal-footer .btn'))[1].nativeElement;
    const undeployMultipleStreamDefinitions = spyOn(streamsService, 'undeployMultipleStreamDefinitions');
    el.click();
    fixture.detectChanges();
    setTimeout(() => {
      bt.click();
      fixture.detectChanges();
      expect(undeployMultipleStreamDefinitions).toHaveBeenCalled();
      done();
    }, 1000);
  });

  it('Should not display the multi undeploy modal if no stream definition is selected', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].status = 'undeployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].isSelected = true;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].status = 'undeployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].isSelected = true;
    fixture.detectChanges();
    const de: DebugElement[] = fixture.debugElement.queryAll(By.css('.col-actions .btn'));
    const el: HTMLElement = de[1].nativeElement;
    el.click();
    fixture.detectChanges();
    const show = spyOn(component.undeployMultipleStreamDefinitionsModal, 'show');
    expect(show).not.toHaveBeenCalled();
  });

  it('Should display the multi destroy modal when the stream definitions are selected', (done) => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].isSelected = true;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].isSelected = true;
    fixture.detectChanges();
    const elModal: HTMLElement = fixture.debugElement.query(By.css('div[id=destroyMultipleStreamDefinitionsModal]')).nativeElement;
    const de: DebugElement[] = fixture.debugElement.queryAll(By.css('.col-actions .btn'));
    const el: HTMLElement = de[2].nativeElement;
    el.click();
    fixture.detectChanges();
    setTimeout(() => {
      expect(elModal.className).toContain('in');
      expect(elModal.textContent).toContain('foo2');
      expect(elModal.textContent).toContain('foo3');
      done();
    }, 1000);
  });

  it('Should call the right Stream Service method when the multi destroy is validated', (done) => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].status = 'undeployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].isSelected = true;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].status = 'deployed';
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].isSelected = true;
    fixture.detectChanges();
    const de: DebugElement[] = fixture.debugElement.queryAll(By.css('.col-actions .btn'));
    const el: HTMLElement = de[2].nativeElement;
    const bt: HTMLElement = fixture.debugElement.queryAll(
      By.css('div[id=destroyMultipleStreamDefinitionsModal] .modal-footer .btn'))[1].nativeElement;
    const destroyMultipleStreamDefinitions = spyOn(streamsService, 'destroyMultipleStreamDefinitions');
    el.click();
    fixture.detectChanges();
    setTimeout(() => {
      bt.click();
      fixture.detectChanges();
      expect(destroyMultipleStreamDefinitions).toHaveBeenCalled();
      done();
    }, 1000);
  });

  it('Should not display any multi modal when no stream definition is selected', () => {
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[0].isSelected = false;
    streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].isSelected = false;
    fixture.detectChanges();
    const de: DebugElement[] = fixture.debugElement.queryAll(By.css('.col-actions .btn'));
    de[0].nativeElement.click();
    de[1].nativeElement.click();
    de[2].nativeElement.click();
    fixture.detectChanges();

    const show = spyOn(component.destroyMultipleStreamDefinitionsModal, 'show');
    const show1 = spyOn(component.deployMultipleStreamDefinitionsModal, 'show');
    const show2 = spyOn(component.undeployMultipleStreamDefinitionsModal, 'show');
    expect(show).not.toHaveBeenCalled();
    expect(show1).not.toHaveBeenCalled();
    expect(show2).not.toHaveBeenCalled();
  });

});
