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

  executeCopy(copyContent: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.createTextareaEl();
      this.setTextareaValue(copyContent);
      document.body.appendChild(this.textareaEl);
      this.textareaEl.select();
      document.execCommand('copy');
      document.body.removeChild(this.textareaEl);
      delete this.textareaEl;
    }
  }
}
