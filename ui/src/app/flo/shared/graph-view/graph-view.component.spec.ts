import { inject, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ApplicationRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GraphViewComponent } from './graph-view.component';
import { FloModule } from 'spring-flo';
import { ComponentFactoryResolver } from '@angular/core';
import { StreamsModule } from '../../../streams/streams.module';
import { SharedModule } from '../../../shared/shared.module';
import { MetamodelService } from '../../stream/metamodel.service';
import { MockSharedAppService } from '../../../tests/service/app.service.mock';
import { RenderService } from '../../stream/render.service';
import { NodeHelper } from '../../stream/node-helper.service';
import { PropertiesEditor } from '../../stream/properties-editor.service';

/**
 * Test {@link GraphViewComponent}.
 *
 * @author Alex Boyko
 */
describe('StreamGraphViewComponent', () => {
  let component: GraphViewComponent;
  let fixture: ComponentFixture<GraphViewComponent>;
  let applicationRef: ApplicationRef;
  let resolver: ComponentFactoryResolver;
  let propertiesEditor: PropertiesEditor;
  let nodeHelper: NodeHelper;

  beforeEach(waitForAsync(() =>
    TestBed.configureTestingModule({
      imports: [
        FloModule,
        SharedModule,
        StreamsModule,
        RouterTestingModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ]
    })
      .compileComponents()
  ));

  beforeEach(
    inject(
      [
        ApplicationRef,
        ComponentFactoryResolver,
        NodeHelper,
        PropertiesEditor
      ],
      (
        _applicationRef: ApplicationRef,
        _resolver: ComponentFactoryResolver,
        _nodeHelper: NodeHelper,
        _propertiesEditor: PropertiesEditor
      ) => {
        applicationRef = _applicationRef;
        resolver = _resolver;
        nodeHelper = _nodeHelper;
        propertiesEditor = _propertiesEditor;
      }
    )
  );

  beforeEach(() => {
    TestBed.compileComponents();
    fixture = TestBed.createComponent(GraphViewComponent);
    component = fixture.componentInstance;
    const metamodel = new MetamodelService(new MockSharedAppService());
    component.metamodel = metamodel;
    component.renderer = new RenderService(metamodel, nodeHelper, propertiesEditor, resolver,
      fixture.debugElement.injector, applicationRef);
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
