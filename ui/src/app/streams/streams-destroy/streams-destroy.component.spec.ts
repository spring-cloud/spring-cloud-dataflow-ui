import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MockToastyService} from '../../tests/mocks/toasty';
import {MockAuthService} from '../../tests/mocks/auth';
import {BsModalRef, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from '../../auth/auth.service';
import {ToastyService} from 'ng2-toasty';
import {By} from '@angular/platform-browser';
import {StreamsDestroyComponent} from './streams-destroy.component';
import {StreamsModule} from '../streams.module';
import {StreamDefinition} from '../model/stream-definition';
import {DebugElement} from '@angular/core';
import {MockStreamsService} from '../../tests/mocks/streams';
import {StreamsService} from '../streams.service';
import {BusyService} from '../../shared/services/busy.service';
import {StreamDslComponent} from '../../shared/components/dsl/dsl.component';
import {TruncatePipe} from '../../shared/pipes/truncate.pipe';
import {RolesDirective} from '../../auth/directives/roles.directive';

/**
 * Test {@link StreamsDestroyComponent}.
 *
 * @author Damien Vitrac
 */
describe('StreamsDestroyComponent', () => {

  let component: StreamsDestroyComponent;
  let fixture: ComponentFixture<StreamsDestroyComponent>;
  const toastyService = new MockToastyService();
  const authService = new MockAuthService();
  const bsModalRef = new BsModalRef();
  const streamsService = new MockStreamsService();

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
        {provide: AuthService, useValue: authService},
        {provide: BsModalRef, useValue: bsModalRef},
        {provide: BusyService, useValue: new BusyService()},
        {provide: ToastyService, useValue: toastyService},
        {provide: StreamsService, useValue: streamsService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsDestroyComponent);
    component = fixture.componentInstance;
    toastyService.clearAll();
  });

  describe('1 stream destroy', () => {

    const mock = [
      new StreamDefinition('foo0', 'foo1|foo2', 'undeployed')
    ];

    beforeEach(() => {
      component.open({streamDefinitions: mock});
      fixture.detectChanges();
    });

    it('Should display a dedicate message', () => {
      const message: HTMLElement = fixture.debugElement.query(By.css('.modal-body')).nativeElement;
      expect(message.textContent).toContain(`This action will destroy and delete the stream`);
      expect(message.textContent).toContain(`foo0`);
    });

    it('Should call the service on validate destroy', () => {
      const spy = spyOn(streamsService, 'destroyMultipleStreamDefinitions');
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after destroy one stream', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      expect(toastyService.testSuccess[0]).toContain('1 stream definition(s) destroy.');
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
      new StreamDefinition('foo0', 'foo1|foo2', 'undeployed'),
      new StreamDefinition('bar0', 'bar1|bar2', 'deployed')
    ];

    beforeEach(() => {
      component.open({streamDefinitions: mock});
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
      const spy = spyOn(streamsService, 'destroyMultipleStreamDefinitions');
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after destroy 2 streams', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      expect(toastyService.testSuccess[0]).toContain('2 stream definition(s) destroy.');
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
