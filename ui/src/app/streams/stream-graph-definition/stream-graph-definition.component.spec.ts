import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { StreamDefinition } from '../model/stream-definition';
import { StreamGraphViewComponent } from '../stream-graph-view/stream-graph-view.component';
import { StreamGraphDefinitionComponent } from './stream-graph-definition.component';
import { FloModule } from 'spring-flo';
import { MockMetamodelService } from '../flo/mocks/mock-metamodel.service';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';
import { StreamMetrics } from '../model/stream-metrics';
import { dia } from 'jointjs';
import { TYPE_INSTANCE_DOT, TYPE_INSTANCE_LABEL } from '../flo/support/shapes';

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

  it('check dots in the view', (done) => {
    component.stream = new StreamDefinition('test-stream', 'http | filter | null', 'deployed');
    fixture.detectChanges();
    const subscription = component.flo.textToGraphConversionSubject.subscribe(() => {
      subscription.unsubscribe();

      const httpMetrics = createAppMetrics('source', 'http', 2, 0, 3.4562243);
      const filterMetrics = createAppMetrics('processor', 'filter', 40, 4.68954, 2.93718423);
      const nullMetrics = createAppMetrics('sink', 'null', 3, 4.3124, 0);

      // Remove 3 instances to have 37/40 label
      filterMetrics.instances.pop();
      filterMetrics.instances.pop();
      filterMetrics.instances.pop();
      filterMetrics.instances[0].properties[StreamMetrics.INSTANCE_COUNT] = 40;

      component.metrics = {
        name: 'test-stream',
        applications: [
          httpMetrics,
          filterMetrics,
          nullMetrics
        ]
      };

      // verify http dots
      const http = <dia.Element> component.flo.getGraph().getElements().find(e => e.attr('metadata/name') === 'http');
      expect(http).toBeDefined();
      const httpEmbeds = http.getEmbeddedCells().filter(c => c.get('type') === TYPE_INSTANCE_DOT);
      expect(http.getEmbeddedCells().find(c => c.get('type') === TYPE_INSTANCE_LABEL)).toBeUndefined();
      expect(httpEmbeds.length).toEqual(2);
      httpMetrics.instances.forEach((instance, i) => expect(httpEmbeds[i].attr('instance')).toEqual(instance));

      // verify filter label
      const filter = <dia.Element> component.flo.getGraph().getElements().find(e => e.attr('metadata/name') === 'filter');
      expect(filter).toBeDefined();
      expect(filter.getEmbeddedCells().find(c => c.get('type') === TYPE_INSTANCE_DOT)).toBeUndefined();
      const filterEmbeds = filter.getEmbeddedCells().filter(c => c.get('type') === TYPE_INSTANCE_LABEL);
      expect(filterEmbeds.length).toEqual(1);
      expect(filterEmbeds[0].attr('.label/text')).toEqual('37/40');

      // verify null dots
      const nullApp = <dia.Element> component.flo.getGraph().getElements().find(e => e.attr('metadata/name') === 'null');
      expect(nullApp).toBeDefined();
      const nullEmbeds = nullApp.getEmbeddedCells().filter(c => c.get('type') === TYPE_INSTANCE_DOT);
      expect(nullApp.getEmbeddedCells().find(c => c.get('type') === TYPE_INSTANCE_LABEL)).toBeUndefined();
      expect(nullEmbeds.length).toEqual(3);
      nullMetrics.instances.forEach((instance, i) => expect(nullEmbeds[i].attr('instance')).toEqual(instance));
      done();

    });
  });



  function createAppMetrics(group: string, name: string, numberOfInstances: number,
                            inRate: number, outRate: number): StreamMetrics.Application {
    const instances: StreamMetrics.Instance[] = [];
    for (let index = 0; index < numberOfInstances; index++) {
      const properties = {};
      properties[StreamMetrics.TYPE] = group;
      instances.push({
        guid: `${name}-${index}`,
        index: index,
        properties: properties,
        metrics: [
          {name: StreamMetrics.INPUT_CHANNEL_MEAN, value: inRate},
          {name: StreamMetrics.OUTPUT_CHANNEL_MEAN, value: outRate}
        ]
      });
    }
    return {
      name: name,
      instances: instances,
      aggregateMetrics: []
    }
  }

});
