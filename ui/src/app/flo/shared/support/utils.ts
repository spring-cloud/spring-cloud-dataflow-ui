/*
 * Copyright 2015-2016 the original author or authors.
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

import { Flo } from 'spring-flo';
import { dia } from 'jointjs';

/**
 * Utilities for Flo based graph editors.
 *
 * @author Alex Boyko
 */
export class Utils {

  static RX_JAVA_PROCESSOR_SOURCE_TYPE = 'org.springframework.cloud.stream.app.transform.ProgrammableRxJavaProcessorProperties';
  static SCRIPTABLE_TRANSFORM_SOURCE_TYPE =
    'org.springframework.cloud.stream.app.scriptable.transform.processor.ScriptableTransformProcessorProperties';

  static RX_JAVA_PROCESSOR_NAME = 'rx-java-processor';
  static SCRIPTABLE_TRANSFORM_NAME = 'scriptable-transform';

  static encodeTextToDSL(text: string): string {
    return '\"' + text.replace(/(?:\r\n|\r|\n)/g, '\\n').replace(/"/g, '""') + '\"';
  }

  static decodeTextFromDSL(dsl: string): string {
    if (dsl.charAt(0) === '\"' && dsl.charAt(dsl.length - 1) === '\"') {
      dsl = dsl.substr(1, dsl.length - 2);
    }
    return dsl.replace(/\\n/g, '\n').replace(/\"\"/g, '"');
  }

  static isCodeTypeProperty(metadata: Flo.ElementMetadata, property: string): boolean {
    const propertyLowerCase = property.toLowerCase();
    return (metadata.name === Utils.RX_JAVA_PROCESSOR_NAME
        && (propertyLowerCase === 'code' || propertyLowerCase === 'rxjava-processor.code'))
      || (metadata.name === Utils.SCRIPTABLE_TRANSFORM_NAME
        && (propertyLowerCase === 'script' || propertyLowerCase === 'scriptable-transformer.script'));
  }

  static isUnresolved(element: dia.Cell): boolean {
    return Utils.isUnresolvedMetadata(element.attr('metadata'));
  }

  static isUnresolvedMetadata(metadata: Flo.ElementMetadata) {
    return !metadata || (metadata.metadata && metadata.metadata.unresolved);
  }

}
