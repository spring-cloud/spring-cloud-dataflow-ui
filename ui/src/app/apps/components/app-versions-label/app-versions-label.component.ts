import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppRegistration } from '../../../shared/model';
import { AppVersion } from '../../../shared/model/app-version';

/**
 * Component used to format the type of Application.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-version-label',
  styleUrls: ['./styles.scss'],
  template: `<span *ngIf="application || version" [class.hover]="isClickable" [class.error]="isOnError">
      <a (click)="click()" *ngIf="simple">
        <span>{{ versionLabel }}</span>
      </a>
      <span *ngIf="!simple">
        <a (click)="click()" [tooltip]="tooltipTemplate" tooltipPlacement="left">
          <span>{{ versionLabel }}</span><span>{{ versions.length }}</span>
        </a>
        <ng-template #tooltipTemplate>
          <div class="tooltip-version">
            <div *ngFor="let v of versions">
              <div class="tooltip-version" *ngIf="!v.defaultVersion">
                {{ v.version }}
              </div>
              <div *ngIf="v.defaultVersion">
                <strong>{{ v.version }}</strong>
                <span placement="bottom" tooltip="Default version" class="ico-current-version glyphicon glyphicon-star">
                  </span>
              </div>
            </div>
            <div *ngIf="isOnError" style="color: #ff341f;font-weight:bold">No default version</div>
          </div>
        </ng-template>
      </span>
    </span>`
})
export class AppVersionLabelComponent {

  /**
   * Application tracked
   */
  @Input() application: AppRegistration;

  /**
   * Version tracked
   */
  @Input() version: AppVersion;

  /**
   * Is clickable
   */
  @Input() isClickable: boolean;

  /**
   * Simple display without count versions
   */
  @Input() forceSimple: boolean;

  /**
   * Event emit on click
   */
  @Output() labelClick: EventEmitter<boolean> = new EventEmitter();

  /**
   * Click
   */
  click() {
    if (!this.isClickable) {
      return;
    }
    this.labelClick.emit(true);
  }

  /**
   * Return version if application tracked
   *
   * @returns {AppVersion[]}
   */
  get versions(): AppVersion[] {
    return (this.application) ? this.application.versions : [];
  }

  /**
   * Return if simple display
   *
   * @returns {boolean}
   */
  get simple(): boolean {
    if (this.forceSimple) {
      return true;
    }
    if (this.application) {
      if (this.application.versions.length > 1) {
        return false;
      }
    }
    return true;
  }

  /**
   * Return true if application tracked and no default version
   *
   * @returns {boolean}
   */
  get isOnError(): boolean {
    if (this.application) {
      return (this.application.versionOnError());
    }
    return false;
  }

  /**
   * Return label
   *
   * @returns {string}
   */
  get versionLabel(): string {
    if (this.application) {
      if (this.application.versionOnError()) {
        return 'NO DEFAULT VERSION';
      }
      return this.application.version;
    }
    if (this.version) {
      return this.version.version;
    }
  }

}
