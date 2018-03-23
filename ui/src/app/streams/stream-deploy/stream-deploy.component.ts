import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver/FileSaver';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { FeatureInfo } from '../../shared/model/about/feature-info.model';
import * as moment from 'moment';
import { StreamsService } from '../streams.service';
import { Subject } from 'rxjs/Subject';
import { ToastyService } from 'ng2-toasty';
import { BusyService } from '../../shared/services/busy.service';

/**
 * Component used to deploy stream definitions.
 *
 * @author Janne Valkealahti
 * @author Glenn Renfro
 * @author Damien Vitrac
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-stream-deploy',
  templateUrl: './stream-deploy.component.html'
})
export class StreamDeployComponent implements OnInit, OnDestroy {

  /**
   * Observable Config
   */
  config$: Observable<{
    id: string,
    skipper: boolean
  }>;

  /**
   * State of the context
   */
  state: any = {
    view: 'builder'
  };

  /**
   * Reference Config
   */
  refConfig;

  /**
   * Busy Subscriptions
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Properties Array
   */
  properties: Array<string> = [];

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {StreamsService} streamsService
   * @param {ToastyService} toastyService
   * @param {BusyService} busyService
   * @param {Router} router
   * @param {SharedAboutService} sharedAboutService
   */
  constructor(private route: ActivatedRoute,
              private streamsService: StreamsService,
              private toastyService: ToastyService,
              private busyService: BusyService,
              private router: Router,
              private sharedAboutService: SharedAboutService) {
  }

  /**
   * Initialize compoment
   * Subscribe to route params and load a config for a stream
   */
  ngOnInit() {
    this.config$ = this.route.params
      .debounceTime(400)
      .pipe(mergeMap(
        val => this.sharedAboutService.getFeatureInfo(),
        (params: Params, featureInfo: FeatureInfo) => {
          return {
            id: params.id,
            skipper: featureInfo.skipperEnabled
          };
        }
      ))
      .pipe(map((config) => {
        this.refConfig = config;
        return config;
      }));
  }

  /**
   * On Destroy operations
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Update the properties
   */
  update(value: Array<string>) {
    this.properties = value.sort();
  }

  /**
   * Run export file
   * Update the properties
   * @param value Array of properties
   */
  runExport(value: Array<string>) {
    this.update(value);
    const propertiesText = this.properties.join('\n');
    const date = moment().format('YYYY-MM-HHmmss');
    const filename = `${this.refConfig.id}_${date}.txt`;
    const blob = new Blob([propertiesText], { type: 'text/plain' });
    saveAs(blob, filename);
  }

  /**
   * Run deploy
   * Update the properties
   * @param value Array of properties
   */
  runDeploy(value: Array<string>) {
    this.update(value);
    const propertiesMap = {};
    value.forEach((val) => {
      const arr = val.split('=');
      if (arr.length !== 2) {
        console.error('Split line property', val);
      } else {
        propertiesMap[arr[0]] = arr[1];
      }
    });
    const busy = this.streamsService.deployDefinition(this.refConfig.id, propertiesMap)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        data => {
          this.toastyService.success(`Successfully deployed stream definition "${this.refConfig.id}"`);
          this.router.navigate(['streams']);
        },
        error => {
          console.log(error);
          console.log(error.message);
          this.toastyService.error(`${error.message ? error.message : error.toString()}`);
        }
      );

    this.busyService.addSubscription(busy);
  }

}
