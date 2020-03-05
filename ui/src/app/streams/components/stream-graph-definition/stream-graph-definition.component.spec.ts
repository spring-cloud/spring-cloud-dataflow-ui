import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { StreamDefinition } from '../../model/stream-definition';
import { GraphViewComponent } from '../../../shared/flo/graph-view/graph-view.component';
import { StreamGraphDefinitionComponent } from './stream-graph-definition.component';
import { FloModule } from 'spring-flo';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';
import {
  StreamStatuses,
  StreamStatus
} from '../../model/stream-metrics';
import { dia } from 'jointjs';
import {
  TYPE_INSTANCE_DOT,
  TYPE_INSTANCE_LABEL
} from '../flo/support/shapes';
import { MockSharedAppService } from '../../../tests/mocks/shared-app';
import { ApplicationRef, ComponentFactoryResolver } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { StreamsModule } from '../../streams.module';

/**
 * Test {@link StreamGraphDefinitionComponent}.
 *
 * @author Alex Boyko
 */
describe('StreamGraphDefinitionComponent', () => {
  let component: StreamGraphDefinitionComponent;
  let fixture: ComponentFixture<StreamGraphDefinitionComponent>;
  const metamodelService = new MetamodelService(new MockSharedAppService());

  let applicationRef: ApplicationRef;
  let resolver: ComponentFactoryResolver;
  let bsModalService: BsModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StreamsModule
      ],
    });
  }));

  beforeEach(
    inject(
      [
        ApplicationRef,
        BsModalService,
        ComponentFactoryResolver
      ],
      (
        _applicationRef: ApplicationRef,
        _bsModalService: BsModalService,
        _resolver: ComponentFactoryResolver
      ) => {
        applicationRef = _applicationRef;
        bsModalService = _bsModalService;
        resolver = _resolver;
      }
    )
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamGraphDefinitionComponent);
    component = fixture.componentInstance;
    fixture.componentInstance.metamodel = metamodelService;
    fixture.componentInstance.renderer = new RenderService(metamodelService, bsModalService, resolver,
      fixture.debugElement.injector, applicationRef);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component.dsl).toBeUndefined();
    expect(component.flo).toBeDefined();
  });

  it('check empty read-only view', () => {
    expect(component.flo.noPalette).toBeTruthy();
    expect(component.flo.readOnlyCanvas).toBeTruthy();
    expect(component.flo.getGraph().getCells().length).toEqual(0);
  });

  it('check stream in the view', (done) => {
    component.stream = new StreamDefinition('test-stream', 'http | filter | null', 'http | filter | null', 'demo description', 'deployed');
    const subscription = component.flo.textToGraphConversionObservable.subscribe(() => {
      subscription.unsubscribe();
      expect(component.flo.getGraph().getElements().length).toEqual(3);
      expect(component.flo.getGraph().getLinks().length).toEqual(2);
      done();
    });
    // Subscribe to graph changes before running angular change/update cycle
    fixture.detectChanges();
  });

  it('verify dots in the view', (done) => {
    component.stream = new StreamDefinition('test-stream', 'http | filter | null', 'http | filter | null', 'demo description', 'deployed');

    const httpMetrics = createStreamStatus('source', 'http', 2);
    const filterMetrics = createStreamStatus('processor', 'filter', 60);
    const nullMetrics = createStreamStatus('sink', 'null', 3);

    // Remove 3 instances to have 57/60 label
    filterMetrics.instances.pop();
    filterMetrics.instances.pop();
    filterMetrics.instances.pop();

    const streamMetrics = new StreamStatuses();
    streamMetrics.name = 'test-stream';
    streamMetrics.applications = [
      httpMetrics,
      filterMetrics,
      nullMetrics
    ];
    component.metrics = streamMetrics;

    const subscription = component.flo.textToGraphConversionObservable.subscribe(() => {
      subscription.unsubscribe();

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
      expect(filterEmbeds[0].attr('.label/text')).toEqual('57/57');

      // verify null dots
      const nullApp = <dia.Element> component.flo.getGraph().getElements().find(e => e.attr('metadata/name') === 'null');
      expect(nullApp).toBeDefined();
      const nullEmbeds = nullApp.getEmbeddedCells().filter(c => c.get('type') === TYPE_INSTANCE_DOT);
      expect(nullApp.getEmbeddedCells().find(c => c.get('type') === TYPE_INSTANCE_LABEL)).toBeUndefined();
      expect(nullEmbeds.length).toEqual(3);
      nullMetrics.instances.forEach((instance, i) => expect(nullEmbeds[i].attr('instance')).toEqual(instance));

      done();

    });
    // Subscribe to graph changes before running angular change/update cycle
    fixture.detectChanges();
  });

  function createStreamStatus(group: string, name: string, numberOfInstances: number): StreamStatus {
    const instances = [];
    for (let index = 0; index < numberOfInstances; index++) {
      instances.push({
        guid: `${name}-${index}`,
        index: index,
      });
    }
    return StreamStatus.fromJSON({
      name: name,
      instances: {
        _embedded: {
          appInstanceStatusResourceList: instances
        }
      }
    });
  }

});
