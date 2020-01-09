/*
 * Copyright 2020 the original author or authors.
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

import { dia } from 'jointjs';
import * as _joint from 'jointjs';

const joint: any = _joint;


export class ViewUtils {

  static fitLabel(paper: dia.Paper, node: dia.Element, labelPath: string, paddingLeft: number, paddingRight?: number): void {
    if (isNaN(paddingRight)) {
      paddingRight = paddingLeft;
    }
    const label: string = node.attr(`${labelPath}/text`);
    const view = paper.findViewByModel(node);
    if (view && label) {
      const labelElement = view.findBySelector(labelPath)[0];
      if (!labelElement) {
        return;
      }
      let offset = 0;
      if (node.attr('.type-icon')) {
        const label2View = view.findBySelector('.type-icon')[0];
        if (label2View) {
          const box = joint.V(label2View).bbox(false, paper.viewport);
          let padding = 0;
          if (node.attr('.type-icon/ref')) {
            const refView = view.findBySelector(node.attr('.type-icon/ref'))[0];
            if (refView) {
              padding = box.x - joint.V(refView).bbox(false, paper.viewport).x;
            }
          } else {
            padding = box.x - view.getBBox().x;
          }
          offset = padding + box.width;
        }
      } else if (node.attr('.label2/text')) {
        const label2View = view.findBySelector('.label2')[0];
        if (label2View) {
          const box = joint.V(label2View).bbox(false, paper.viewport);
          let padding = 0;
          if (node.attr('.label2/ref')) {
            const refView = view.findBySelector(node.attr('.label2/ref'))[0];
            if (refView) {
              padding = box.x - joint.V(refView).bbox(false, paper.viewport).x;
            }
          } else {
            padding = box.x - view.getBBox().x;
          }
          offset = padding + box.width;
        }
      }

      let boundingBox = view.getBBox();
      if (node.attr(`${labelPath}/ref`)) {
        const refElement = view.findBySelector(node.attr(`${labelPath}/ref`))[0];
        if (refElement) {
          boundingBox = joint.V(refElement).bbox(false, paper.viewport);
        }
      }

      const threshold = boundingBox.width - paddingLeft - paddingRight - offset;

      let width = joint.V(labelElement).bbox(false, paper.viewport).width;

      if (width > threshold) {
        const styles = getComputedStyle(labelElement);
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
            node.attr(`${labelPath}/refX`, Math.max((offset + paddingLeft + width / 2) / boundingBox.width, 0.5), { silent: true });
          }
          // TODO: What does this do? Replaces rendering with silent update it seems. Verify later.
          node.attr(`${labelPath}/text`, textNode.data);
        } finally {
          document.body.removeChild(svgDocument);
        }
      } else {
        node.attr(`${labelPath}/refX`, Math.max((offset + paddingLeft + width / 2) / boundingBox.width, 0.5));
      }
    }
  }

  static fitLabelWithFixedLocation(paper: dia.Paper, node: dia.Element, labelPath: string, paddingRight?: number): void {
    if (isNaN(paddingRight)) {
      paddingRight = 0;
    }
    const label: string = node.attr(`${labelPath}/text`);
    const view = paper.findViewByModel(node);
    if (view && label) {
      const labelElement = view.findBySelector(labelPath)[0];
      if (!labelElement) {
        return;
      }

      let boundingBox = view.getBBox();
      if (node.attr(`${labelPath}/ref`)) {
        const refElement = view.findBySelector(node.attr(`${labelPath}/ref`))[0];
        if (refElement) {
          boundingBox = joint.V(refElement).bbox(false, paper.viewport);
        }
      }

      const labelInitialBox = joint.V(labelElement).bbox(false, paper.viewport);

      const locationX = labelInitialBox.x - boundingBox.x;

      const threshold = boundingBox.width - paddingRight - locationX;

      let width = labelInitialBox.width;

      if (width > threshold) {
        const styles = getComputedStyle(labelElement);
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

          // TODO: What does this do? Replaces rendering with silent update it seems. Verify later.
          node.attr(`${labelPath}/text`, textNode.data);
        } finally {
          document.body.removeChild(svgDocument);
        }
      }
    }
  }

}
