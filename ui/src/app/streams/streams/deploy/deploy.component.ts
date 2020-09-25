import { Component, OnDestroy, OnInit } from '@angular/core';
import { Stream } from '../../../shared/model/stream.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationService } from '../../../shared/service/notification.service';
import { StreamService } from '../../../shared/api/stream.service';
import { debounceTime, map, mergeMap } from 'rxjs/operators';
import { HttpError } from '../../../shared/model/error.model';
import { of, Subject } from 'rxjs';
import { LoggerService } from '../../../shared/service/logger.service';
import { ClipboardCopyService } from '../../../shared/service/clipboard-copy.service';
import { DateTime } from 'luxon';
import { StreamDeployService } from '../stream-deploy.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-deploy',
  templateUrl: './deploy.component.html',
  providers: [
    StreamDeployService
  ],
  styles: []
})
export class DeployComponent implements OnInit, OnDestroy {

  stream: Stream;
  loading = true;
  isDeploying = false;
  state: any = { view: 'builder' };
  ngUnsubscribe$: Subject<any> = new Subject();
  properties: Array<string> = [];
  ignoreProperties: Array<string> = [];

  constructor(private route: ActivatedRoute,
              private streamService: StreamService,
              private notificationService: NotificationService,
              private loggerService: LoggerService,
              private streamDeployService: StreamDeployService,
              private router: Router,
              private clipboardCopyService: ClipboardCopyService) {
  }

  /**
   * Initialize compoment
   * Subscribe to route params and load a config for a stream
   */
  ngOnInit() {
    this.route.params
      .pipe(
        debounceTime(400),
        map((params: Params) => {
          this.stream = new Stream();
          this.stream.name = params.name;
          return {
            id: params.name,
            stream: null
          };
        })
      )
      .pipe(mergeMap(
        config => this.streamDeployService.deploymentProperties(config.id)
          .pipe(map((deploymentProperties) => {
            this.properties = deploymentProperties.properties;
            this.ignoreProperties = deploymentProperties.ignoreProperties;
            config.stream = deploymentProperties.stream;
            return config;
          }))
      ))
      .subscribe((config: { stream, id }) => {
        this.stream = config.stream;
        this.loading = false;
      }, (error) => {
        this.notificationService.error('An error occurred', error);
        if (HttpError.is404(error)) {
          this.router.navigate(['/streams/definitions']);
        }
      });
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
      this.notificationService.error('An error occured', 'There are no properties to export.');
    } else {
      const propertiesText = this.properties.join('\n');
      const date = DateTime.local().toFormat('yyyy-MM-HHmmss');
      const filename = `${this.stream.name}_${date}.txt`;
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
      this.notificationService.error('An error occured', 'There are no properties to copy.');
    } else {
      const propertiesText = this.properties.join('\n');
      this.clipboardCopyService.executeCopy(propertiesText);
      this.notificationService.success('Copy to clipboard', 'The properties have been copied to your clipboard.');
    }
  }

  /**
   * Run deploy
   * Update the properties
   * @param value Array of properties
   */
  runDeploy(value: Array<string>) {
    this.isDeploying = true;
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
    const isDeployed = this.isDeployed(this.stream);
    if (isDeployed) {
      obs = obs.pipe(mergeMap(val => this.streamService.updateStream(this.stream.name, propertiesMap)));
    } else {
      obs = obs.pipe(mergeMap(val => this.streamService.deployStream(this.stream.name, propertiesMap)));
    }
    // this.blockerService.lock();
    obs
      // .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
      .subscribe(() => {
          if (isDeployed) {
            this.notificationService.success('Deploy success', `Successfully updated stream definition "${this.stream.name}"`);
          } else {
            this.notificationService.success('Deploy success', `Successfully deployed stream definition "${this.stream.name}"`);
          }
          this.router.navigate(['streams/list']);
        },
        error => {
          this.isDeploying = false;
          const err = error.message ? error.message : error.toString();
          this.notificationService.error('An error occurred', err ? err : 'An error occurred during the stream deployment update.');
        }
      );
  }

  /**
   * Is stream deployed (or deploying)
   */
  isDeployed(stream: Stream): boolean {
    return (stream?.status !== 'UNDEPLOYED');
  }
}
