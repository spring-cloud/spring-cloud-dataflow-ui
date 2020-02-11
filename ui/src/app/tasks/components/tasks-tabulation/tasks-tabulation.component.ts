import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TasksService } from '../../tasks.service';
import { map } from 'rxjs/operators';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { FeatureInfo } from '../../../shared/model/about/feature-info.model';
import { Router } from '@angular/router';
import { AppsService } from '../../../apps/apps.service';
import { GrafanaService } from '../../../shared/grafana/grafana.service';

/**
 * Component used to display the tabulation with counters.
 *
 * @author Damien Vitrac
 * @author Christian Tzolov
 */
@Component({
  selector: 'app-tasks-tabulation',
  templateUrl: 'tasks-tabulation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksTabulationComponent implements OnInit, OnDestroy {

  params$: Observable<any>;

  /**
   * Grafana Subscription
   */
  grafanaEnabledSubscription: Subscription;

  /**
   * Featured Info
   */
  grafanaEnabled = false;

  /**
   * Constructor
   *
   * @param {TasksService} tasksService
   * @param {SharedAboutService} sharedAboutService
   * @param {AppsService} appsService
   * @param {GrafanaService} grafanaService
   * @param {Router} router
   */
  constructor(private tasksService: TasksService,
              private sharedAboutService: SharedAboutService,
              private appsService: AppsService,
              private grafanaService: GrafanaService,
              private router: Router) {
  }

  ngOnInit() {
    this.grafanaEnabledSubscription = this.grafanaService.isAllowed().subscribe((active: boolean) => {
      this.grafanaEnabled = active;
    });
    this.refresh();
  }

  ngOnDestroy() {
    this.grafanaEnabledSubscription.unsubscribe();
  }

  refresh() {
    this.params$ = this.sharedAboutService.getFeatureInfo()
      .pipe(map((featureInfo: FeatureInfo) => ({
        schedulesEnabled: featureInfo.schedulesEnabled
      })));
  }

  createTask() {
    this.router.navigate(['/tasks/create']);
  }

  /**
   * Navigate to the grafana Dashboard
   */
  grafanaDashboard() {
    this.grafanaService.getDashboardTasks().subscribe((url: string) => {
      window.open(url);
    });
  }

  /**
   * Navigate to the utils page
   */
  utils() {
    this.router.navigate(['/tasks/utils']);
  }

}
