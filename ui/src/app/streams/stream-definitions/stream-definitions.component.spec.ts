import {async, ComponentFixture, TestBed} from '@angular/core/testing';
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

/**
 * Test {@link StreamDefinitionsComponent}.
 *
 * @author Glenn Renfro
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
        StreamDefinitionsComponent,
      ],
      imports: [
        BusyModule,
        NgxPaginationModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        FormsModule,
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
    const des: DebugElement[] = fixture.debugElement.queryAll(By.css('table[id=streamDefinitionsTable] td'));
    expect(des.length).toBe(5);
    expect(des[1].nativeElement.textContent).toContain('foo2');
    expect(des[2].nativeElement.textContent).toContain('time |log');
    expect(des[3].nativeElement.textContent).toContain('undeployed');
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

});
