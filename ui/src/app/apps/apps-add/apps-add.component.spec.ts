import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalRef, ModalModule, PopoverModule, BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { AppsService } from '../apps.service';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockAppsService } from '../../tests/mocks/apps';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NotificationService } from '../../shared/services/notification.service';
import { AppsAddComponent } from './apps-add.component';
import { DATAFLOW_PAGE } from '../../shared/components/page/page.component';
import { DATAFLOW_LIST } from '../../shared/components/list/list.component';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { TippyDirective } from '../../shared/directives/tippy.directive';

/**
 * Test {@link AppsAddComponent}.
 *
 * @author Damien Vitrac
 */
describe('AppsAddComponent', () => {
  let component: AppsAddComponent;
  let fixture: ComponentFixture<AppsAddComponent>;
  const bsModalRef = new BsModalRef();
  const notificationService = new MockNotificationService();
  const appsService = new MockAppsService();
  const routingStateService = new MockRoutingStateService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppsAddComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        PagerComponent,
        TippyDirective
      ],
      imports: [
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        NgxPaginationModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AppsService, useValue: appsService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: BsModalRef, useValue: bsModalRef },
        { provide: NotificationService, useValue: notificationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsAddComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
