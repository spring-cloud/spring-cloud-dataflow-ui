/*
 * Copyright 2016-2017 the original author or authors.
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
import { IMAGE_W, HORIZONTAL_PADDING } from './shapes';
import { NodeComponent } from '../node/node.component';
import { DecorationComponent } from '../../../../shared/flo/decoration/decoration.component';
import { HandleComponent } from '../../../../shared/flo/handle/handle.component';
import { BaseShapeComponent, ElementComponent } from '../../../../shared/flo/support/shape-component';
import { TYPE_INSTANCE_DOT, TYPE_INCOMING_MESSAGE_RATE, TYPE_OUTGOING_MESSAGE_RATE } from './shapes';
import { InstanceDotComponent } from '../instance-dot/instance-dot.component';
import { MessageRateComponent } from '../message-rate/message-rate.component';
import { dia } from 'jointjs';
import * as _joint from 'jointjs';

const joint: any = _joint;

const ELEMENT_TYPE_COMPONENT_TYPE = new Map<string, Type<ElementComponent>>()
  .set(joint.shapes.flo.NODE_TYPE, NodeComponent)
  .set(joint.shapes.flo.DECORATION_TYPE, DecorationComponent)
  .set(joint.shapes.flo.HANDLE_TYPE, HandleComponent)
  .set(TYPE_INSTANCE_DOT, InstanceDotComponent);

const LINK_LABEL_COMPONENT_TYPE = new Map<string, Type<BaseShapeComponent>>()
  .set(TYPE_INCOMING_MESSAGE_RATE, MessageRateComponent)
  .set(TYPE_OUTGOING_MESSAGE_RATE, MessageRateComponent);

/**
 * Render Helper for Flo based Stream Definition graph editor.
 * Static utility method for creating joint views and manipulating them.
 *
 * @author Alex Boyko
 */
export class ViewHelper {

  static createLinkView(injector: Injector,
                        applicationRef: ApplicationRef,
                        componentFactoryResolver: ComponentFactoryResolver) {

    const V = joint.V;

    return joint.shapes.flo.LinkView.extend({
      options: {
        shortLinkLength: 0,
        doubleLinkTools: false,
        longLinkLength: 160,
        linkToolsOffset: 30,
        doubleLinkToolsOffset: 60,
        sampleInterval: 50
      },
      renderLabels: function () {

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

          if (componentFactoryResolver && LINK_LABEL_COMPONENT_TYPE.has(label.type)) {
            // Inject link label component and take its DOM
            if (this._angularComponentRef && this._angularComponentRef[i]) {
              this._angularComponentRef[i].destroy();
            }

            const nodeComponentFactory = componentFactoryResolver
              .resolveComponentFactory(LINK_LABEL_COMPONENT_TYPE.get(label.type));

            const componentRef: ComponentRef<BaseShapeComponent> = nodeComponentFactory.create(injector);

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
              const builtinDefaultLabel =  model._builtins.defaultLabel;
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
                        componentFactoryResolver: ComponentFactoryResolver) {
    return joint.shapes.flo.ElementView.extend({
      options: joint.util.deepSupplement({}, joint.dia.ElementView.prototype.options),

      renderMarkup: function () {
        // Not called often. It's fine to destro old component and create the new one, because old DOM
        // may have been aletered by JointJS updates
        if (componentFactoryResolver && ELEMENT_TYPE_COMPONENT_TYPE.has(this.model.get('type'))) {

          if (this._angularComponentRef) {
            this._angularComponentRef.destroy();
          }

          const nodeComponentFactory = componentFactoryResolver
            .resolveComponentFactory(ELEMENT_TYPE_COMPONENT_TYPE.get(this.model.get('type')));

          const componentRef: ComponentRef<ElementComponent> = nodeComponentFactory.create(injector);
          applicationRef.attachView(componentRef.hostView);
          componentRef.instance.view = this;
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

      onRemove: function () {
        if (this._angularComponentRef) {
          this._angularComponentRef.destroy();
        }
        joint.dia.ElementView.prototype.onRemove.apply(this, arguments);
      },

    });
  }

  static fitLabel(paper: dia.Paper, node: dia.Element, labelPath: string): void {
    const label: string = node.attr(labelPath);
    const view = paper.findViewByModel(node);
    if (view && label) {
      const textView = view.findBySelector(labelPath.substr(0, labelPath.indexOf('/')))[0];
      let offset = 0;
      if (node.attr('.label2/text')) {
        const label2View = view.findBySelector('.label2')[0];
        if (label2View) {
          const box = joint.V(label2View).bbox(false, paper.viewport);
          offset = HORIZONTAL_PADDING + box.width;
        }
      }
      const threshold = IMAGE_W - HORIZONTAL_PADDING - HORIZONTAL_PADDING - offset;

      let width = joint.V(textView).bbox(false, paper.viewport).width;

      if (width > threshold) {
        const styles = getComputedStyle(textView);
        const stylesObj: {} = {};
        for (let i = 0; i < styles.length; i++) {
          const property = styles.item(i);
          if (!property.startsWith('-')) {
            stylesObj[property] = styles.getPropertyValue(property);
          }
        }

        const svgDocument = joint.V('svg').node;
        const textSpan = joint.V('tspan').node;
        const textElement = joint.V('text').attr(stylesObj).append(textSpan).node;
        const textNode = document.createTextNode(label);

        // Prevent flickering
        textElement.style.opacity = 0;
        // Prevent FF from throwing an uncaught exception when `getBBox()`
        // called on element that is not in the render tree (is not measurable).
        // <tspan>.getComputedTextLength() returns always 0 in this case.
        // Note that the `textElement` resp. `textSpan` can become hidden
        // when it's appended to the DOM and a `display: none` CSS stylesheet
        // rule gets applied.
        textElement.style.display = 'block';
        textSpan.style.display = 'block';

        textSpan.appendChild(textNode);
        svgDocument.appendChild(textElement);

        document.body.appendChild(svgDocument);

        try {
          width = textSpan.getComputedTextLength();
          for (let i = 1; i < width && width > threshold; i++) {
            textNode.data = label.substr(0, label.length - i) + '\u2026';
            width = textSpan.getComputedTextLength();
          }

          if (offset) {
            (<any>node).attr('.label1/ref-x', Math.max((offset + HORIZONTAL_PADDING + width / 2) / IMAGE_W, 0.5), {silent: true});
          }
          (<any>node).attr(labelPath, textNode.data);
        } finally {
          document.body.removeChild(svgDocument);
        }
      } else {
        (<any>node).attr('.label1/ref-x', Math.max((offset + HORIZONTAL_PADDING + width / 2) / IMAGE_W, 0.5));
      }
    }
  }

}
