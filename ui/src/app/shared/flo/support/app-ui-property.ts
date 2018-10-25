import { Properties } from 'spring-flo';

/**
 * App property consumable by properties dialog
 *
 * @author Alex Boyko
 */
export interface AppUiProperty extends Properties.Property {
  attr: string;
  isSemantic: boolean;
  code?: CodeProperty;
}

export interface CodeProperty {
  langPropertyName: string;
  language: string;
}
