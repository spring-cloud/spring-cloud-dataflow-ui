import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  HostListener,
  Input,
  Optional,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { TrailPositionType } from './trail-position-type.model';
import { TruncatorWidthProviderDirective } from './truncator-width-provider.directive';
import { takeUntil } from 'rxjs/operators';

/**
 * Component that supports a button that can change its message based on count of items in a array.
 * @author Gunnar Hillert
 */
@Component({
  selector: 'dataflow-truncator',
  styles: [`
    span {
      -ms-word-break: break-all;
      word-break: break-all;
      /* Non standard for webkit */
      word-break: break-word;
      -webkit-hyphens: none;
      -moz-hyphens: none;
      hyphens: none;
      overflow-wrap: break-all;
      white-space: pre-wrap;
      word-break: break-all;
    }
  `],
  template:
      `<span [title]="input">{{output}}</span>`
})
export class TruncatorComponent implements AfterViewInit, AfterContentInit, OnDestroy {

  @Input()
  public trail = '…';
  /**
   * The array that is used to determine the state of the button.
   * @type {Array}
   */
  @Input()
  public input: string;

  @Input()
  public trailPosition: string = TrailPositionType.END.name;

  private resizeEvents = new Subject();

  public output = '';

  private canvas: HTMLCanvasElement;

  /**
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  constructor(
    @Host() @Optional() private truncatorWidthProviderComponent: TruncatorWidthProviderDirective,
    private elementRef: ElementRef, private changeDetector: ChangeDetectorRef) {

    if (!this.truncatorWidthProviderComponent) {
      this.resizeEvents
        .debounceTime(200)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
          const innerWidth = this.getInnerWidth();
          this.doResizeInputString(innerWidth);
        });
    }
  }

  /**
   * On Destroy operations
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  ngAfterContentInit() {
    this.input = this.input.replace(/\-/g, '\u2011');
    this.output = this.input;
  }

  /**
   * Updates the button state after the component has been fully initialized.
   */
  ngAfterViewInit() {
    if (this.truncatorWidthProviderComponent) {
      this.truncatorWidthProviderComponent.initDone.next(true);
      this.truncatorWidthProviderComponent.innerWidth.forEach(width => {
        if (width) {
          this.doResizeInputString(width);
          this.changeDetector.detectChanges();
        }
      });
    } else {
      const innerWidth = this.getInnerWidth();
      this.doResizeInputString(innerWidth);
      this.changeDetector.detectChanges();
    }
  }

  /**
   * When a user resizes his/her browser window the available space
   * for the component (Width of the parent element) may also have changed.
   */
  @HostListener('window:resize')
  onResize() {
    if (!this.truncatorWidthProviderComponent) {
      this.resizeEvents.next();
    } else {
      this.output = this.input;
      this.changeDetector.detectChanges();
      this.truncatorWidthProviderComponent.resizeEvents.next();
    }
  }

  private getInnerWidth() {
    const parentNativeElement = this.elementRef.nativeElement.parentElement;
    const computedStyleOfParentElement: CSSStyleDeclaration = getComputedStyle(parentNativeElement);
    const paddingLeft = Math.ceil(parseFloat(computedStyleOfParentElement.paddingLeft));
    const paddingRight = Math.ceil(parseFloat(computedStyleOfParentElement.paddingRight));
    return parentNativeElement.offsetWidth - paddingLeft - paddingRight;
  }

  /**
   * Entry point for the actualy resize operation.
   */
  private doResizeInputString(maxWidth: number): void {
    const nativeElement = this.elementRef.nativeElement;
    const computedStyleOfElement: CSSStyleDeclaration = getComputedStyle(nativeElement);

    const cssFontProperty = computedStyleOfElement.fontStyle + ' ' +
      computedStyleOfElement.fontVariant + ' ' +
      computedStyleOfElement.fontWeight + ' ' +
      computedStyleOfElement.fontSize + ' ' +
      computedStyleOfElement.fontFamily + ' ';
    this.output = this.stringThatFitsInElement(this.input, cssFontProperty, maxWidth);
  }

  public getTextWidth(text, font): number {

    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
    }
    const context: CanvasRenderingContext2D = this.canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return Math.floor(metrics.width);
  }

  private stringThatFitsInElement(text: string, cssFontProperty: string, maxWidth: number) {
    if (this.getTextWidth(text, cssFontProperty) <= maxWidth) {
      return text;
    }

    const textLength = text.length;
    const widthOfEllipsis = this.getTextWidth(this.trail, cssFontProperty);
    const textMaxWidth = maxWidth - widthOfEllipsis - 10;

    let tempText = text.substring(textLength, 1);
    let temporaryTextLenth = textLength - 1;

    while (temporaryTextLenth > 0) {

      if (this.trailPosition === TrailPositionType.END.name) {
        tempText = tempText.substring(0, temporaryTextLenth);
      } else {
        tempText = tempText.substring(temporaryTextLenth, 1);
      }

      temporaryTextLenth = temporaryTextLenth - 1;

      const tempTextWidth = this.getTextWidth(tempText, cssFontProperty);

      if (tempTextWidth < textMaxWidth) {
        break;
      }
    }

    if (this.trailPosition === TrailPositionType.END.name) {
      tempText = tempText + this.trail;
    } else {
      tempText = this.trail + tempText;
    }
    return tempText;
  }
}
