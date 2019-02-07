import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

/**
 * Confirm Service.
 *
 * @author Damien Vitrac
 */
@Injectable()
export class BlockerService {
  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  lock() {
    this.renderer.addClass(document.body, 'blocked');
  }

  unlock() {
    this.renderer.removeClass(document.body, 'blocked');
  }

}
