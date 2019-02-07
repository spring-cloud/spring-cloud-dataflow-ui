import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuditRecordService } from '../audit-record.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { HttpAppError, AppError } from '../../shared/model/error.model';
import { AuditRecord } from '../../shared/model/audit-record.model';

/**
 * Provides details for an AuditRecord.
 *
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-details',
  styleUrls: ['./styles.scss'],
  templateUrl: './audit-record-details.component.html'
})
export class AuditRecordDetailsComponent implements OnInit, OnDestroy {

  /**
   * AuditRecord
   */
  auditRecord: AuditRecord;

  /**
   * Subscription
   */
  auditRecordSubscription: Subscription;

  /**
   * Constructor
   *
   * @param {AuditRecordService} auditRecordService
   * @param {NotificationService} notificationService
   * @param {ActivatedRoute} route
   * @param {RoutingStateService} routingStateService
   * @param {LoggerService} loggerService
   */
  constructor(private auditRecordService: AuditRecordService,
              private notificationService: NotificationService,
              private route: ActivatedRoute,
              private routingStateService: RoutingStateService,
              private loggerService: LoggerService) {
  }

  /**
   * Init
   */
  ngOnInit() {
    this.loggerService.log('Audit Record Details');

    this.route.params
      .subscribe(params => {
        this.auditRecord = new AuditRecord();
        this.auditRecord.auditRecordId = params.auditRecordId as number;
        this.refresh();
      });
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    if (this.auditRecordSubscription) {
      this.auditRecordSubscription.unsubscribe();
    }
  }

  /**
   * Refresh page, load the current version informations
   */
  refresh() {
    this.loadAuditRecordDetails();
  }

  /**
   * Used to load properties
   */
  loadAuditRecordDetails() {
    this.loggerService.log('Retrieving Audit Record details for id ' + this.auditRecord.auditRecordId + '.');
    if (this.auditRecordSubscription) {
      this.auditRecordSubscription.unsubscribe();
    }
    this.auditRecordSubscription = this.auditRecordService.getAuditRecordDetails(this.auditRecord.auditRecordId)
      .subscribe((auditRecord: AuditRecord) => {
          this.auditRecord = auditRecord;
        },
        error => {
          if (HttpAppError.is404(error)) {
            this.cancel();
          }
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        });

  }

  /**
   * Back action
   * Navigate to the previous URL or /audit-records
   */
  cancel() {
    this.routingStateService.back('/audit-records', /^(\/audit-records\/)/);
  }
}
