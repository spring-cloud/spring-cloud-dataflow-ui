import { PipeTransform, Pipe } from '@angular/core';

/**
 * Pipe that transforms an input string to camel-case.
 *
 * @author Gunnar Hillert
 */
@Pipe({name: 'capitalize'})
export class CapitalizePipe implements PipeTransform {
  transform(input: string): string {
    if (input) {
      return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
    return input;
  }
}
