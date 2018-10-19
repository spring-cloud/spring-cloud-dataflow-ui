import { Directive, ElementRef, Input, AfterViewInit, Renderer2 } from '@angular/core';
import { LoggerService } from '../services/logger.service';

/**
 * This directive is a helper for define a loyout type
 * Layouts: medium, large, full
 *
 * @author Damien Vitrac
 */
@Directive({
  selector: '[dataflowLayoutType]'
})
export class LayoutTypeDirective implements AfterViewInit {

  currentClass = null;

  @Input() type: String;

  constructor(private _elementRef: ElementRef,
              private loggerService: LoggerService,
              private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    this.update();
  }

  update() {
    const getClass = (_) => `content-layout-${_}`;
    if (this.currentClass) {
      this.renderer.removeClass(this._elementRef.nativeElement, getClass(this.currentClass));
    }
    switch ((this.type ? this.type : '').toLowerCase()) {
      default:
        this.loggerService.error('unknown layout');
        this.currentClass = 'large';
        break;
      case 'large':
        this.currentClass = 'large';
        break;
      case 'full':
        this.currentClass = 'full';
        break;
      case 'medium':
        this.currentClass = 'medium';
        break;
      case 'small':
        this.currentClass = 'small';
    }
    this.renderer.addClass(this._elementRef.nativeElement, getClass(this.currentClass));
  }

}
