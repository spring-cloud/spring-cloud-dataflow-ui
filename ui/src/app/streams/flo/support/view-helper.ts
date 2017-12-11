/*
 * Copyright 2016-2017 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
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
import {IMAGE_W, HORIZONTAL_PADDING} from './shapes';
import {NodeComponent} from '../node/node.component';
import {DecorationComponent} from '../../../shared/flo/decoration/decoration.component';
import {HandleComponent} from '../../../shared/flo/handle/handle.component';
import {BaseShapeComponent, ElementComponent} from '../../../shared/flo/support/shape-component';
import {TYPE_INSTANCE_DOT, TYPE_INCOMING_MESSAGE_RATE, TYPE_OUTGOING_MESSAGE_RATE} from './shapes';
import {InstanceDotComponent} from '../instance-dot/instance-dot.component';
import {MessageRateComponent} from '../message-rate/message-rate.component';
import {dia} from 'jointjs';
import * as _ from 'underscore';
import * as $ from 'jquery';
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

      renderLabels: function () {

        if (!this._V.labels) {
          return this;
        }

        if (this._angularComponentRef) {
          Object.keys(this._angularComponentRef).forEach(k => this._angularComponentRef[k].destroy());
          this._angularComponentRef = {};
        }

        this._labelCache = {};
        const $labels = $(this._V.labels.node).empty();

        const labels = this.model.get('labels') || [];
        if (!labels.length) {
          return this;
        }

        const labelTemplate = joint.util.template(this.model.get('labelMarkup') || this.model.labelMarkup);
        // This is a prepared instance of a vectorized SVGDOM node for the label element resulting from
        // compilation of the labelTemplate. The purpose is that all labels will just `clone()` this
        // node to create a duplicate.
        const labelNodeInstance = V(labelTemplate());

        const canLabelMove = this.can('labelMove');

        _.each(labels, function (label: any, idx) {

          let labelNode;

          if (componentFactoryResolver && LINK_LABEL_COMPONENT_TYPE.has(label.type)) {
            // Inject link label component and take its DOM
            if (this._angularComponentRef && this._angularComponentRef[idx]) {
              this._angularComponentRef[idx].destroy();
            }

            const nodeComponentFactory = componentFactoryResolver
              .resolveComponentFactory(LINK_LABEL_COMPONENT_TYPE.get(label.type));

            const componentRef: ComponentRef<BaseShapeComponent> = nodeComponentFactory.create(injector);

            if (!this._angularComponentRef) {
              this._angularComponentRef = {};
            }

            this._angularComponentRef[idx] = componentRef;
            this._angularComponentRef[idx].changeDetectorRef.markForCheck();

            applicationRef.attachView(componentRef.hostView);
            componentRef.instance.data = label;
            this._angularComponentRef[idx].changeDetectorRef.detectChanges();

            labelNode = this._angularComponentRef[idx].location.nativeElement.children.item(0);
          } else {
            // Default JointJS behaviour
            labelNode = labelNodeInstance.clone().node;
          }

          V(labelNode).attr('label-idx', idx);
          if (canLabelMove) {
            V(labelNode).attr('cursor', 'move');
          }

          // Cache label nodes so that the `updateLabels()` can just update the label node positions.
          this._labelCache[idx] = V(labelNode);

          const $text = $(labelNode).find('text');
          const $rect = $(labelNode).find('rect');

          // Text attributes with the default `text-anchor` and font-size set.
          const textAttributes = _.extend({
            'text-anchor': 'middle',
            'font-size': 14
          }, joint.util.getByPath(label, 'attrs/text', '/'));

          $text.attr(_.omit(textAttributes, 'text'));

          if (!_.isUndefined(textAttributes.text)) {

            V($text[0]).text(textAttributes.text + '', {annotations: textAttributes.annotations});

          }

          // Note that we first need to append the `<text>` element to the DOM in order to
          // get its bounding box.
          $labels.append(labelNode);

          // `y-alignment` - center the text element around its y coordinate.
          const textBbox = V($text[0]).bbox(true, $labels[0]);
          V($text[0]).translate(0, -textBbox.height / 2);

          // Add default values.
          const rectAttributes = _.extend({

            fill: 'white',
            rx: 3,
            ry: 3

          }, joint.util.getByPath(label, 'attrs/rect', '/'));

          const padding = 1;

          $rect.attr(_.extend(rectAttributes, {
            x: textBbox.x - padding,
            y: textBbox.y - padding - textBbox.height / 2,  // Take into account the y-alignment translation.
            width: textBbox.width + 2 * padding,
            height: textBbox.height + 2 * padding
          }));

        }, this);

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

        width = textSpan.getComputedTextLength();
        for (let i = 1; i < width && width > threshold; i++) {
          textNode.data = label.substr(0, label.length - i) + '\u2026';
          width = textSpan.getComputedTextLength();
        }

        if (offset) {
          (<any>node).attr('.label1/ref-x', Math.max((offset + HORIZONTAL_PADDING + width / 2) / IMAGE_W, 0.5), {silent: true});
        }
        (<any>node).attr(labelPath, textNode.data);
      } else {
        (<any>node).attr('.label1/ref-x', Math.max((offset + HORIZONTAL_PADDING + width / 2) / IMAGE_W, 0.5));
      }
    }
  }

}
