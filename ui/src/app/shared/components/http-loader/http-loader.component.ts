import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpLoaderService } from './http-loader.service';

/**
 * HttpLoaderComponent
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-http-loader',
  template: `
    <div class="app-http-loader" *ngIf="_show">
      <div class="progress-bar-infinite" role="progressbar">
        <div class="progress-bar-infinite-primary progress-bar-infinite-fill progress-bar-infinite-element"
             style="transform: scaleX(0);"></div>
        <div class="progress-bar-infinite-secondary progress-bar-infinite-fill progress-bar-infinite-element"></div>
      </div>
    </div>
  `
})
export class HttpLoaderComponent implements OnInit {

  _show = false;

  constructor(private httpLoaderService: HttpLoaderService) {
  }

  ngOnInit(): void {
    this.httpLoaderService.onChange
      .debounceTime(200)
      .subscribe((running: boolean) => {
        this._show = running;
      });
  }

}
