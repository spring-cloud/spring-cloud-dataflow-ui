import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Injectable()
export class DocService {
  private mouseDown = false;

  constructor(@Inject(DOCUMENT) private document: Document) {
    document.body.addEventListener('mouseup', () => (this.mouseDown = false));
    document.body.addEventListener('mousedown', () => (this.mouseDown = true));
  }

  body(): HTMLElement {
    return this.document.body;
  }

  isMouseDown(): boolean {
    return this.mouseDown;
  }
}
