import { Directive, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

/**
 * Directive that can be used to provide size information to the main {@link TruncatorComponent}.
 *
 * @author Gunnar Hillert
 */
@Directive({
  selector: '.dataflow-truncator-width'
})
export class TruncatorWidthProviderDirective {

  public innerWidth = new BehaviorSubject<number>(undefined);
  public initDone = new BehaviorSubject<boolean>(false);

  public resizeEvents = new Subject();

  constructor(private elementRef: ElementRef) {
    this.resizeEvents
      .debounceTime(500)
      .subscribe(() => {
        this.updateWidthValue();
      });

    // Update the width after the component has been fully initialized.
    this.initDone.forEach(value => {
      if (value) {
        setTimeout(() => this.updateWidthValue(), 500);
      }
    });
  }

  /**
   * Entry point for the actual resize operation.
   */
  private updateWidthValue(): void {
    const nativeElement = this.elementRef.nativeElement;
    const computedStyleOfElement: CSSStyleDeclaration = getComputedStyle(nativeElement);
    const paddingLeft = Math.ceil(parseFloat(computedStyleOfElement.paddingLeft));
    const paddingRight = Math.ceil(parseFloat(computedStyleOfElement.paddingRight));
    const borderLeft = Math.ceil(parseFloat(computedStyleOfElement.borderLeftWidth));
    const borderRight = Math.ceil(parseFloat(computedStyleOfElement.borderRightWidth));
    this.innerWidth.next(nativeElement.offsetWidth - paddingLeft - paddingRight - borderLeft - borderRight);
  }
}
