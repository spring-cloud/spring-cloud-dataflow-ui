import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockAuthService } from '../../tests/mocks/auth';
import { BsModalRef, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../auth/auth.service';
import { By } from '@angular/platform-browser';
import { StreamDefinition } from '../model/stream-definition';
import { DebugElement } from '@angular/core';
import { MockStreamsService } from '../../tests/mocks/streams';
import { StreamsService } from '../streams.service';
import { StreamsUndeployComponent } from './streams-undeploy.component';
import { BusyService } from '../../shared/services/busy.service';
import { StreamDslComponent } from '../../shared/components/dsl/dsl.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';

/**
 * Test {@link StreamsUndeployComponent}.
 *
 * @author Damien Vitrac
 */
describe('StreamsUndeployComponent', () => {

  let component: StreamsUndeployComponent;
  let fixture: ComponentFixture<StreamsUndeployComponent>;
  const notificationService = new MockNotificationService();
  const authService = new MockAuthService();
  const bsModalRef = new BsModalRef();
  const streamsService = new MockStreamsService();
  const busyService = new BusyService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StreamsUndeployComponent,
        StreamDslComponent,
        TruncatePipe,
        RolesDirective
      ],
      imports: [
        FormsModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: BsModalRef, useValue: bsModalRef },
        { provide: BusyService, useValue: busyService },
        { provide: NotificationService, useValue: notificationService },
        { provide: StreamsService, useValue: streamsService },
        { provide: LoggerService, useValue: loggerService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsUndeployComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  describe('1 stream undeploy', () => {

    const mock = [
      new StreamDefinition('foo0', 'foo1|foo2', 'undeployed')
    ];

    beforeEach(() => {
      component.open({ streamDefinitions: mock });
      fixture.detectChanges();
    });

    it('Should display a dedicate message', () => {
      const message: HTMLElement = fixture.debugElement.query(By.css('.modal-body')).nativeElement;
      expect(message.textContent).toContain(`This action will undeploy the stream`);
      expect(message.textContent).toContain(`foo0`);
    });

    it('Should call the service on validate undeploy', () => {
      const spy = spyOn(streamsService, 'undeployMultipleStreamDefinitions');
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-undeploy')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after undeploy one stream', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-undeploy')).nativeElement;
      bt.click();
      expect(notificationService.testSuccess[0]).toContain('1 stream definition(s) undeploy.');
    }));

    it('Should close the modal after a success undeploy', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-undeploy')).nativeElement;
      const spy = spyOn(bsModalRef, 'hide');
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    }));

  });

  describe('Multiple streams undeploy', () => {

    const mock = [
      new StreamDefinition('foo0', 'foo1|foo2', 'undeployed'),
      new StreamDefinition('bar0', 'bar1|bar2', 'deployed')
    ];

    beforeEach(() => {
      component.open({ streamDefinitions: mock });
      fixture.detectChanges();
    });

    it('Should display 2 streams', () => {
      const tr: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-streams tbody tr'));
      const tr1: HTMLElement = tr[0].nativeElement;
      const tr2: HTMLElement = tr[1].nativeElement;
      expect(tr.length).toBe(2);
      expect(tr1.textContent).toContain(mock[0].name);
      expect(tr1.textContent).toContain(mock[0].dslText);
      expect(tr2.textContent).toContain(mock[1].name);
      expect(tr2.textContent).toContain(mock[1].dslText);
    });

    it('Should call the service on validate undeploy', () => {
      const spy = spyOn(streamsService, 'undeployMultipleStreamDefinitions');
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-undeploy')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after undeploy 2 streams', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-undeploy')).nativeElement;
      bt.click();
      expect(notificationService.testSuccess[0]).toContain('2 stream definition(s) undeploy.');
    }));

    it('Should close the modal after a success undeploy', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-undeploy')).nativeElement;
      const spy = spyOn(bsModalRef, 'hide');
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    }));

  });

  describe('Modal', () => {

    beforeEach(() => {
      component.open({
        streamDefinitions: [
          new StreamDefinition('foo', 'time|log', 'undeployed'),
          new StreamDefinition('bar', 'time|log', 'undeployed')
        ]
      });
      fixture.detectChanges();
    });

    it('Should call the close action (header close)', () => {
      fixture.detectChanges();
      const spy = spyOn(bsModalRef, 'hide');
      const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-header .close')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

    it('Should call the close action (footer close)', () => {
      fixture.detectChanges();
      const spy = spyOn(bsModalRef, 'hide');
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-cancel')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

  });

});
