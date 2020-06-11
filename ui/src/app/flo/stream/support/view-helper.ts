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

import {
  ComponentFactoryResolver,
  Injector,
  ApplicationRef,
  Type,
  ComponentRef
} from '@angular/core';
import * as _joint from 'jointjs';
import { ElementComponent, ShapeComponent } from '../../shared/support/shape-component';

const joint: any = _joint;

/**
 * Render Helper for Flo based Stream Definition graph editor.
 * Static utility method for creating joint views and manipulating them.
 *
 * @author Alex Boyko
 */
export class ViewHelper {

  static createLinkView(injector: Injector,
                        applicationRef: ApplicationRef,
                        componentFactoryResolver: ComponentFactoryResolver,
                        labelComponentRegistry: Map<string, Type<ShapeComponent>>) {

    const V = joint.V;

    return joint.shapes.flo.LinkView.extend({
      renderLabels() {
        const cache = this._V;
        let vLabels = cache.labels;
        const labelCache = this._labelCache = {};
        const labelSelectors = this._labelSelectors = {};

        if (vLabels) {
          vLabels.empty();
        }

        if (this._angularComponentRef) {
          Object.keys(this._angularComponentRef).forEach(k => this._angularComponentRef[k].destroy());
          this._angularComponentRef = {};
        }

        const model = this.model;
        const labels = model.get('labels') || [];
        const labelsCount = labels.length;
        if (labelsCount === 0) {
          return this;
        }

        if (!vLabels) {
          // there is no label container in the markup but some labels are defined
          // add a <g class="labels" /> container
          vLabels = cache.labels = V('g').addClass('labels').appendTo(this.el);
        }

        for (let i = 0; i < labelsCount; i++) {

          const label = labels[i];

          let node;
          let selectors;

          if (componentFactoryResolver && labelComponentRegistry.has(label.type)) {
            // Inject link label component and take its DOM
            if (this._angularComponentRef && this._angularComponentRef[i]) {
              this._angularComponentRef[i].destroy();
            }

            const nodeComponentFactory = componentFactoryResolver
              .resolveComponentFactory(labelComponentRegistry.get(label.type));

            const componentRef: ComponentRef<ShapeComponent> = nodeComponentFactory.create(injector);

            if (!this._angularComponentRef) {
              this._angularComponentRef = {};
            }

            this._angularComponentRef[i] = componentRef;
            this._angularComponentRef[i].changeDetectorRef.markForCheck();

            applicationRef.attachView(componentRef.hostView);
            componentRef.instance.data = label;
            this._angularComponentRef[i].changeDetectorRef.detectChanges();

            node = this._angularComponentRef[i].location.nativeElement.children.item(0);
            selectors = {};
          } else {
            // Default JointJS behaviour
            const labelMarkup = this._normalizeLabelMarkup(this._getLabelMarkup(label.markup));
            if (labelMarkup) {
              node = labelMarkup.node;
              selectors = labelMarkup.selectors;

            } else {
              const builtinDefaultLabel = model._builtins.defaultLabel;
              const builtinDefaultLabelMarkup = this._normalizeLabelMarkup(this._getLabelMarkup(builtinDefaultLabel.markup));

              const defaultLabel = model._getDefaultLabel();
              const defaultLabelMarkup = this._normalizeLabelMarkup(this._getLabelMarkup(defaultLabel.markup));

              const defaultMarkup = defaultLabelMarkup || builtinDefaultLabelMarkup;

              node = defaultMarkup.node;
              selectors = defaultMarkup.selectors;
            }
          }


          const vLabel = V(node);
          vLabel.attr('label-idx', i); // assign label-idx
          vLabel.appendTo(vLabels);
          labelCache[i] = vLabel; // cache node for `updateLabels()` so it can just update label node positions

          selectors[this.selector] = vLabel.node;
          labelSelectors[i] = selectors; // cache label selectors for `updateLabels()`
        }

        this.updateLabels();

        return this;

      }
    });
  }

  static createNodeView(injector: Injector,
                        applicationRef: ApplicationRef,
                        componentFactoryResolver: ComponentFactoryResolver,
                        componentRegistry: Map<string, Type<ElementComponent>>) {
    return joint.shapes.flo.ElementView.extend({
      options: joint.util.deepSupplement({}, joint.dia.ElementView.prototype.options),

      renderMarkup() {
        // Not called often. It's fine to destroy old component and create the new one, because old DOM
        // may have been altered by JointJS updates
        if (componentFactoryResolver && componentRegistry.has(this.model.get('type'))) {

          if (this._angularComponentRef) {
            this._angularComponentRef.destroy();
          }

          const nodeComponentFactory = componentFactoryResolver
            .resolveComponentFactory(componentRegistry.get(this.model.get('type')));

          const componentRef: ComponentRef<ElementComponent> = nodeComponentFactory.create(injector);
          componentRef.instance.view = this;
          applicationRef.attachView(componentRef.hostView);
          this._angularComponentRef = componentRef;
          const nodes = [];
          for (let i = 0; i < this._angularComponentRef.location.nativeElement.children.length; i++) {
            nodes.push(this._angularComponentRef.location.nativeElement.children.item(i));
          }

          const vNodes = nodes.map(childNode => new joint.V(childNode));
          this.vel.append(vNodes);

          this._angularComponentRef.changeDetectorRef.markForCheck();
          this._angularComponentRef.changeDetectorRef.detectChanges();
        } else {
          joint.dia.ElementView.prototype.renderMarkup.apply(this, arguments);
        }
      },

      onRemove() {
        if (this._angularComponentRef) {
          this._angularComponentRef.destroy();
        }
        joint.dia.ElementView.prototype.onRemove.apply(this, arguments);
      },

    });
  }

}
