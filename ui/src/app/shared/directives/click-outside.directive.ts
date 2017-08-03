import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

/**
 * This directive is a helper for any situation where you need
 * to close pop-overs etc. by means of clicking outside of the
 * element.
 *
 * @author Gunnar Hillert
 */
@Directive({
    selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  /**
   * Event emitter for sending events on when click is outside of element.
   * @type {EventEmitter<MouseEvent>}
   */
  @Output()
    public appClickOutside = new EventEmitter<MouseEvent>();

    constructor(private _elementRef: ElementRef) {
    }

  /**
   * Emits click event if a click occurs outside of element.
   * @param event the document click event that was captured.
   * @param targetElement The element to which the event occurred.
   */
    @HostListener('document:click', ['$event', '$event.target'])
    public onClick(event: MouseEvent, targetElement: HTMLElement): void {

        if (!targetElement) {
            return;
        }

        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.appClickOutside.emit(event);
        }
    }
}
