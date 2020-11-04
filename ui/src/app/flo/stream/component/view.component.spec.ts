import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockStreamsService } from '../../../tests/service/stream.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { FloModule } from 'spring-flo';
import { MockSharedAppService } from '../../../tests/service/app.service.mock';
import { GraphViewComponent } from '../../shared/graph-view/graph-view.component';
import { RenderService } from '../render.service';
import { MetamodelService } from '../metamodel.service';
import { NotificationService } from '../../../shared/service/notification.service';
import { StreamFloViewComponent } from './view.component';
import { StreamService } from '../../../shared/api/stream.service';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { NodeHelper } from '../node-helper.service';


/**
 * Test {@link StreamGraphComponent}.
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
describe('StreamGraphComponent', () => {
  let component: StreamFloViewComponent;
  let fixture: ComponentFixture<StreamFloViewComponent>;
  const streamsService = new MockStreamsService();
  const notificationService = new NotificationServiceMock();
  const metamodelService = new MetamodelService(new MockSharedAppService());
  const renderService = new RenderService(metamodelService, new NodeHelper());

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [
        StreamFloViewComponent,
        GraphViewComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        FloModule
      ],
      providers: [
        { provide: StreamService, useValue: streamsService },
        { provide: NotificationService, useValue: notificationService },
        { provide: MetamodelService, useValue: metamodelService },
        { provide: RenderService, useValue: renderService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamFloViewComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
