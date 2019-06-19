import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject, EMPTY, of } from 'rxjs';
import { catchError, finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver/FileSaver';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { StreamsService } from '../streams.service';
import { StreamDefinition } from '../model/stream-definition';
import { Parser } from '../../shared/services/parser';
import { StreamDeployService } from './stream-deploy.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { HttpAppError, AppError } from '../../shared/model/error.model';
import { ClipboardService } from 'ngx-clipboard';
import { DateTime } from 'luxon';
import { BlockerService } from '../../shared/components/blocker/blocker.service';

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
    streamDefinition: StreamDefinition
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
   * Unsubscribe
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
   * @param {LoggerService} loggerService
   * @param {StreamDeployService} streamDeployService
   * @param {Router} router
   * @param {ClipboardService} clipboardService
   * @param {BlockerService} blockerService
   * @param {SharedAboutService} sharedAboutService
   */
  constructor(private route: ActivatedRoute,
              private streamsService: StreamsService,
              private notificationService: NotificationService,
              private loggerService: LoggerService,
              private streamDeployService: StreamDeployService,
              private router: Router,
              private clipboardService: ClipboardService,
              private blockerService: BlockerService,
              private sharedAboutService: SharedAboutService) {
  }

  /**
   * Initialize compoment
   * Subscribe to route params and load a config for a stream
   */
  ngOnInit() {
    this.config$ = this.route.params
      .debounceTime(400)
      .pipe(
        map((params: Params) => {
          return {
            id: params.id,
            streamDefinition: null
          };
        })
      )
      .pipe(mergeMap(
        config => this.streamsService.getDeploymentInfo(config.id)
          .pipe(map((deploymentInfo) => {
            const properties = [];
            const ignoreProperties = [];

            // Deployer properties
            if (deploymentInfo.deploymentProperties) {
              Object.keys(deploymentInfo.deploymentProperties).map(app => {
                Object.keys(deploymentInfo.deploymentProperties[app]).forEach((key: string) => {
                  const value = this.streamDeployService.cleanValueProperties(deploymentInfo.deploymentProperties[app][key]);
                  if (key === StreamDeployService.version.keyEdit) {
                    properties.push(`version.${app}=${value}`);
                  } else if (key.startsWith(StreamDeployService.deployer.keyEdit)) {
                    const keyShort = key.substring(StreamDeployService.deployer.keyEdit.length, key.length);
                    if (keyShort !== 'group') {
                      properties.push(`deployer.${app}.${keyShort}=${value}`);
                    } else {
                      this.loggerService.log(`${key} is bypassed (app: ${app}, value: ${value})`);
                    }
                  } else {
                    this.loggerService.log(`${key} is bypassed (app: ${app}, value: ${value})`);
                  }
                });
              });
            }

            // Application properties
            const dslTextParsed = Parser.parse(deploymentInfo.dslText, 'stream');
            dslTextParsed.lines[0].nodes.forEach((node) => {
              const app = node['label'] || node['name'];
              const appType = node['name'];
              if (node['options']) {
                node.options.forEach((value, key) => {
                  value = this.streamDeployService.cleanValueProperties(value);
                  let keyShort = key;
                  if (key.startsWith(`${appType}.`)) {
                    ignoreProperties.push(`app.${app}.${keyShort}=${value}`);
                    keyShort = key.substring(`${appType}.`.length, key.length);
                  }
                  properties.push(`app.${app}.${keyShort}=${value}`);
                });
              }
            });
            this.properties = properties;
            this.ignoreProperties = [ ...properties, ...ignoreProperties];
            config.streamDefinition = deploymentInfo;
            return config;
          }))
      ))
      .pipe(
        map((config) => {
          this.refConfig = config;
          return config;
        }),
        catchError((error) => {
          if (HttpAppError.is404(error)) {
            this.router.navigate(['/streams/definitions']);
          }
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
          return EMPTY;
        })
      );
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
    if (this.properties.length === 0) {
      this.notificationService.error('There are no properties to export.');
    } else {
      const propertiesText = this.properties.join('\n');
      const date = DateTime.local().toFormat('yyyy-MM-HHmmss');
      const filename = `${this.refConfig.id}_${date}.txt`;
      const blob = new Blob([propertiesText], { type: 'text/plain' });
      saveAs(blob, filename);
    }
  }

  /**
   * Run copy to clipboard
   * Update the properties
   * @param value Array of properties
   */
  runCopy(value: Array<string>) {
    this.update(value);
    if (this.properties.length === 0) {
      this.notificationService.error('There are no properties to copy.');
    } else {
      const propertiesText = this.properties.join('\n');
      this.clipboardService.copyFromContent(propertiesText);
      this.notificationService.success('The properties have been copied to your clipboard.');
    }
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
          this.loggerService.error('Split line property', val);
        } else {
          // Workaround sensitive property: ignored property
          if (arr[1] === `'******'` || arr[1] === `******`) {
            this.loggerService.log(`Sensitive property ${arr[0]} is ignored`);
          } else {
            propertiesMap[arr[0]] = cleanValue(arr[1]);
          }
        }
      }
    });
    let obs = of({});
    const isDeployed = this.isDeployed(this.refConfig.streamDefinition);
    if (isDeployed) {
      obs = obs.pipe(mergeMap(val => this.streamsService.updateDefinition(this.refConfig.id, propertiesMap)));
    } else {
      obs = obs.pipe(mergeMap(val => this.streamsService.deployDefinition(this.refConfig.id, propertiesMap)));
    }
    this.blockerService.lock();
    obs.pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
      .subscribe(data => {
          if (isDeployed) {
            this.notificationService.success(`Successfully updated stream definition "${this.refConfig.id}"`);
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
  }

  /**
   * Is stream deployed (or deploying)
   */
  isDeployed(stream: StreamDefinition): boolean {
    return (stream.status !== 'undeployed');
  }

}
