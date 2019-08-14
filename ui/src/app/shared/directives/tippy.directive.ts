import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import tippy from 'tippy.js';

@Directive({
  selector: '[tippy]'
})
export class TippyDirective implements OnInit {

  /* tslint:disable-next-line:no-input-rename */
  @Input('tippyOptions') public tippyOptions: Object;

  constructor(private el: ElementRef) {
    this.el = el;
  }

  public ngOnInit() {
    const defaultOptions = {
      theme: 'scdf',
      arrow: true,
      animation: 'fade',
      distance: 5,
      delay: [200, 0],
      duration: [40, 50]
    };
    const options = Object.assign({}, defaultOptions, this.tippyOptions || {});
    tippy(this.el.nativeElement, options);
  }
}
