import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FloModule, EditorComponent } from 'spring-flo';
import { MetamodelService } from './metamodel.service';
import { RenderService } from './render.service';
import { dia } from 'jointjs';
import { Flo, Constants } from 'spring-flo';
import { Shapes } from 'spring-flo';
import { EditorService } from './editor.service';
import { MockSharedAppService } from '../../../tests/mocks/shared-app';
import { LoggerService } from '../../../shared/services/logger.service';
import * as _$ from 'jquery';
import { ApplicationRef, ComponentFactoryResolver } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { StreamsModule } from '../../streams.module';

const $: any = _$;

describe('Streams Editor Service', () => {
  const editorService = new EditorService();

  const METAMODEL_SERVICE = new MetamodelService(new MockSharedAppService());
  const RENDER_SERVICE = new RenderService(METAMODEL_SERVICE);


  let graph: dia.Graph;

  beforeEach(() => {
    graph = new dia.Graph();
    graph.set('type', Constants.CANVAS_CONTEXT);
  });

  it('no problems on simple valid stream', (done) => {
    const timeSource = createSource('time');
    const transformProcessor = createProcessor('transform');
    const logSink = createSink('log');
    createLink(timeSource, transformProcessor);
    createLink(transformProcessor, logSink);
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 0);
      done();
    });
  });

  it('bad stream - no primary output link from source', (done) => {
    const timeSource = createSource('time');
    const logSink = createSink('log');
    createTap(timeSource, logSink);
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 1);
      const timeMarkers = getMarkersOn(markers, timeSource);
      expectMarker(timeMarkers[0], Flo.Severity.Error, EditorService.VALMSG_NEEDS_NONTAP_OUTPUT_CONNECTION);
      done();
    });
  });

  it('bad stream - no primary output link from processor', (done) => {
    const timeSource = createSource('time');
    const transformProcessor = createProcessor('transform');
    const logSink = createSink('log');
    createLink(timeSource, transformProcessor);
    createTap(transformProcessor, logSink);
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 1);
      expectMarker(getMarkersOn(markers, transformProcessor)[0],
        Flo.Severity.Error, EditorService.VALMSG_NEEDS_NONTAP_OUTPUT_CONNECTION);
      done();
    });
  });

  it('link out of a sink', (done) => {
    const logSink = createSink('log');
    const transformProcessor = createProcessor('transform');
    createLink(logSink, transformProcessor);
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 3);
      let m = getMarkersOn(markers, transformProcessor);
      expectMarker(m[0], Flo.Severity.Error, EditorService.VALMSG_NEEDS_OUTPUT_CONNECTION);
      m = getMarkersOn(markers, logSink);
      expectMarker(m[0], Flo.Severity.Error, EditorService.VALMSG_NEEDS_INPUT_CONNECTION);
      expectMarker(m[1], Flo.Severity.Error, EditorService.VALMSG_SINK_SHOULD_BE_AT_END);
      done();
    });
  });

  it('too many primary links from source', (done) => {
    const timeSource = createSource('time');
    createLink(timeSource, createSink('log'));
    createLink(timeSource, createSink('log'));
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 1);
      const m = getMarkersOn(markers, timeSource);
      expectMarker(m[0], Flo.Severity.Error, EditorService.VALMSG_ONLY_ONE_NON_TAPLINK_FROM_SOURCE);
      done();
    });
  });

  it('too many primary links from processor', (done) => {
    const transformProcessor = createProcessor('transform');
    createLink(createSource('time'), transformProcessor);
    createLink(transformProcessor, createSink('log'));
    createLink(transformProcessor, createSink('log'));
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 1);
      const m = getMarkersOn(markers, transformProcessor);
      expectMarker(m[0], Flo.Severity.Error, EditorService.VALMSG_ONLY_ONE_NON_TAPLINK_FROM_PROCESSOR);
      done();
    });
  });

  it('link in to a source', (done) => {
    const timeSource = createSource('time');
    const transformProcessor = createProcessor('transform');
    const timeSource2 = createSource('time');
    createLink(transformProcessor, timeSource);
    createLink(timeSource2, transformProcessor);
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 2);
      const timeMarkers = getMarkersOn(markers, timeSource);
      expectMarker(timeMarkers[0], Flo.Severity.Error, EditorService.VALMSG_SOURCES_MUST_BE_AT_START);
      expectMarker(timeMarkers[1], Flo.Severity.Error, EditorService.VALMSG_NEEDS_OUTPUT_CONNECTION);
      done();
    });
  });

  it('unfinished links', (done) => {
    const timeSource = createSource('time');
    const transformProcessor = createProcessor('transform');
    // invalid links
    let linkParams: Shapes.LinkCreationParams = {
      source: { 'id': timeSource.id, 'port': 'input', 'selector': '.output-port' }, // incorrect port
      target: { 'id': transformProcessor.id, 'port': 'input', 'selector': '.input-port' }
    };
    let link = Shapes.Factory.createLink(linkParams);
    graph.addCell(link);

    linkParams = {
      source: { 'id': timeSource.id, 'port': 'output', 'selector': '.output-port' },
      target: { 'id': transformProcessor.id, 'port': 'output', 'selector': '.input-port' } // incorrect port
    };
    link = Shapes.Factory.createLink(linkParams);
    graph.addCell(link);

    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 3);
      let m = getMarkersOn(markers, timeSource);
      expectMarker(m[0], Flo.Severity.Error, 'Invalid outgoing link');
      m = getMarkersOn(markers, transformProcessor);
      expectMarker(m[0], Flo.Severity.Error, 'Invalid incoming link');
      expectMarker(m[1], Flo.Severity.Error, EditorService.VALMSG_NEEDS_OUTPUT_CONNECTION);
      done();
    });
  });

  it('source is missing sink connection', (done) => {
    const timeSource = createSource('time');
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 1);
      const timeMarkers = getMarkersOn(markers, timeSource);
      expectMarker(timeMarkers[0], Flo.Severity.Error, EditorService.VALMSG_NEEDS_OUTPUT_CONNECTION);
      done();
    });
  });

  it('sink is missing input connection', (done) => {
    const logSink = createSink('log');
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 1);
      const logMarkers = getMarkersOn(markers, logSink);
      expectMarker(logMarkers[0], Flo.Severity.Error, EditorService.VALMSG_NEEDS_INPUT_CONNECTION);
      done();
    });
  });

  it('processor is missing input and output connection', (done) => {
    const transformProcessor = createProcessor('transform');
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 2);
      const transformMarkers = getMarkersOn(markers, transformProcessor);
      expectMarker(transformMarkers[0], Flo.Severity.Error, EditorService.VALMSG_NEEDS_INPUT_CONNECTION);
      expectMarker(transformMarkers[1], Flo.Severity.Error, EditorService.VALMSG_NEEDS_OUTPUT_CONNECTION);
      done();
    });
  });

  it('destination should be named', (done) => {
    // Calling createNode since do not want to set the name
    const destination = createNode('destination', 'destination');
    createLink(createSource('time'), destination);
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 1);
      expectMarker(getMarkersOn(markers, destination)[0], Flo.Severity.Error, EditorService.VALMSG_DESTINATION_SHOULD_BE_NAMED);
      done();
    });
  });

  it('no tap links on destinations', (done) => {
    const destination = createDestination('d');
    createTap(destination, createSink('log'));
    editorService.validate(graph, null, null).then((markers) => {
      printMarkers(markers);
      expectMarkerCount(markers, 1);
      expectMarker(getMarkersOn(markers, destination)[0], Flo.Severity.Error, EditorService.VALMSG_DESTINATION_CANNOT_BE_TAPPED);
      done();
    });
  });

  it('no tap links on tap sources', (done) => {
    const tapSource = createTapNode('aaaa.time');
    createTap(tapSource, createSink('log'));
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 1);
      expectMarker(getMarkersOn(markers, tapSource)[0], Flo.Severity.Error, EditorService.VALMSG_TAPSOURCE_CANNOT_BE_TAPPED);
      done();
    });
  });

  it('metadata validation', (done) => {
    const madeupNode = createNode('madeup');
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 1);
      expectMarker(getMarkersOn(markers, madeupNode)[0], Flo.Severity.Error, 'Unknown element \'madeup\'');
      done();
    });
  });

  it('property validation', (done) => {
    const formatPropertySpec = toPropertyMetadata('formatid', 'format', 'Format of the time', 'HHMM', 'string');
    const timeMetadata = toMetadataWithCustomProperties('time', 'source', new Map([['format', formatPropertySpec]]));
    const timeSource = createNodeFromMetadata(timeMetadata);
    createLink(timeSource, createSink('log'));
    setProperties(timeSource, new Map([['madeup', 'anyoldvalue']]));
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 0);
      // expectMarker(getMarkersOn(markers, timeSource)[0], Flo.Severity.Error, 'unrecognized option \'madeup\' for app \'time\'');
      done();
    });
  });

  it('property validation - long names', (done) => {
    const formatPropertySpec = toPropertyMetadata('foobar.format', 'format', 'Format of the time', 'HHMM', 'string');
    const timeMetadata = toMetadataWithCustomProperties('time', 'source', new Map([['foobar.format', formatPropertySpec]]));
    const timeSource = createNodeFromMetadata(timeMetadata);
    createLink(timeSource, createSink('log'));
    // Both forms valid (short form 'format' and long form 'foobar.format')
    setProperties(timeSource, new Map([['format', 'anyoldvalue'], ['foobar.format', 'anyoldvalue2']]));
    editorService.validate(graph, null, null).then((markers) => {
      expectMarkerCount(markers, 0);
      done();
    });
  });

  function expectMarker(marker: Flo.Marker, severity: number, message: string) {
    if (!marker) {
      fail('missing marker');
    } else {
      expect(marker.message).toEqual(message);
      expect(marker.severity).toEqual(severity);
    }
  }

  function expectMarkerCount(markers: Map<string | number, Array<Flo.Marker>>, expectedCount: number) {
    let count = 0;
    Array.from(markers.keys()).forEach((k) => {
      count += markers.get(k).length;
    });
    expect(count).toEqual(expectedCount);
  }

  function printMarkers(markers: Map<string | number, Array<Flo.Marker>>) {
    LoggerService.log('Markers summary: ' + markers.size + ' map entries');
    Array.from(markers.keys()).forEach((k) => {
      const values = markers.get(k);
      LoggerService.log('For ' + k + ' there are ' + values.length + ' markers');
      for (let m = 0; m < values.length; m++) {
        const marker = values[m];
        LoggerService.log(' ' + m + ') ' + JSON.stringify(marker));
      }
    });
  }

  function getMarkersOn(markers: Map<string | number, Array<Flo.Marker>>, node: dia.Element): Flo.Marker[] {
    return markers.get(node.id);
  }

  function setStreamName(node: dia.Element, name: string) {
    node.attr('stream-name', name);
  }

  function createSource(appname: string): dia.Element {
    return createNode(appname, 'source');
  }

  function createProcessor(appname: string): dia.Element {
    return createNode(appname, 'processor');
  }

  function createSink(appname: string): dia.Element {
    return createNode(appname, 'sink');
  }

  function getName(element: dia.Cell) {
    return element.attr('metadata/name');
  }

  function setLabel(element: dia.Cell, label: string) {
    element.attr('node-name', label);
  }

  function setProperties(element: dia.Cell, properties: Map<string, string>) {
    Array.from(properties.keys()).forEach((k) => {
      element.attr('props/' + k, properties.get(k));
    });
  }

  function toPropertyMetadata(id: string, name: string, description?: string, defaultValue?: any, type?: string): Flo.PropertyMetadata {
    return {
      id: id,
      name: name,
      description: description,
      defaultValue: defaultValue,
      type: type
      // readonly [propName: string]: any;
    };
  }

  function toMetadataWithCustomProperties(
    appname: string, group: string, properties: Map<string, Flo.PropertyMetadata>): Flo.ElementMetadata {
    const propertiesCopy = new Map(properties);
    const emd: Flo.ElementMetadata = {
      name: appname,
      group: group,
      get(property: string): Promise<Flo.PropertyMetadata> {
        return Promise.resolve(propertiesCopy.get(property));
      },
      properties(): Promise<Map<string, Flo.PropertyMetadata>> {
        return Promise.resolve(propertiesCopy);
      }
    };
    return emd;
  }

  function createNodeFromMetadata(metadata: Flo.ElementMetadata) {
    return createNode(metadata.name, metadata.group, metadata);
  }

  // If you do not supply the group it is undefined and a way to check unresolved metadata
  function createNode(appname: string, group?: string, metadata?: Flo.ElementMetadata): dia.Element {

    if (!metadata) {
      metadata = {
        name: appname,
        group: group,
        get(property: String): Promise<Flo.PropertyMetadata> {
          return Promise.resolve(null);
        },
        properties(): Promise<Map<string, Flo.PropertyMetadata>> {
          return Promise.resolve(new Map());
        },
        metadata: {
          unresolved: !group ? true : false
        }
      };
    }
    const params: Shapes.ElementCreationParams = {
      metadata: metadata,
      graph: graph,
      renderer: RENDER_SERVICE
    };
    const newNode: dia.Element = Shapes.Factory.createNode(params);
    return newNode;
  }

  function createTap(from, to): dia.Link {
    return createLink(from, to, true);
  }

  function createLink(from, to, isTapLink?: boolean): dia.Link {
    const linkParams: Shapes.LinkCreationParams = {
      source: { 'id': from.id, 'port': 'output', 'selector': '.output-port' },
      target: { 'id': to.id, 'port': 'input', 'selector': '.input-port' }
    };
    const link = Shapes.Factory.createLink(linkParams);
    link.attr('props/isTapLink', isTapLink ? true : false);
    graph.addCell(link);
    return link;
  }

  function createTapNode(tappedStreamAndApp: string): dia.Element {
    const tapNameMD = toPropertyMetadata('name', 'name', 'Tap name (stream.app format)', '', '');
    const tapMD = toMetadataWithCustomProperties('tap', 'other', new Map([['name', tapNameMD]]));
    const newTapNode: dia.Element = createNodeFromMetadata(tapMD);
    newTapNode.attr('props/name', tappedStreamAndApp);
    return newTapNode;
  }

  function createDestination(destinationname: string): dia.Element {
    const destinationNameMD = toPropertyMetadata('name', 'name', 'Destination name', '', '');
    const destinationMD = toMetadataWithCustomProperties('destination', 'other', new Map([['name', destinationNameMD]]));
    const newDestinationNode: dia.Element = createNodeFromMetadata(destinationMD); // 'destination', 'destination');
    newDestinationNode.attr('props/name', destinationname);
    return newDestinationNode;
  }

});

