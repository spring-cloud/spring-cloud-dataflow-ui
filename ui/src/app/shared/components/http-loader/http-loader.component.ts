import { Component, OnInit } from '@angular/core';
import { HttpLoaderService } from './http-loader.service';
import { debounceTime } from 'rxjs/operators';
import { BlockerService } from '../blocker/blocker.service';

/**
 * HttpLoaderComponent
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-http-loader',
  template: `
    <div class="app-http-loader" *ngIf="show">
      <div class="progress-bar-infinite" role="progressbar">
        <div class="progress-bar-infinite-primary progress-bar-infinite-fill progress-bar-infinite-element"
             style="transform: scaleX(0);"></div>
        <div class="progress-bar-infinite-secondary progress-bar-infinite-fill progress-bar-infinite-element"></div>
      </div>
      <div class="loader-wrapper">
        <app-loader>Loading ...</app-loader>
      </div>
    </div>
  `
})
export class HttpLoaderComponent implements OnInit {

  /**
   * Show attribute
   */
  show = false;

  /**
   * Is HTTP request running
   */
  private isRunning = false;

  /**
   * Is BlockerService lock state
   */
  private isLocked = false;

  /**
   * Constructor
   * @param httpLoaderService
   * @param blockerService
   */
  constructor(private httpLoaderService: HttpLoaderService,
              private blockerService: BlockerService) {
  }

  /**
   * Update state show
   */
  private updateShow() {
    this.show = (this.isRunning || this.isLocked);
  }

  /**
   * On Init
   * Attach listener to the HTTP request observable and to the BlockService change state
   */
  ngOnInit(): void {
    this.httpLoaderService.onChange.pipe(
      debounceTime(200))
      .subscribe((running: boolean) => {
        this.isRunning = running;
        this.updateShow();
      });

    this.blockerService.changeState.subscribe((locked) => {
      this.isLocked = locked;
      this.updateShow();
    });
  }

}
