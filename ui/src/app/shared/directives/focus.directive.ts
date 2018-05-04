import { Directive, ElementRef, Input, OnChanges, OnDestroy, Optional } from '@angular/core';

/**
 * This directive is a helper for any situation where you need
 * to focus a control.
 *
 * @author Damien Vitrac
 */
@Directive({
  selector: '[dataflowFocus]',
})
export class FocusDirective implements OnChanges {

  /**
   * App Focus
   * @type {boolean}
   */
  @Input() dataflowFocus = false;

  /**
   * Delay Focus
   * @type {number}
   */
  @Input() focusDelay = 0;

  /**
   * Constructor
   * @param {ElementRef} elementRef
   */
  constructor(private elementRef: ElementRef) {
  }

  /**
   * On Change Event
   */
  ngOnChanges() {
    this.checkFocus();
  }

  /**
   * Check Focus
   */
  private checkFocus() {
    if (this.dataflowFocus && document.activeElement !== this.elementRef.nativeElement) {
      let checkFocusTimeoutHandle: number;
      const focus = () => {
        this.elementRef.nativeElement.focus();
      };
      checkFocusTimeoutHandle = setTimeout(focus, this.focusDelay) as any;
    }
  }

}
