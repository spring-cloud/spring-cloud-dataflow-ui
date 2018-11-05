import { Component, OnInit } from '@angular/core';
import { AboutService } from '../../about.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AboutInfo } from '../../../shared/model/about/about-info.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * Component About Details.
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-about-details',
  styleUrls: ['./../../about/styles.scss'],
  templateUrl: './about-details.component.html'
})
export class AboutDetailsComponent implements OnInit {

  /**
   * Observabe About Info
   */
  public dataflowVersionInfo$: Observable<AboutInfo>;

  /**
   * Constructor
   *
   * @param {AboutService} aboutService
   * @param {NotificationService} notificationService
   * @param {LoggerService} loggerService
   * @param {Router} router
   */
  constructor(private aboutService: AboutService,
              private notificationService: NotificationService,
              private loggerService: LoggerService,
              private router: Router) {
  }

  /**
   * On init
   */
  ngOnInit() {
    this.dataflowVersionInfo$ = this.aboutService.getDetails();
  }

  /**
   * Cancel
   */
  cancel() {
    this.router.navigate(['about']);
  }

  /**
   * Copy On Clipboard
   * @param e
   */
  onCopyToClipboardSuccess(e) {
    this.notificationService.success('Copied About Details to Clipboard (As JSON).');
    this.loggerService.log(e);
  }

  /**
   * Is Empty
   *
   * @param obj
   * @returns {boolean}
   */
  isEmpty(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }
}
