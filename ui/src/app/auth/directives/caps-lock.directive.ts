import { AfterViewInit, Directive, Output, EventEmitter, HostListener, ElementRef, Renderer2 } from '@angular/core';

/**
 * This directive is a helper for any situation where you need
 * to find out if the caps lock key is active.
 *
 * @author Gunnar Hillert
 */
@Directive({
    selector: '[appCapsLock]'
})
export class CapsLockDirective implements AfterViewInit {

  @Output() appCapsLock = new EventEmitter<boolean>();

  /**
   * '20' is the non-printable key (function key): "CapsLock"
   */
  private readonly capsLockKeyCode = 20;

  constructor(private elem: ElementRef, private renderer: Renderer2) {
  }

  /**
   * Initializes the state of the surrounding element. As there is no way
   * to detect the state of the caps-lock key at startup (only when a key
   * is pressed), we have to assume that it is off,
   * therefore hiding the respective element.
   */
  ngAfterViewInit() {
    this.renderer.setStyle(this.elem.nativeElement, 'display', 'none');
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.which === this.capsLockKeyCode) {
      const capsOn = this.getCapsLockState(event);

      if (capsOn) {
        this.renderer.setStyle(this.elem.nativeElement, 'display', 'inherit');
      } else {
        this.renderer.setStyle(this.elem.nativeElement, 'display', 'none');
      }

      this.appCapsLock.emit(capsOn);
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (event.which === this.capsLockKeyCode) {
      const capsOn = this.getCapsLockState(event);

      if (!capsOn) {
        this.renderer.setStyle(this.elem.nativeElement, 'display', 'none');
      }
      this.appCapsLock.emit(capsOn);
    }
  }

  private getCapsLockState(event: KeyboardEvent) {
    return (event.getModifierState && event.getModifierState('CapsLock'));
  }

}
