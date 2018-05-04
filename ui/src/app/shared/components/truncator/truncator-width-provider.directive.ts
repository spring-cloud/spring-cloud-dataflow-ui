import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

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
   * Busy Subscriptions
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  constructor(private elementRef: ElementRef) {
    this.resizeEvents
      .debounceTime(500)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.updateWidthValue();
      });
    this.initDone.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(
      value => {
        if (value) {
          const localThis = this;
          setTimeout(function () {
            if (!localThis.destroyed) {
              localThis.updateWidthValue();
            }
          }, 500);
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
