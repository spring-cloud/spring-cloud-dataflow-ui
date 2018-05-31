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
import { BusyService } from '../../shared/services/busy.service';
import { StreamDefinition } from '../model/stream-definition';
import { Parser } from '../../shared/services/parser';
import { StreamDeployService } from './stream-deploy.service';
import { NotificationService } from '../../shared/services/notification.service';

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
   * Original properties Array
   */
  ignoreProperties: Array<string> = [];

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {StreamsService} streamsService
   * @param {NotificationService} notificationService
   * @param {BusyService} busyService
   * @param {Router} router
   * @param {SharedAboutService} sharedAboutService
   */
  constructor(private route: ActivatedRoute,
              private streamsService: StreamsService,
              private notificationService: NotificationService,
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
      .pipe(mergeMap(
        val => this.streamsService.getDeploymentInfo(val.id),
        (config: any, deploymentInfo: StreamDefinition) => {
          const properties = [];
          const ignoreProperties = [];
          const cleanValue = (v) => (v && v.length > 1 && v.startsWith('"') && v.endsWith('"'))
            ? v.substring(1, v.length - 1) : v;

          // Deployer properties
          Object.keys(deploymentInfo.deploymentProperties).map(app => {
            Object.keys(deploymentInfo.deploymentProperties[app]).forEach((key: string) => {
              const value = cleanValue(deploymentInfo.deploymentProperties[app][key]);
              if (key === StreamDeployService.version.keyEdit) {
                properties.push(`version.${app}=${value}`);
              } else if (key.startsWith(StreamDeployService.deployer.keyEdit)) {
                const keyShort = key.substring(StreamDeployService.deployer.keyEdit.length, key.length);
                if (keyShort !== 'group') {
                  properties.push(`deployer.${app}.${keyShort}=${value}`);
                } else {
                  console.log(`${key} is bypassed (app: ${app}, value: ${value})`);
                }
              } else {
                console.log(`${key} is bypassed (app: ${app}, value: ${value})`);
              }
            });
          });

          // Application properties
          const dslTextParsed = Parser.parse(deploymentInfo.dslText, 'stream');
          dslTextParsed.lines[0].nodes.forEach((node) => {
            const app = node['label'] || node['name'];
            const appType = node['name'];
            if (node['options']) {
              node.options.forEach((value, key) => {
                value = cleanValue(value);
                let keyShort = key;
                if (key.startsWith(`${appType}.`)) {
                  keyShort = key.substring(`${appType}.`.length, key.length);
                }
                properties.push(`app.${app}.${keyShort}=${value}`);
                ignoreProperties.push(`app.${app}.${keyShort}=${value}`);
              });
            }
          });
          this.properties = properties;
          this.ignoreProperties = ignoreProperties;
          if (config.skipper) {
            this.ignoreProperties = Object.assign([], this.properties);
          }
          config.streamDefinition = deploymentInfo;
          return config;
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
    const cleanValue = (v) => (v && v.length > 1 && v.startsWith('"') && v.endsWith('"'))
      ? v.substring(1, v.length - 1) : v;
    value.forEach((val) => {
      if (this.ignoreProperties.indexOf(val) === -1) {
        const arr = val.split(/=(.*)/);
        if (arr.length !== 3) {
          console.error('Split line property', val);
        } else {
          // Workaround sensitive property: ignored property
          if (arr[1] === `'******'`) {
            console.log(`Sensitive property ${arr[0]} is ignored`);
          } else {
            propertiesMap[arr[0]] = cleanValue(arr[1]);
          }
        }
      }
    });

    let obs = Observable.of({});
    const isDeployed = (['deployed', 'deploying'].indexOf(this.refConfig.streamDefinition.status) > -1);
    const update = this.refConfig.skipper && isDeployed;

    if (update) {
      obs = obs.pipe(mergeMap(
        val => this.streamsService.updateDefinition(this.refConfig.id, propertiesMap),
        (val1, val2) => val2
      ));
    } else {
      if (isDeployed) {
        obs = obs.pipe(mergeMap(
          val => this.streamsService.undeployDefinition(this.refConfig.streamDefinition),
          (val1, val2) => val2
        ));
      }
      obs = obs.pipe(mergeMap(
        val => this.streamsService.deployDefinition(this.refConfig.id, propertiesMap),
        (val1, val2) => val2
      ));
    }

    const busy = obs.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(data => {
          if (update) {
            this.notificationService.success(`Successfully update stream definition "${this.refConfig.id}"`);
          } else {
            this.notificationService.success(`Successfully deployed stream definition "${this.refConfig.id}"`);
          }
          this.router.navigate(['streams']);
        },
        error => {
          const err = error.message ? error.message : error.toString();
          this.notificationService.error(err ? err : 'An error occurred during the stream deployment update.');
        }
      );

    this.busyService.addSubscription(busy);

  }

}
