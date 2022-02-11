import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {App, ApplicationType} from '../../shared/model/app.model';
import {AppService} from '../../shared/api/app.service';
import {NotificationService} from '../../shared/service/notification.service';
import {ConfirmComponent} from '../../shared/component/confirm/confirm.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html'
})
export class VersionComponent {
  isOpen = false;
  isRunning = false;
  loading = true;
  versions: App[];
  selected: App;

  @Output() onChange = new EventEmitter();
  @ViewChild('unregisterModal', {static: true}) unregisterModal: ConfirmComponent;
  @ViewChild('makeDefaultModal', {static: true}) makeDefaultModal: ConfirmComponent;

  constructor(
    private appService: AppService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  open(name: string, type: ApplicationType): void {
    this.loading = true;
    this.isOpen = true;
    this.appService.getAppVersions(name, type).subscribe(
      (versions: App[]) => {
        this.versions = versions;
        this.loading = false;
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
        this.isOpen = false;
      }
    );
  }

  unregisterConfirm(version: App): void {
    this.selected = version;
    this.unregisterModal.open();
  }

  makeDefaultConfirm(version: App): void {
    this.selected = version;
    this.makeDefaultModal.open();
  }

  unregister(): void {
    this.appService.unregisterApp(this.selected).subscribe(
      () => {
        this.notificationService.success(
          this.translate.instant('applications.version.message.unregisterSuccessTitle'),
          this.translate.instant('applications.version.message.unregisterSuccessContent', {
            version: this.selected.version
          })
        );
        this.open(this.versions[0].name, this.versions[0].type);
        this.selected = null;
        if (this.versions.length === 2) {
          this.isOpen = false;
        }
        this.onChange.emit(true);
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
        this.isOpen = false;
        this.selected = null;
      }
    );
  }

  makeDefault(): void {
    this.appService.defaultVersion(this.selected).subscribe(
      () => {
        this.notificationService.success(
          this.translate.instant('applications.version.message.defaultSuccessTitle'),
          this.translate.instant('applications.version.message.defaultSuccessContent', {
            version: this.selected.version,
            app: this.versions[0].name,
            type: this.versions[0].type
          })
        );
        this.open(this.versions[0].name, this.versions[0].type);
        this.selected = null;
        this.onChange.emit(true);
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
        this.isOpen = false;
        this.selected = null;
      }
    );
  }
}
