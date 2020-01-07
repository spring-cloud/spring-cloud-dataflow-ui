import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationRef } from '@angular/core';
import { GraphViewComponent } from './graph-view.component';
import { FloModule } from 'spring-flo';
import { RenderService } from '../../../streams/components/flo/render.service';
import { MockSharedAppService } from '../../../tests/mocks/shared-app';
import { MetamodelService } from '../../../streams/components/flo/metamodel.service';
import { ComponentFactoryResolver } from '@angular/core';
import { BsModalService, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { SharedModule } from '../../shared.module';
import { StreamsModule } from '../../../streams/streams.module';

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
  let bsModalService: BsModalService;

  beforeEach(async(() =>
    TestBed.configureTestingModule({
      imports: [
        FloModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        SharedModule,
        StreamsModule
      ]
    })
      .compileComponents()
  ));

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
    TestBed.compileComponents();
    fixture = TestBed.createComponent(GraphViewComponent);
    component = fixture.componentInstance;
    const metamodel = new MetamodelService(new MockSharedAppService());
    component.metamodel = metamodel;
    component.renderer = new RenderService(metamodel, bsModalService, resolver, fixture.debugElement.injector, applicationRef);
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
