import { StreamCreateDialogComponent } from './create-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStreamsService } from '../../../tests/mocks/streams';
import { RouterTestingModule } from '@angular/router/testing';
import { StreamsService } from '../../streams.service';
import { FloModule } from 'spring-flo';
import { BsModalRef, ModalModule } from 'ngx-bootstrap';
import { ParserService } from '../../../shared/services/parser.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { NotificationService } from '../../../shared/services/notification.service';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { MocksSharedAboutService } from '../../../tests/mocks/shared-about';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { of } from 'rxjs';
import { Platform } from '../../../shared/model/platform';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';

/**
 * Test {@link StreamCreateDialogComponent}.
 *
 * @author Alex Boyko
 */
describe('StreamCreateDialogComponent', () => {
  let component: StreamCreateDialogComponent;
  let fixture: ComponentFixture<StreamCreateDialogComponent>;
  const streamsService = new MockStreamsService();
  const loggerService = new LoggerService();
  const parserService = new ParserService();
  const notificationService = new MockNotificationService();
  const aboutService = new MocksSharedAboutService();


  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        StreamCreateDialogComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        FloModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: StreamsService, useValue: streamsService },
        { provide: ParserService, useValue: parserService },
        { provide: LoggerService, useValue: loggerService },
        { provide: NotificationService, useValue: notificationService },
        { provide: SharedAboutService, useValue: aboutService },
        { provide: BsModalRef, useValue: null },
        BlockerService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamCreateDialogComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    spyOn(streamsService, 'getPlatforms').and.returnValue(of([
      new Platform('default', 'local')
    ]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should be populate', () => {
    spyOn(streamsService, 'getPlatforms').and.returnValue(of([
      new Platform('default', 'local')
    ]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
    component.open({ dsl: 'file | log' });
    expect(component).toBeTruthy();
  });

});