describe('editor.service : Auto-Link', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  const metamodelService = new MetamodelService(new MockSharedAppService());
  let metamodel: Map<string, Map<string, Flo.ElementMetadata>>;

  let applicationRef: ApplicationRef;
  let resolver: ComponentFactoryResolver;
  let bsModalService: BsModalService;

  let flo: Flo.EditorContext;

  beforeEach(async(() => {
    metamodelService.load().then(data => metamodel = data);
    TestBed.configureTestingModule({
      imports: [
        StreamsModule
      ]
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
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    component.metamodel = metamodelService;
    component.renderer = new RenderService(metamodelService, bsModalService, resolver, fixture.debugElement.injector, applicationRef);
    component.editor = new EditorService();
    const subscription = component.floApi.subscribe((f) => {
      subscription.unsubscribe();
      flo = f;
    });
    // FF needs flo editor to have size otherwise `TypeError: a.getScreenCTM(...) is null`
    const floViewElemnt = $('#flow-view');
    floViewElemnt.css({
      'height': '800px'
    });
    fixture.detectChanges();
  });

  function dropOnCanvas(metadata: Flo.ElementMetadata, location?: dia.Point): void {
    const node = flo.createNode(metadata, null, location);
    component.setDragDescriptor({
      sourceComponent: Constants.PALETTE_CONTEXT,
      source: {
        view: flo.getPaper().findViewByModel(node)
      }
    });
    component.handleNodeDropping();
  }

  it('DnD on empty canvas', () => {
    dropOnCanvas(metamodel.get('source').get('http'));
    expect(flo.getGraph().getElements().length).toEqual(1);
    expect(flo.getGraph().getElements()[0].attr('metadata/name')).toEqual('http');
  });

  it('Auto-Link: OFF. Drop processor with available source port', () => {
    flo.createNode(metamodel.get('source').get('http'));
    expect(flo.getGraph().getElements().length).toEqual(1);
    dropOnCanvas(metamodel.get('processor').get('filter'));
    expect(flo.getGraph().getElements().length).toEqual(2);
    expect(flo.getGraph().getLinks().length).toEqual(0);
  });

  it('Auto-Link: ON. Drop processor with available source port', () => {
    flo.autolink = true;
    flo.createNode(metamodel.get('source').get('http'));
    expect(flo.getGraph().getElements().length).toEqual(1);
    dropOnCanvas(metamodel.get('processor').get('filter'));
    expect(flo.getGraph().getElements().length).toEqual(2);
    expect(flo.getGraph().getLinks().length).toEqual(1);
  });

  it('Auto-Link: ON. Drop processor with sink on canvas', () => {
    flo.autolink = true;
    const sinkNode = flo.createNode(metamodel.get('sink').get('null'));
    expect(flo.getGraph().getElements().length).toEqual(1);
    dropOnCanvas(metamodel.get('processor').get('filter'));
    expect(flo.getGraph().getElements().length).toEqual(2);
    expect(flo.getGraph().getLinks().length).toEqual(1);
    const l = flo.getGraph().getLinks()[0];
    expect(l.get('target').id).toEqual(sinkNode.id);
    expect(l.get('target').port).toEqual('input');
  });

  it('Auto-Link: ON. Drop processor but no available ports', () => {
    flo.autolink = true;
    const httpNode = flo.createNode(metamodel.get('source').get('http'));
    const nullNode = flo.createNode(metamodel.get('sink').get('null'));
    flo.createLink({
      id: httpNode.id,
      selector: '.output-port',
      port: 'output'
    }, {
      id: nullNode.id,
      selector: '.input-port',
      port: 'input'
    }, null, null);
    expect(flo.getGraph().getElements().length).toEqual(2);
    expect(flo.getGraph().getLinks().length).toEqual(1);
    dropOnCanvas(metamodel.get('processor').get('filter'));
    expect(flo.getGraph().getElements().length).toEqual(3);
    expect(flo.getGraph().getLinks().length).toEqual(1);
  });

  it('Auto-Link: ON. Drop processor available port has tap-link', () => {
    flo.autolink = true;
    const httpNode = flo.createNode(metamodel.get('source').get('http'));
    const nullNode = flo.createNode(metamodel.get('sink').get('null'));
    flo.createLink({
      id: httpNode.id,
      selector: '.output-port',
      port: 'output'
    }, {
      id: nullNode.id,
      selector: '.input-port',
      port: 'input'
    }, null, new Map<string, any>().set('isTapLink', true));
    expect(flo.getGraph().getElements().length).toEqual(2);
    expect(flo.getGraph().getLinks().length).toEqual(1);
    expect(flo.getGraph().getLinks().filter(l => l.attr('props/isTapLink')).length).toEqual(1);
    dropOnCanvas(metamodel.get('processor').get('filter'));
    expect(flo.getGraph().getElements().length).toEqual(3);
    expect(flo.getGraph().getLinks().length).toEqual(2);
    expect(flo.getGraph().getLinks().filter(l => !l.attr('props/isTapLink')).length).toEqual(1);
  });

  it('Auto-Link: ON. More than one port available', () => {
    flo.autolink = true;
    flo.createNode(metamodel.get('source').get('http'));
    flo.createNode(metamodel.get('processor').get('filter'));
    expect(flo.getGraph().getElements().length).toEqual(2);
    expect(flo.getGraph().getLinks().length).toEqual(0);
    dropOnCanvas(metamodel.get('processor').get('filter'));
    expect(flo.getGraph().getElements().length).toEqual(3);
    expect(flo.getGraph().getLinks().length).toEqual(0);
  });

});
