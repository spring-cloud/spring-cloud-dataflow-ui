import { Component, OnInit } from '@angular/core';
import { Platform } from '../../../shared/model/platform.model';
import { StreamService } from '../../../shared/api/stream.service';
import { GroupService } from '../../../shared/service/group.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin, Observable, throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { StreamDeployService } from '../stream-deploy.service';
import { NotificationService } from '../../../shared/service/notification.service';
import { ParserService } from '../../../flo/shared/service/parser.service';

@Component({
  selector: 'app-stream-multi-deploy',
  templateUrl: './multi-deploy.component.html',
  providers: [
    StreamDeployService
  ],
  styleUrls: ['./multi-deploy.component.scss'],
})
export class MultiDeployComponent implements OnInit {

  isLoading = true;
  isRunning = false;
  streamConfigs: Array<any>;

  platforms: Platform[];
  form: FormGroup[];

  constructor(private streamService: StreamService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private streamDeployService: StreamDeployService,
              private parserService: ParserService,
              private groupService: GroupService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getPlatforms();
    this.route.params
      .pipe(
        mergeMap(
          (params: Params) => {
            if (!this.groupService.isSimilar(params.group) || !this.groupService.group(params.group)) {
              return throwError(`Group selection not found.`);
            }
            const streamNames = this.groupService.group(params.group) as Array<string>;
            return forkJoin(streamNames.map(name => this.streamDeployService.deploymentProperties(name)));
          }
        ),
        map((streamConfigs) => {
          this.form = streamConfigs.map((streamConfig) => {
            const platform = streamConfig.properties
              .filter((prop: string) => prop.startsWith('spring.cloud.dataflow.skipper.platformName='))
              .map(prop => prop.split('=')[1])
              .join('');
            const props = streamConfig.properties
              .filter((prop: string) => !prop.startsWith('spring.cloud.dataflow.skipper.platformName='))
              .join('\n');
            return new FormGroup({
              platform: new FormControl(platform || 'default'),
              properties: new FormControl(`${props}`)
            });
          });
          return streamConfigs;
        })
      )
      .subscribe((streamConfigs) => {
        this.streamConfigs = streamConfigs;
        this.isLoading = !(this.streamConfigs !== null && this.platforms !== null);
      });
  }

  getPlatforms() {
    this.streamService.getPlatforms()
      .subscribe((platforms: Platform[]) => {
        this.platforms = platforms;
        this.isLoading = !(this.streamConfigs !== null && this.platforms !== null);
      });
  }

  back() {
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
    return (count > 0);
  }

  runDeploy() {
    if (!this.isValid()) {
      this.notificationService.error('Invalid properties', 'Some field(s) are missing or invalid.');
    } else {
      this.isRunning = true;
      const cleanValue = (v) => (v && v.length > 1 && v.startsWith('"') && v.endsWith('"'))
        ? v.substring(1, v.length - 1) : v;

      const requests: Array<Observable<any>> = this.form.map((group: FormGroup, index: number) => {
        const propertiesMap = {};
        const config = this.streamConfigs[index];
        const platform = group.get('platform').value;
        const properties = group.get('properties').value.split('\n');
        if (platform) {
          properties.push(`spring.cloud.dataflow.skipper.platformName=${platform}`);
        }
        properties.forEach((val) => {
          if (config.ignoreProperties.indexOf(val) === -1) {
            const arr = val.split(/=(.*)/);
            if (arr.length !== 3) {
              // this.loggerService.error('Split line property', val);
            } else {
              // Workaround sensitive property: ignored property
              if (arr[1] === `'******'` || arr[1] === `******`) {
                // this.loggerService.log(`Sensitive property ${arr[0]} is ignored`);
              } else {
                propertiesMap[arr[0]] = cleanValue(arr[1]);
              }
            }
          }
        });
        if ((config.stream?.status !== 'UNDEPLOYED')) {
          return this.streamService.updateStream(config.stream.name, propertiesMap);
        } else {
          return this.streamService.deployStream(config.stream.name, propertiesMap);
        }
      });
      forkJoin([...requests])
        .subscribe(() => {
            this.notificationService.success('Deploy success', `Successfully deployed ${requests.length} stream(s).`);
            this.back();
          },
          error => {
            this.isRunning = false;
            this.notificationService.error('An error occurred', error);
          }
        );
    }
  }

}
