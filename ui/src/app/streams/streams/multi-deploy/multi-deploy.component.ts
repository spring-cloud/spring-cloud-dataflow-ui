import {Component, OnInit} from '@angular/core';
import {Platform} from '../../../shared/model/platform.model';
import {StreamService} from '../../../shared/api/stream.service';
import {GroupService} from '../../../shared/service/group.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {map, mergeMap} from 'rxjs/operators';
import {forkJoin, Observable, throwError} from 'rxjs';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {StreamDeployService} from '../stream-deploy.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-stream-multi-deploy',
  templateUrl: './multi-deploy.component.html',
  providers: [StreamDeployService],
  styleUrls: ['./multi-deploy.component.scss']
})
export class MultiDeployComponent implements OnInit {
  isLoading = true;
  isRunning = false;
  streamConfigs: Array<any>;

  platforms: Platform[];
  form: UntypedFormGroup[];

  constructor(
    private streamService: StreamService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private streamDeployService: StreamDeployService,
    private groupService: GroupService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getPlatforms();
    this.route.params
      .pipe(
        mergeMap((params: Params) => {
          if (!this.groupService.isSimilar(params.group) || !this.groupService.group(params.group)) {
            return throwError('Group selection not found.');
          }
          const streamNames = this.groupService.group(params.group) as Array<string>;
          return forkJoin(streamNames.map(name => this.streamDeployService.deploymentProperties(name)));
        }),
        map(streamConfigs => {
          this.form = streamConfigs.map(streamConfig => {
            const platform = streamConfig.properties
              .filter((prop: string) => prop.startsWith('spring.cloud.dataflow.skipper.platformName='))
              .map(prop => prop.split('=')[1])
              .join('');
            const props = streamConfig.properties
              .filter((prop: string) => !prop.startsWith('spring.cloud.dataflow.skipper.platformName='))
              .join('\n');
            return new UntypedFormGroup({
              platform: new UntypedFormControl(platform || 'default'),
              properties: new UntypedFormControl(`${props}`)
            });
          });
          return streamConfigs;
        })
      )
      .subscribe(streamConfigs => {
        this.streamConfigs = streamConfigs;
        this.isLoading = !(this.streamConfigs !== null && this.platforms !== null);
      });
  }

  getPlatforms(): void {
    this.streamService.getPlatforms().subscribe(
      (platforms: Platform[]) => {
        this.platforms = platforms;
        this.isLoading = !(this.streamConfigs !== null && this.platforms !== null);
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
        this.isLoading = false;
      }
    );
  }

  back(): void {
    this.router.navigateByUrl('streams/list');
  }

  isValid(): boolean {
    let count = 0;
    for (let i = 0; i < this.form.length; i++) {
      if (this.form[i].invalid) {
        return false;
      }
      count++;
    }
    return count > 0;
  }

  runDeploy(): void {
    if (!this.isValid()) {
      this.notificationService.error(
        this.translate.instant('commons.message.invalidFieldsTitle'),
        this.translate.instant('commons.message.invalidFieldsContent')
      );
    } else {
      this.isRunning = true;
      const cleanValue = v =>
        v && v.length > 1 && v.startsWith('"') && v.endsWith('"') ? v.substring(1, v.length - 1) : v;

      const requests: Array<Observable<any>> = this.form.map((group: UntypedFormGroup, index: number) => {
        const propertiesMap = {};
        const config = this.streamConfigs[index];
        const platform = group.get('platform').value;
        const properties = group.get('properties').value.split('\n');
        if (platform) {
          properties.push(`spring.cloud.dataflow.skipper.platformName=${platform}`);
        }
        properties.forEach(val => {
          if (config.ignoreProperties.indexOf(val) === -1) {
            const arr = val.split(/=(.*)/);
            if (arr.length !== 3) {
              // this.loggerService.error('Split line property', val);
            } else {
              // Workaround sensitive property: ignored property
              if (arr[1] === "'******'" || arr[1] === '******') {
                // this.loggerService.log(`Sensitive property ${arr[0]} is ignored`);
              } else {
                propertiesMap[arr[0]] = cleanValue(arr[1]);
              }
            }
          }
        });
        if (config.stream?.status !== 'UNDEPLOYED') {
          return this.streamService.updateStream(config.stream.name, propertiesMap);
        } else {
          return this.streamService.deployStream(config.stream.name, propertiesMap);
        }
      });
      forkJoin([...requests]).subscribe(
        () => {
          this.notificationService.success(
            this.translate.instant('streams.multiDeploy.successTitle'),
            this.translate.instant('streams.multiDeploy.successContent', {count: requests.length})
          );
          this.back();
        },
        error => {
          this.isRunning = false;
          this.notificationService.error(this.translate.instant('commons.message.error'), error);
        }
      );
    }
  }
}
