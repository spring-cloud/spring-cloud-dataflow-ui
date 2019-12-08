import { MockSharedAppService } from '../../../tests/mocks/shared-app';
import { Constants, EditorComponent, Flo, FloModule } from 'spring-flo';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MetamodelService } from './metamodel.service';
import { RenderService } from './render.service';
import { EditorService } from './editor.service';
import { dia } from 'jointjs';
import * as _joint from 'jointjs';
import { MockToolsService } from '../../../tests/mocks/mock-tools';
import { LoggerService } from '../../../shared/services/logger.service';
import * as _$ from 'jquery';
import { ApplicationRef, ComponentFactoryResolver } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { TasksModule } from '../../tasks.module';

const $: any = _$;
const joint: any = _joint;


describe('Task RenderService', () => {

  const loggerService = new LoggerService();
  const METAMODEL_SERVICE = new MetamodelService(new MockSharedAppService(), loggerService, new MockToolsService());

  let METAMODEL: Map<string, Map<string, Flo.ElementMetadata>>;
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let flo: Flo.EditorContext;

  let applicationRef: ApplicationRef;
  let resolver: ComponentFactoryResolver;
  let bsModalService: BsModalService;

  beforeEach(async(() => {
    METAMODEL_SERVICE.load().then(metamodel => METAMODEL = metamodel);
    TestBed.configureTestingModule({
      imports: [
        TasksModule
      ]
    })
      .compileComponents();
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
    component.metamodel = METAMODEL_SERVICE;
    component.renderer = new RenderService(METAMODEL_SERVICE, bsModalService, resolver, fixture.debugElement.injector, applicationRef);
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

  function dropNodeFromPaletteOnCanvas(metadata: Flo.ElementMetadata, location?: dia.Point): dia.Element {
    const node = flo.createNode(metadata, null, location);
    component.setDragDescriptor({
      sourceComponent: Constants.PALETTE_CONTEXT,
      source: {
        view: flo.getPaper().findViewByModel(node)
      }
    });
    component.handleNodeDropping();
    return node;
  }

  function dropNodeFromPaletteOnCanvasLink(metadata: Flo.ElementMetadata, target: dia.Link): dia.Element {
    const node = flo.createNode(metadata, null);
    component.setDragDescriptor({
      sourceComponent: Constants.PALETTE_CONTEXT,
      source: {
        view: flo.getPaper().findViewByModel(node)
      },
      target: {
        view: flo.getPaper().findViewByModel(target),
      }
    });
    component.handleNodeDropping();
    return node;
  }

  function createLink(from: dia.Element, to: dia.Element): dia.Link {
    return flo.createLink({
      'id': from.id, 'port': 'output', 'selector': '.output-port'
    }, {
      'id': to.id, 'port': 'input', 'selector': '.input-port'
    });
  }


  it('default content', () => {
    component.editor.setDefaultContent(flo, METAMODEL);
    const nodes = flo.getGraph().getElements();
    expect(nodes.length).toBe(2);
    expect(nodes[0].attr('metadata/name')).toBe('START');
    expect(nodes[1].attr('metadata/name')).toBe('END');
    expect(flo.getGraph().getLinks().length).toBe(0);
  });

  it('simple dnd', () => {
    const taskA = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('a'), { x: 100, y: 200 });
    expect(taskA.attr('metadata/name')).toBe('a');
    expect(taskA.get('position').x).toBe(100);
    expect(taskA.get('position').y).toBe(200);
    expect(flo.getPaper().findViewByModel(taskA)).toBeDefined();
  });

  it('drop node from the palette on link', () => {
    const taskA = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('a'), { x: 100, y: 20 });
    const taskB = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('b'), { x: 100, y: 200 });
    const link = createLink(taskA, taskB);
    const taskC = dropNodeFromPaletteOnCanvasLink(METAMODEL.get('task').get('c'), link);
    const links = flo.getGraph().getLinks();
    expect(flo.getGraph().getElements().length).toBe(3);
    expect(links.length).toBe(2);

    const link1 = links[0];
    const link2 = links[1];

    expect(link1.get('source').id).toBe(taskA.id);
    expect(link1.get('target').id).toBe(taskC.id);
    expect(link2.get('source').id).toBe(taskC.id);
    expect(link2.get('target').id).toBe(taskB.id);
  });

  it('drag descriptor - drop on output port', () => {
    const taskA = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('a'), { x: 100, y: 20 });
    const taskB = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('b'), { x: 100, y: 200 });
    const rectA = taskA.getBBox();
    const dropPt = joint.g.point(rectA.x + rectA.width / 2, rectA.y + rectA.height);
    const dragDescriptor = component.editor.calculateDragDescriptor(flo, flo.getPaper().findViewByModel(taskB),
      flo.getPaper().findViewByModel(taskA), dropPt, Constants.CANVAS_CONTEXT);
    expect(dragDescriptor.sourceComponent).toBe(Constants.CANVAS_CONTEXT);
    expect(dragDescriptor.source.view).toBe(flo.getPaper().findViewByModel(taskB));
    expect(dragDescriptor.source.cssClassSelector).toBe('.input-port');
    expect(dragDescriptor.target.view).toBe(flo.getPaper().findViewByModel(taskA));
    expect(dragDescriptor.target.cssClassSelector).toBe('.output-port');
  });

  it('drag descriptor - drop on input port', () => {
    const taskA = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('a'), { x: 100, y: 20 });
    const taskB = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('b'), { x: 100, y: 200 });
    const rectA = taskA.getBBox();
    const dropPt = joint.g.point(rectA.x + rectA.width / 2, rectA.y);
    const dragDescriptor = component.editor.calculateDragDescriptor(flo,
      flo.getPaper().findViewByModel(taskB),
      flo.getPaper().findViewByModel(taskA),
      dropPt,
      Constants.CANVAS_CONTEXT);
    expect(dragDescriptor.sourceComponent).toBe(Constants.CANVAS_CONTEXT);
    expect(dragDescriptor.source.view).toBe(flo.getPaper().findViewByModel(taskB));
    expect(dragDescriptor.source.cssClassSelector).toBe('.output-port');
    expect(dragDescriptor.target.view).toBe(flo.getPaper().findViewByModel(taskA));
    expect(dragDescriptor.target.cssClassSelector).toBe('.input-port');
  });

  it('drag descriptor - drop connected node on port', () => {
    const taskA = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('a'), { x: 100, y: 20 });
    const taskB = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('b'), { x: 100, y: 200 });
    const taskC = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('b'), { x: 300, y: 20 });
    const link = createLink(taskB, taskC);
    const rectA = taskA.getBBox();
    const dropPt = joint.g.point(rectA.x + rectA.width / 2, rectA.y);
    const dragDescriptor = component.editor.calculateDragDescriptor(flo,
      flo.getPaper().findViewByModel(taskB),
      flo.getPaper().findViewByModel(taskA),
      dropPt,
      Constants.CANVAS_CONTEXT);
    expect(dragDescriptor.sourceComponent).toBe(Constants.CANVAS_CONTEXT);
    expect(dragDescriptor.source.view).toBe(flo.getPaper().findViewByModel(taskB));
    expect(dragDescriptor.source.cssClassSelector).toBeUndefined();
    expect(dragDescriptor.target).toBeUndefined();
  });

  it('pre-delete', () => {
    const taskA = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('a'), { x: 100, y: 20 });
    const taskB = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('b'), { x: 100, y: 200 });
    const taskC = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('b'), { x: 300, y: 20 });
    createLink(taskB, taskC);
    createLink(taskC, taskA);

    expect(flo.getGraph().getElements().length).toBe(3);
    expect(flo.getGraph().getLinks().length).toBe(2);

    flo.selection = flo.getPaper().findViewByModel(taskC);

    flo.deleteSelectedNode();

    expect(flo.getGraph().getLinks().length).toBe(0);
    const nodes = flo.getGraph().getElements();
    expect(nodes.length).toBe(2);
    expect(nodes[0]).toBe(taskA);
    expect(nodes[1]).toBe(taskB);
  });

  it('drop node on node input port', () => {
    const taskA = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('a'), { x: 100, y: 20 });
    const taskB = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('b'), { x: 100, y: 200 });
    const dragDescriptor = {
      sourceComponent: Constants.CANVAS_CONTEXT,
      source: {
        view: flo.getPaper().findViewByModel(taskA),
        cssClassSelector: '.output-port'
      },
      target: {
        view: flo.getPaper().findViewByModel(taskB),
        cssClassSelector: '.input-port'
      }
    };
    expect(flo.getGraph().getElements().length).toBe(2);
    expect(flo.getGraph().getLinks().length).toBe(0);

    component.editor.handleNodeDropping(flo, dragDescriptor);

    expect(flo.getGraph().getElements().length).toBe(2);
    expect(flo.getGraph().getLinks().length).toBe(1);
    const link = flo.getGraph().getLinks()[0];
    expect(link.get('source').id).toBe(taskA.id);
    expect(link.get('source').selector).toBe('.output-port');
    expect(link.get('target').id).toBe(taskB.id);
    expect(link.get('target').selector).toBe('.input-port');
  });

  it('drop node on node output port', () => {
    const taskA = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('a'), { x: 100, y: 20 });
    const taskB = dropNodeFromPaletteOnCanvas(METAMODEL.get('task').get('b'), { x: 100, y: 200 });
    const dragDescriptor = {
      sourceComponent: Constants.CANVAS_CONTEXT,
      source: {
        view: flo.getPaper().findViewByModel(taskA),
        cssClassSelector: '.input-port'
      },
      target: {
        view: flo.getPaper().findViewByModel(taskB),
        cssClassSelector: '.output-port'
      }
    };
    expect(flo.getGraph().getElements().length).toBe(2);
    expect(flo.getGraph().getLinks().length).toBe(0);

    component.editor.handleNodeDropping(flo, dragDescriptor);

    expect(flo.getGraph().getElements().length).toBe(2);
    expect(flo.getGraph().getLinks().length).toBe(1);
    const link = flo.getGraph().getLinks()[0];
    expect(link.get('source').id).toBe(taskB.id);
    expect(link.get('source').selector).toBe('.output-port');
    expect(link.get('target').id).toBe(taskA.id);
    expect(link.get('target').selector).toBe('.input-port');
  });

});
