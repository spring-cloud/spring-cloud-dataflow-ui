import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Confirm Service.
 *
 * @author Damien Vitrac
 */
@Injectable()
export class BlockerService {

  /**
   * Renderer
   */
  private renderer: Renderer2;

  public changeState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Constructor
   * @param rendererFactory
   */
  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Lock
   */
  lock() {
    this.renderer.addClass(document.body, 'blocked');
    this.changeState.next(true);
  }

  /**
   * Unlock
   */
  unlock() {
    this.renderer.removeClass(document.body, 'blocked');
    this.changeState.next(false);
  }

}
