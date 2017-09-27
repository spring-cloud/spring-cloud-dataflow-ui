import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { StreamGraphViewComponent } from '../stream-graph-view/stream-graph-view.component';
import { FloModule } from 'spring-flo';
import { MockMetamodelService } from '../flo/mocks/mock-metamodel.service';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';

/**
 * Test {@link StreamGraphViewComponent}.
 *
 * @author Alex Boyko
 */
describe('StreamGraphViewComponent', () => {
  let component: StreamGraphViewComponent;
  let fixture: ComponentFixture<StreamGraphViewComponent>;
  const metamodelService = new MockMetamodelService();
  const renderService = new RenderService(metamodelService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StreamGraphViewComponent
      ],
      imports: [
        FloModule
      ],
      providers: [
        { provide: MetamodelService, useValue: metamodelService },
        { provide: RenderService, useValue: renderService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamGraphViewComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.dsl).toBeUndefined();
    expect(component.flo).toBeDefined();
    expect(component.paperPadding).toEqual(5);
  });

  it('check empty read-only view', () => {
    fixture.detectChanges();
    expect(component.flo.noPalette).toBeTruthy();
    expect(component.flo.readOnlyCanvas).toBeTruthy();
    expect(component.flo.getGraph().getCells().length).toEqual(0);
  });

  it('check stream in the view', (done) => {
    component.dsl = 'http | filter | null';
    fixture.detectChanges();
    const subscription = component.flo.textToGraphConversionObservable.subscribe(() => {
      subscription.unsubscribe();
      expect(component.flo.getGraph().getElements().length).toEqual(3);
      expect(component.flo.getGraph().getLinks().length).toEqual(2);
      done();
    });
  });
});
