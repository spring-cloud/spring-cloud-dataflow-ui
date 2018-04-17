import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastyService } from 'ng2-toasty';
import { BsDropdownModule, BsModalService, ModalModule, PopoverModule } from 'ngx-bootstrap';
import { MockToastyService } from '../../tests/mocks/toasty';
import { KeyValuePipe } from '../../shared/pipes/key-value-filter.pipe';
import { MockStreamsService } from '../../tests/mocks/streams';
import { STREAM_DEFINITIONS } from '../../tests/mocks/mock-data';
import { StreamsComponent } from './streams.component';
import { StreamsService } from '../streams.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StreamDefinition } from '../model/stream-definition';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { MockAuthService } from '../../tests/mocks/auth';
import { AuthService } from '../../auth/auth.service';
import { GraphViewComponent } from '../../shared/flo/graph-view/graph-view.component';
import { FloModule } from 'spring-flo';
import { TriStateButtonComponent } from '../../shared/components/tri-state-button.component';
import { TriStateCheckboxComponent } from '../../shared/components/tri-state-checkbox.component';
import { DeploymentPropertiesComponent } from './deployment-properties/deployment-properties.component';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { DeploymentPropertiesInfoComponent } from './deployment-properties-info/deployment-properties-info.component';
import { StreamsDeployComponent } from '../streams-deploy/streams-deploy.component';
import { StreamStatusComponent } from '../components/stream-status/stream-status.component';
import { SortComponent } from '../../shared/components/sort/sort.component';
import { StreamDslComponent } from '../../shared/components/dsl/dsl.component';
import { StreamsDestroyComponent } from '../streams-destroy/streams-destroy.component';
import { StreamsUndeployComponent } from '../streams-undeploy/streams-undeploy.component';
import { MasterCheckboxComponent } from '../../shared/components/master-checkbox.component';
import { StreamGraphDefinitionComponent } from '../components/stream-graph-definition/stream-graph-definition.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { BusyService } from '../../shared/services/busy.service';
import { MockModalService } from '../../tests/mocks/modal';
import { AppsService } from '../../apps/apps.service';
import { MockAppsService } from '../../tests/mocks/apps';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

