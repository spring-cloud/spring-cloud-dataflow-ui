/**
 * Test Task render service.
 *
 * @author Alex Boyko
 */
import {MetamodelService} from './metamodel.service';
import {RenderService} from './render.service';
import {ComponentFixture, inject, TestBed, waitForAsync} from '@angular/core/testing';
import {EditorComponent, Flo} from 'spring-flo';
import * as _$ from 'jquery';
import {CONTROL_GROUP_TYPE, END_NODE_TYPE, START_NODE_TYPE, SYNC_NODE_TYPE, TASK_GROUP_TYPE} from './support/shapes';
import {ApplicationRef, ComponentFactoryResolver} from '@angular/core';
import {LoggerService} from '../../shared/service/logger.service';
import {MockSharedAppService} from '../../tests/service/app.service.mock';
import {ToolsServiceMock} from '../../tests/service/task-tools.service.mock';
import {TaskFloModule} from '../task-flo.module';
import {StoreModule} from '@ngrx/store';

const $: any = _$;

describe('Task RenderService', () => {
  const loggerService = new LoggerService();
  const METAMODEL_SERVICE = new MetamodelService(new MockSharedAppService(), loggerService, new ToolsServiceMock());

  let applicationRef: ApplicationRef;
  let resolver: ComponentFactoryResolver;

  let METAMODEL: Map<string, Map<string, Flo.ElementMetadata>>;
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let flo: Flo.EditorContext;

  beforeEach(waitForAsync(() => {
    METAMODEL_SERVICE.load().then(metamodel => (METAMODEL = metamodel));
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), TaskFloModule],
      providers: [{provide: MetamodelService, useValue: METAMODEL_SERVICE}]
    });
  }));

  beforeEach(inject(
    [ApplicationRef, ComponentFactoryResolver],
    (_applicationRef: ApplicationRef, _resolver: ComponentFactoryResolver) => {
      applicationRef = _applicationRef;
      resolver = _resolver;
    }
  ));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    component.metamodel = METAMODEL_SERVICE;
    component.renderer = new RenderService(
      METAMODEL_SERVICE,
      null,
      resolver,
      fixture.debugElement.injector,
      applicationRef
    );
    const subscription = component.floApi.subscribe(f => {
      subscription.unsubscribe();
      flo = f;
    });
    const floViewElemnt = $('#flow-view');
    floViewElemnt.css({
      height: '800px'
    });
    fixture.detectChanges();
  });

  it('Verify initialization', () => {
    expect(Array.from(METAMODEL.keys())).toEqual(['links', 'control nodes', 'task']);
    const links = METAMODEL.get('links');
    const controlNodes = METAMODEL.get(CONTROL_GROUP_TYPE);
    const tasks = METAMODEL.get(TASK_GROUP_TYPE);
    expect(Array.from(tasks.keys())).toEqual(['a', 'b', 'c', 'd', 'super-very-very-very-looooooooong-task-name']);
    expect(Array.from(controlNodes.keys())).toEqual(['START', 'END', 'SYNC']);
    expect(Array.from(links.keys())).toEqual(['transition']);
  });

  it('Create Task Node', () => {
    const taskA = flo.createNode(METAMODEL.get(TASK_GROUP_TYPE).get('a'));
    expect(taskA.attr('.name-label/text')).toBe(METAMODEL.get(TASK_GROUP_TYPE).get('a').name);
    expect(taskA.attr('.output-port')).toBeDefined();
    expect(taskA.attr('.input-port')).toBeDefined();
    expect(taskA.attr('.box')).toBeDefined();
    expect(taskA.attr('.inner')).toBeUndefined();
    expect(taskA.attr('.outer')).toBeUndefined();
  });

  it('Create Start Node', () => {
    const taskA = flo.createNode(METAMODEL.get(CONTROL_GROUP_TYPE).get(START_NODE_TYPE));
    expect(taskA.attr('.name-label/text')).toBe('START');
    expect(taskA.attr('.output-port')).toBeUndefined();
    expect(taskA.attr('.input-port')).toBeUndefined();
    expect(taskA.attr('.box')).toBeUndefined();
    expect(taskA.attr('.start-inner')).toBeDefined();
    expect(taskA.attr('.start-outer')).toBeDefined();
  });

  it('Create End Node', () => {
    const taskA = flo.createNode(METAMODEL.get(CONTROL_GROUP_TYPE).get(END_NODE_TYPE));
    expect(taskA.attr('.name-label/text')).toBe('END');
    expect(taskA.attr('.output-port')).toBeUndefined();
    expect(taskA.attr('.input-port')).toBeUndefined();
    expect(taskA.attr('.end-inner')).toBeDefined();
    expect(taskA.attr('.end-outer')).toBeDefined();
    expect(taskA.attr('.box')).toBeUndefined();
  });

  it('Create Sync Node', () => {
    const taskA = flo.createNode(METAMODEL.get(CONTROL_GROUP_TYPE).get(SYNC_NODE_TYPE));
    expect(taskA.attr('.name-label/text')).toBe('SYNC');
    expect(taskA.attr('.output-port')).toBeDefined();
    expect(taskA.attr('.input-port')).toBeDefined();
    expect(taskA.attr('.box')).toBeDefined();
  });

  it('fit label - label has ok size', () => {
    const node = flo.createNode(METAMODEL.get(TASK_GROUP_TYPE).get('a'));
    expect(node.attr('.name-label/text')).toBe('a');
  });

  it('fit label - label is truncated', () => {
    const node = flo.createNode(METAMODEL.get(TASK_GROUP_TYPE).get('super-very-very-very-looooooooong-task-name'));
    expect(node.attr('.name-label/text').endsWith('\u2026')).toBeTruthy();
    expect(node.attr('.name-label/text').length < 'super-very-very-very-looooooooong-task-name'.length).toBeTruthy();
  });
});
