import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockAuthService } from '../../tests/mocks/auth';
import { BsModalRef, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../auth/auth.service';
import { By } from '@angular/platform-browser';
import { StreamsDestroyComponent } from './streams-destroy.component';
import { StreamDefinition } from '../model/stream-definition';
import { DebugElement } from '@angular/core';
import { MockStreamsService } from '../../tests/mocks/streams';
import { StreamsService } from '../streams.service';
import { StreamDslComponent } from '../../shared/components/dsl/dsl.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { BlockerService } from '../../shared/components/blocker/blocker.service';

/**
 * Test {@link StreamsDestroyComponent}.
 *
 * @author Damien Vitrac
 */
describe('StreamsDestroyComponent', () => {

  let component: StreamsDestroyComponent;
  let fixture: ComponentFixture<StreamsDestroyComponent>;
  const notificationService = new MockNotificationService();
  const authService = new MockAuthService();
  const bsModalRef = new BsModalRef();
  const streamsService = new MockStreamsService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StreamsDestroyComponent,
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
        { provide: NotificationService, useValue: notificationService },
        { provide: StreamsService, useValue: streamsService },
        { provide: LoggerService, useValue: loggerService },
        BlockerService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsDestroyComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  describe('1 stream destroy', () => {

    const mock = [
      new StreamDefinition('foo0', 'foo1|foo2', 'foo1|foo2', 'demo-description', 'undeployed')
    ];

    beforeEach(() => {
      component.open({ streamDefinitions: mock });
      fixture.detectChanges();
    });

    it('Should display a dedicate message', () => {
      const message: HTMLElement = fixture.debugElement.query(By.css('.modal-body')).nativeElement;
      expect(message.textContent).toContain(`This action will destroy and delete the stream`);
      expect(message.textContent).toContain(`foo0`);
    });

    it('Should call the service on validate destroy', () => {
      const spy = spyOn(streamsService, 'destroyMultipleStreamDefinitions').and.callThrough();
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after destroy one stream', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      expect(notificationService.testSuccess[0]).toContain('1 stream definition was destroyed.');
    }));

    it('Should close the modal after a success destroy', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      const spy = spyOn(bsModalRef, 'hide');
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    }));

  });

  describe('Multiple streams destroy', () => {

    const mock = [
      new StreamDefinition('foo0', 'foo1|foo2', 'foo1|foo2', 'demo-description', 'undeployed'),
      new StreamDefinition('bar0', 'bar1|bar2', 'bar1|bar2', 'demo-description', 'deployed')
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

    it('Should call the service on validate destroy', () => {
      const spy = spyOn(streamsService, 'destroyMultipleStreamDefinitions').and.callThrough();
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after destroy 2 streams', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      expect(notificationService.testSuccess[0]).toContain('2 stream definitions were destroyed.');
    }));

    it('Should close the modal after a success destroy', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
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
          new StreamDefinition('foo', 'time|log', 'time|log', 'demo-description', 'undeployed'),
          new StreamDefinition('bar', 'time|log', 'time|log', 'demo-description', 'undeployed')
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
