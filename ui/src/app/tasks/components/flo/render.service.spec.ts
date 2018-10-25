/**
 * Test Task render service.
 *
 * @author Alex Boyko
 */
import { MockSharedAppService } from '../../../tests/mocks/shared-app';
import { MetamodelService } from './metamodel.service';
import { RenderService } from './render.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorComponent, Flo, FloModule } from 'spring-flo';
import { MockToolsService } from '../../../tests/mocks/mock-tools';
import { LoggerService } from '../../../shared/services/logger.service';
import * as _$ from 'jquery';

const $: any = _$;


describe('Task RenderService', () => {

  const loggerService = new LoggerService();
  const METAMODEL_SERVICE = new MetamodelService(new MockSharedAppService(), loggerService, new MockToolsService());
  const RENDER_SERVICE = new RenderService(METAMODEL_SERVICE, null, null, null, null);

  let METAMODEL: Map<string, Map<string, Flo.ElementMetadata>>;
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let flo: Flo.EditorContext;

  beforeEach(async(() => {
    METAMODEL_SERVICE.load().then(metamodel => METAMODEL = metamodel);
    TestBed.configureTestingModule({
      imports: [
        FloModule
      ],
      providers: [
        {provide: MetamodelService, useValue: METAMODEL_SERVICE},
        {provide: RenderService, useValue: RENDER_SERVICE}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    component.metamodel = METAMODEL_SERVICE;
    component.renderer = RENDER_SERVICE;
    const subscription = component.floApi.subscribe((f) => {
      subscription.unsubscribe();
      flo = f;
    });
    const floViewElemnt = $('#flow-view');
    floViewElemnt.css({
      'height': '800px'
    });
    fixture.detectChanges();
  });

  it('Verify initialization', () => {
    expect(Array.from(METAMODEL.keys())).toEqual(['links', 'control nodes', 'task']);
    const links = METAMODEL.get('links');
    const controlNodes = METAMODEL.get('control nodes');
    const tasks = METAMODEL.get('task');
    expect(Array.from(tasks.keys())).toEqual(['a', 'b', 'c', 'd', 'super-very-long-task-name']);
    expect(Array.from(controlNodes.keys())).toEqual(['START', 'END', 'SYNC']);
    expect(Array.from(links.keys())).toEqual(['transition']);
  });

  it('Create Task Node', () => {
    const taskA = RENDER_SERVICE.createNode(METAMODEL.get('task').get('a'));
    expect(taskA.attr('.label/text')).toBe(METAMODEL.get('task').get('a').name);
    expect(taskA.attr('.output-port')).toBeDefined();
    expect(taskA.attr('.input-port')).toBeDefined();
    expect(taskA.attr('.border')).toBeDefined();
    expect(taskA.attr('.inner')).toBeUndefined();
    expect(taskA.attr('.outer')).toBeUndefined();
  });

  it('Create Start Node', () => {
    const taskA = RENDER_SERVICE.createNode(METAMODEL.get('control nodes').get('START'));
    expect(taskA.attr('.label/text')).toBe('START');
    expect(taskA.attr('.output-port')).toBeDefined();
    expect(taskA.attr('.input-port')).toBeUndefined();
    expect(taskA.attr('.border')).toBeDefined();
    expect(taskA.attr('.inner')).toBeUndefined();
    expect(taskA.attr('.outer')).toBeUndefined();
  });

  it('Create End Node', () => {
    const taskA = RENDER_SERVICE.createNode(METAMODEL.get('control nodes').get('END'));
    expect(taskA.attr('.label/text')).toBe('END');
    expect(taskA.attr('.output-port')).toBeUndefined();
    expect(taskA.attr('.input-port')).toBeDefined();
    expect(taskA.attr('.inner')).toBeDefined();
    expect(taskA.attr('.outer')).toBeDefined();
    expect(taskA.attr('.border')).toBeUndefined();
  });

  it('Create Sync Node', () => {
    const taskA = RENDER_SERVICE.createNode(METAMODEL.get('control nodes').get('SYNC'));
    expect(taskA.attr('.label/text')).toBe('SYNC');
    expect(taskA.attr('.output-port')).toBeDefined();
    expect(taskA.attr('.input-port')).toBeDefined();
    expect(taskA.attr('.inner')).toBeUndefined();
    expect(taskA.attr('.outer')).toBeUndefined();
    expect(taskA.attr('.border')).toBeDefined();
  });

  it('fit label - label has ok size', () => {
    const node = flo.createNode(METAMODEL.get('task').get('a'));
    expect(node.attr('.label/text')).toBe('a');
  });

  it('fit label - label is truncated', () => {
    const node = flo.createNode(METAMODEL.get('task').get('super-very-long-task-name'));
    expect(node.attr('.label/text').endsWith('\u2026')).toBeTruthy();
    expect(node.attr('.label/text').length < 'super-very-long-task-name'.length).toBeTruthy();
  });

});
