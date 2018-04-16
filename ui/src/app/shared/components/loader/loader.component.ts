import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Loader component
 * <app-loader></app-loader>
 * <app-loader text="Loading in progress…"></app-loader>
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-loader',
  styleUrls: ['styles.scss'],
  template: `
    <div class="app-loader">
      <div class="icon icon-middle spinner" style="font-size: 16px;">
        <svg class="icon-spinner-sm" height="100px" width="100px" viewBox="0 0 101 101">
          <circle class="ring" cx="50%" cy="50%" fill="none" r="45%" stroke-linecap="butt" stroke-width="10%"></circle>
          <circle class="path" cx="50%" cy="50%" fill="none" r="45%" stroke-linecap="butt" stroke-width="10%"></circle>
        </svg>
      </div>
      <span>
        {{ text }}
      </span>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {

  /**
   * Text display
   */
  @Input() text = 'Loading…';

}
