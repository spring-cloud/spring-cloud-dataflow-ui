import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClipboardCopyService {
  private textareaEl: HTMLTextAreaElement;

  constructor(@Inject(PLATFORM_ID) private platformId: Record<string, any>) {}

  private createTextareaEl() {
    this.textareaEl = document.createElement('textarea');

    // make it off screen
    this.textareaEl.setAttribute('readonly', '');
    this.textareaEl.classList.add('offscreen-clipboard-textarea');
  }

  private setTextareaValue(value: string) {
    this.textareaEl.value = value;
  }

  executeCopy(copyContent: string, container?: HTMLElement) {
    if (isPlatformBrowser(this.platformId)) {
      const _container = container ? container : document.body;
      this.createTextareaEl();
      this.setTextareaValue(copyContent);
      _container.appendChild(this.textareaEl);
      this.textareaEl.select();
      document.execCommand('copy');
      _container.removeChild(this.textareaEl);
      delete this.textareaEl;
    }
  }
}