/**
 * Test {@link StreamsComponent}.
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
describe('StreamsComponent', () => {
  let component: StreamsComponent;
  let fixture: ComponentFixture<StreamsComponent>;
  const toastyService = new MockToastyService();
  const streamsService = new MockStreamsService();
  const authService = new MockAuthService();
  const modalService = new MockModalService();
  const appsService = new MockAppsService();

  beforeEach(async(() => {
    const aboutService = new MocksSharedAboutService();

    TestBed.configureTestingModule({
      declarations: [
        KeyValuePipe,
        RolesDirective,
        GraphViewComponent,
        StreamsComponent,
        TriStateButtonComponent,
        TriStateCheckboxComponent,
        DeploymentPropertiesComponent,
        DeploymentPropertiesInfoComponent,
        StreamsDeployComponent,
        StreamStatusComponent,
        StreamsUndeployComponent,
        StreamsDestroyComponent,
        SortComponent,
        StreamDslComponent,
        MasterCheckboxComponent,
        StreamGraphDefinitionComponent,
        TruncatePipe,
        LoaderComponent
      ],
      imports: [
        NgxPaginationModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        FormsModule,
        FloModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: SharedAboutService, useValue: aboutService },
        { provide: AppsService, useValue: appsService },
        { provide: AuthService, useValue: authService },
        { provide: BusyService, useValue: new BusyService() },
        { provide: StreamsService, useValue: streamsService },
        { provide: BsModalService, useValue: modalService },
        { provide: ToastyService, useValue: toastyService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsComponent);
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
    expect(des.length).toBe(5);
    expect(des[1].nativeElement.textContent).toContain('foo2');
    expect(des[2].nativeElement.textContent).toContain('time |log');
    expect(des[3].nativeElement.textContent).toContain('UNDEPLOYED');
  });

  it('can show deployment info', () => {
    const stream = new StreamDefinition('test', 'time | log', 'unknown');
    expect(component.canShowDeploymentInfo(stream)).toBeFalsy();

    stream.status = undefined;
    expect(component.canShowDeploymentInfo(stream)).toBeFalsy();

    stream.status = 'undeployed';
    expect(component.canShowDeploymentInfo(stream)).toBeFalsy();

    stream.status = 'deployed';
    expect(component.canShowDeploymentInfo(stream)).toBeTruthy();

    stream.status = 'deploying';
    expect(component.canShowDeploymentInfo(stream)).toBeTruthy();

    stream.status = 'failed';
    expect(component.canShowDeploymentInfo(stream)).toBeTruthy();

    stream.status = 'incomplete';
    expect(component.canShowDeploymentInfo(stream)).toBeTruthy();

    stream.status = 'foo';
    expect(component.canShowDeploymentInfo(stream)).toBeFalsy();
  });

  describe('no stream', () => {

    beforeEach(() => {
      streamsService.streamDefinitions = {
        _embedded: {
          streamDefinitionResourceList: []
        },
        page: {
          size: 20,
          totalElements: 0,
          totalPages: 1
        }
      };
      fixture.detectChanges();
    });

    it('should display a message', () => {
      const message = fixture.debugElement.query(By.css('#empty')).nativeElement;
      fixture.detectChanges();
      expect(message).toBeTruthy();
    });

    it('should not display the search', () => {
      const search = fixture.debugElement.query(By.css('#filters'));
      expect(search).toBeNull();
    });

    it('should not display the table', () => {
      const table = fixture.debugElement.query(By.css('#streamDefinitionsTable'));
      expect(table).toBeNull();
    });

    it('should not display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination'));
      expect(pagination).toBeNull();
    });

  });

  describe('One page', () => {

    beforeEach(() => {
      streamsService.streamDefinitions = STREAM_DEFINITIONS;
      fixture.detectChanges();
    });

    it('should display the search', () => {
      const search = fixture.debugElement.query(By.css('#filters')).nativeElement;
      expect(search).toBeTruthy();
    });

    it('should display the table', () => {
      const table = fixture.debugElement.query(By.css('#streamDefinitionsTable')).nativeElement;
      expect(table).toBeTruthy();
    });

    it('should not display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination'));
      expect(pagination).toBeNull();
    });

  });

  describe('At least 2 pages', () => {

    beforeEach(() => {

      streamsService.streamDefinitions = {
        _embedded: {
          streamDefinitionResourceList: Array.from({ length: 20 }).map((a, i) => {
            return {
              name: `foo${i}`,
              dslText: 'time |log ',
              status: 'undeployed',
              statusDescription: 'The app or group is known to the system, but is not currently deployed',
              force: false,
            };
          })
        },
        page: {
          size: 20,
          totalElements: 30,
          totalPages: 2
        }
      };

      fixture.detectChanges();
    });

    it('should display the search', () => {
      const search = fixture.debugElement.query(By.css('#filters')).nativeElement;
      expect(search).toBeTruthy();
    });

    it('should display the table', () => {
      const table = fixture.debugElement.query(By.css('#streamDefinitionsTable')).nativeElement;
      expect(table).toBeTruthy();
    });

    it('should display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination')).nativeElement;
      expect(pagination).toBeTruthy();
    });

    it('should display a message if no result after run a search', () => {
      streamsService.streamDefinitions = {
        _embedded: {
          streamDefinitionResourceList: []
        },
        page: {
          size: 20,
          totalElements: 0,
          totalPages: 0
        }
      };
      component.form.q = 'foo';
      component.search();
      fixture.detectChanges();
      const noResult = fixture.debugElement.query(By.css('#no-result')).nativeElement;
      expect(noResult).toBeTruthy();
    });

    it('should clear the search', () => {
      streamsService.streamDefinitions = {
        _embedded: {
          streamDefinitionResourceList: []
        },
        page: {
          size: 20,
          totalElements: 0,
          totalPages: 0
        }
      };
      component.form.q = 'foo';
      component.search();
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('#no-result .btn')).nativeElement;

      button.click();
      fixture.detectChanges();
      expect(button).toBeTruthy();
      expect(component.form.q).toBe('');
    });

    it('should apply a search', () => {
      streamsService.streamDefinitions = {
        _embedded: {
          streamDefinitionResourceList: Array.from({ length: 12 }).map((a, i) => {
            return {
              name: `foo${i}`,
              dslText: 'time |log ',
              status: 'undeployed',
              statusDescription: 'The app or group is known to the system, but is not currently deployed',
              force: false,
            };
          })
        },
        page: {
          size: 20,
          totalElements: 12,
          totalPages: 1
        }
      };
      component.form.q = 'foo';
      component.search();
      fixture.detectChanges();
      const noResult = fixture.debugElement.query(By.css('#streamDefinitionsTable')).nativeElement;
      expect(noResult).toBeTruthy();
    });

    it('should apply a sort on name and dsl', () => {
      const sortName: HTMLElement = fixture.debugElement.query(By.css('#sort-name a')).nativeElement;
      const sortDsl: HTMLElement = fixture.debugElement.query(By.css('#sort-dsl a')).nativeElement;
      [
        { click: sortName, nameDesc: true, sort: 'DEFINITION_NAME', order: 'DESC' },
        { click: sortDsl, dslAsc: true, sort: 'DEFINITION', order: 'ASC' },
        { click: sortDsl, dslDesc: true, sort: 'DEFINITION', order: 'DESC' },
        { click: sortName, nameAsc: true, sort: 'DEFINITION_NAME', order: 'ASC' },
        { click: sortDsl, dslAsc: true, sort: 'DEFINITION', order: 'ASC' }
      ].forEach((test) => {
        test.click.click();
        fixture.detectChanges();
        if (test['nameDesc']) {
          expect(fixture.debugElement.query(By.css('#sort-name .ico .desc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-name .ico .desc'))).toBeNull();
        }
        if (test['nameAsc']) {
          expect(fixture.debugElement.query(By.css('#sort-name .ico .asc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-name .ico .asc'))).toBeNull();
        }
        if (test['dslDesc']) {
          expect(fixture.debugElement.query(By.css('#sort-dsl .ico .desc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-dsl .ico .desc'))).toBeNull();
        }
        if (test['dslAsc']) {
          expect(fixture.debugElement.query(By.css('#sort-dsl .ico .asc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-dsl .ico .asc'))).toBeNull();
        }
        expect(component.params.sort).toBe(test.sort);
        expect(component.params.order).toBe(test.order);
      });
    });

    it('should change the page', () => {
      fixture.detectChanges();
      const buttonPage2 = fixture.debugElement.queryAll(By.css('#pagination a'))[0].nativeElement;
      buttonPage2.click();
      fixture.detectChanges();
      expect(component.params.page).toBe(1);
    });

  });

  describe('Stream action', () => {

    beforeEach(() => {
      streamsService.streamsContext.page = 0;
      streamsService.streamDefinitions = STREAM_DEFINITIONS;
      streamsService.streamDefinitions._embedded.streamDefinitionResourceList[1].status = 'deployed';
      fixture.detectChanges();
    });

    it('should delete a stream', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#streamDefinitionsTable tbody tr'))[0];
      const spy = spyOn(component, 'destroy');
      line.query(By.css('.actions button[name=stream-remove0]')).nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate to the detail stream', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#streamDefinitionsTable tbody tr'))[0];
      const navigate = spyOn((<any>component).router, 'navigate');
      line.query(By.css('.actions button[name="stream-details0"]')).nativeElement.click();
      expect(navigate).toHaveBeenCalledWith(['streams/definitions/foo2']);
    });

    it('Should navigate to the deployment page.', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#streamDefinitionsTable tbody tr'))[0];
      const navigate = spyOn((<any>component).router, 'navigate');
      line.query(By.css('.actions button[name="stream-deploy0"]')).nativeElement.click();
      expect(navigate).toHaveBeenCalledWith(['streams/definitions/foo2/deploy']);
    });

    it('Should stop the stream.', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#streamDefinitionsTable tbody tr'))[1];
      const spy = spyOn(component, 'undeploy');
      line.query(By.css('.actions button[name=stream-stop1]')).nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('Grouped applications action', () => {

    beforeEach(() => {
      streamsService.streamDefinitions = STREAM_DEFINITIONS;
      fixture.detectChanges();
    });

    it('should show the grouped action if at least one stream is selected', () => {
      fixture.debugElement.queryAll(By.css('#streamDefinitionsTable tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();
      expect(component.countSelected()).toBe(2);
      expect(fixture.debugElement.queryAll(By.css('#dropdown-actions'))).toBeTruthy();
    });

    it('should call the destroy modal', fakeAsync(() => {
      fixture.debugElement.queryAll(By.css('#streamDefinitionsTable tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();

      fixture.debugElement.query(By.css('#dropdown-actions .btn-dropdown')).nativeElement.click();
      fixture.detectChanges();
      tick();

      const spy = spyOn(modalService, 'show');
      fixture.debugElement.query(By.css('#destroy-streams')).nativeElement.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(StreamsDestroyComponent, { class: 'modal-lg' });
    }));

    it('should call the deploy modal', fakeAsync(() => {
      fixture.debugElement.queryAll(By.css('#streamDefinitionsTable tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();

      fixture.debugElement.query(By.css('#dropdown-actions .btn-dropdown')).nativeElement.click();
      fixture.detectChanges();
      tick();

      const spy = spyOn(modalService, 'show');
      fixture.debugElement.query(By.css('#deploy-streams')).nativeElement.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(StreamsDeployComponent, { class: 'modal-xl' });
    }));

    it('should call the undeploy modal', fakeAsync(() => {
      fixture.debugElement.queryAll(By.css('#streamDefinitionsTable tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();

      fixture.debugElement.query(By.css('#dropdown-actions .btn-dropdown')).nativeElement.click();
      fixture.detectChanges();
      tick();

      const spy = spyOn(modalService, 'show');
      fixture.debugElement.query(By.css('#undeploy-streams')).nativeElement.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(StreamsUndeployComponent, { class: 'modal-lg' });
    }));

  });

});
