/*
 * Copyright 2016-2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Test Stream render service.
 *
 * @author Alex Boyko
 */
import { MetamodelService } from './metamodel.service';
import { RenderService } from './render.service';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { EditorComponent, Flo } from 'spring-flo';
import * as _$ from 'jquery';
import { ApplicationRef, ComponentFactoryResolver } from '@angular/core';
import { MockSharedAppService } from '../../tests/service/app.service.mock';
import { StreamFloModule } from '../stream-flo.module';
import { StoreModule } from '@ngrx/store';
import { NodeHelper } from './node-helper.service';

const $: any = _$;


describe('Stream RenderService', () => {

  const METAMODEL_SERVICE = new MetamodelService(new MockSharedAppService());

  let applicationRef: ApplicationRef;
  let resolver: ComponentFactoryResolver;

  let METAMODEL: Map<string, Map<string, Flo.ElementMetadata>>;
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let flo: Flo.EditorContext;

  beforeEach(waitForAsync(() => {
    METAMODEL_SERVICE.load().then(metamodel => METAMODEL = metamodel);
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StreamFloModule
      ],
      providers: [
        {provide: MetamodelService, useValue: METAMODEL_SERVICE},
      ]
    });
  }));

  beforeEach(
    inject(
      [
        ApplicationRef,
        ComponentFactoryResolver
      ],
      (
        _applicationRef: ApplicationRef,
        _resolver: ComponentFactoryResolver
      ) => {
        applicationRef = _applicationRef;
        resolver = _resolver;
      }
    )
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    component.metamodel = METAMODEL_SERVICE;
    component.renderer = new RenderService(METAMODEL_SERVICE, new NodeHelper(), null, resolver,
      fixture.debugElement.injector, applicationRef);
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
    expect(Array.from(METAMODEL.keys())).toEqual(['other', 'app', 'source', 'processor', 'sink']);
  });

  it('Verify stream name label truncation', () => {
    const node = flo.createNode(METAMODEL.get('source').get('http'));
    expect(node.attr('.name-label/text')).toEqual('http');
    node.attr('stream-name', 'SUPER-LOOOOOOOOOONG-STREAM-NAAAAMEEEEE');
    expect(node.attr('.stream-label/text').endsWith('\u2026')).toBeTruthy();
    expect(node.attr('.stream-label/text').length < 'SUPER-LOOOOOOOOOONG-STREAM-NAAAAMEEEEE'.length).toBeTruthy();
  });

});
