import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { StreamDefinition } from '../model/stream-definition';
import { StreamGraphViewComponent } from '../stream-graph-view/stream-graph-view.component';
import { StreamGraphDefinitionComponent } from './stream-graph-definition.component';
import { FloModule } from 'spring-flo';
import { MockMetamodelService } from '../flo/mocks/mock-metamodel.service';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';

/**
 * Test {@link StreamGraphDefinitionComponent}.
 *
 * @author Alex Boyko
 */
describe('StreamGraphDefinitionComponent', () => {
  let component: StreamGraphDefinitionComponent;
  let fixture: ComponentFixture<StreamGraphDefinitionComponent>;
  const metamodelService = new MockMetamodelService();
  const renderService = new RenderService(metamodelService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StreamGraphViewComponent,
        StreamGraphDefinitionComponent
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
    fixture = TestBed.createComponent(StreamGraphDefinitionComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.dsl).toBeUndefined();
    expect(component.flo).toBeDefined();
  });

  it('check empty read-only view', () => {
    fixture.detectChanges();
    expect(component.flo.noPalette).toBeTruthy();
    expect(component.flo.readOnlyCanvas).toBeTruthy();
    expect(component.flo.getGraph().getCells().length).toEqual(0);
  });

  it('check stream in the view', (done) => {
    component.stream = new StreamDefinition('test-stream', 'http | filter | null', 'deployed');
    fixture.detectChanges();
    const subscription = component.flo.textToGraphConversionSubject.subscribe(() => {
      subscription.unsubscribe();
      expect(component.flo.getGraph().getElements().length).toEqual(3);
      expect(component.flo.getGraph().getLinks().length).toEqual(2);
      done();
    });
  });
});
