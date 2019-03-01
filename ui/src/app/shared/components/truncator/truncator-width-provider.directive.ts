import { Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

/**
 * Directive that can be used to provide size information to the main {@link TruncatorComponent}.
 *
 * @author Gunnar Hillert
 */
@Directive({
  selector: '.dataflow-truncator-width'
})
export class TruncatorWidthProviderDirective implements OnDestroy {

  public innerWidth = new BehaviorSubject<number>(undefined);

  public initDone = new BehaviorSubject<boolean>(false);

  public resizeEvents = new Subject();

  private destroyed = false;

  /**
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {
    const ref = this.elementRef;
    this.resizeEvents
      .pipe(takeUntil(this.ngUnsubscribe$))
      .pipe(
        map((a) => {
          this.renderer.removeClass(ref.nativeElement, 'show');
          return a;
        }),
        debounceTime(400)
      )
      .subscribe(() => {
        this.updateWidthValue();
        this.renderer.addClass(ref.nativeElement, 'show');
      });
    this.initDone
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        value => {
          if (value) {
            const localThis = this;
            if (!localThis.destroyed) {
              localThis.updateWidthValue();
              renderer.addClass(ref.nativeElement, 'show');
            }
          }
        }
      );
  }

  /**
   * On Destroy operations
   */
  ngOnDestroy() {
    this.destroyed = true;
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
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
