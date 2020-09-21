import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { App, ApplicationType } from '../../shared/model/app.model';
import { AppService } from '../../shared/api/app.service';
import { NotificationService } from '../../shared/service/notification.service';
import { ConfirmComponent } from '../../shared/component/confirm/confirm.component';

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
  @ViewChild('unregisterModal', { static: true }) unregisterModal: ConfirmComponent;
  @ViewChild('makeDefaultModal', { static: true }) makeDefaultModal: ConfirmComponent;

  constructor(private appService: AppService,
              private notificationService: NotificationService) {
  }

  open(name: string, type: ApplicationType) {
    this.loading = true;
    this.isOpen = true;
    this.appService.getAppVersions(name, type)
      .subscribe((versions: App[]) => {
        this.versions = versions;
        this.loading = false;
      }, (error) => {
        this.notificationService.error('An error occurred', error);
        this.isOpen = false;
      });
  }

  unregisterConfirm(version: App) {
    this.selected = version;
    this.unregisterModal.open();
  }

  makeDefaultConfirm(version: App) {
    this.selected = version;
    this.makeDefaultModal.open();
  }

  unregister() {
    this.appService.unregisterApp(this.selected)
      .subscribe(
        data => {
          this.notificationService.success('Unregister version', 'Successfully removed version "'
            + this.selected.version + '".');
          this.open(this.versions[0].name, this.versions[0].type);
          this.selected = null;
          if (this.versions.length === 2) {
            this.isOpen = false;
          }
          this.onChange.emit(true);
        }, error => {
          this.notificationService.error('An error occurred', error);
          this.isOpen = false;
          this.selected = null;
        });
  }

  makeDefault() {
    this.appService.defaultVersion(this.selected)
      .subscribe(
        data => {
          this.notificationService.success('Default version', `The version <strong>${this.selected.version}</strong> ` +
            `is now the default version of the application <strong>${this.versions[0].name}</strong> (${this.versions[0].type}).`);
          this.open(this.versions[0].name, this.versions[0].type);
          this.selected = null;
          this.onChange.emit(true);
        }, error => {
          this.notificationService.error('An error occurred', error);
          this.isOpen = false;
          this.selected = null;
        });
  }

}
