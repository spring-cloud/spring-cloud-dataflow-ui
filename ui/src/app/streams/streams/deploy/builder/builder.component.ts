import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {StreamDeployService} from '../../stream-deploy.service';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {StreamDeployValidator} from '../stream-deploy.validator';
import {Properties} from 'spring-flo';
import {NotificationService} from '../../../../shared/service/notification.service';
import {StreamDeployConfig} from '../../../../shared/model/stream.model';
import {
  GroupPropertiesSource,
  GroupPropertiesSources,
  PropertiesGroupsDialogComponent
} from '../../../../flo/shared/properties-groups/properties-groups-dialog.component';
import {App} from '../../../../shared/model/app.model';
import {PropertiesDialogComponent} from '../../../../flo/shared/properties/properties-dialog.component';
import {StreamAppPropertiesSource, StreamHead} from '../../../../flo/stream/properties/stream-properties-source';
import {TranslateService} from '@ngx-translate/core';

export class AppPropertiesSource implements StreamAppPropertiesSource {
  private options: Array<any>;
  public confirm = new EventEmitter();

  constructor(options: Array<any>) {
    this.options = options;
  }

  getStreamHead(): StreamHead {
    return {presentStreamNames: []};
  }

  getProperties(): Promise<Properties.Property[]> {
    return of(this.options).toPromise();
  }

  applyChanges(properties: Properties.Property[]): void {
    this.confirm.emit(properties);
  }
}

@Component({
  selector: 'app-stream-deploy-builder',
  templateUrl: 'builder.component.html',
  styleUrls: ['builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuilderComponent implements OnInit, OnDestroy {
  @ViewChild('appPropertiesModal', {static: true}) appPropertiesModal: PropertiesDialogComponent;
  @ViewChild('groupsPropertiesModal', {static: true}) groupsPropertiesModal: PropertiesGroupsDialogComponent;

  /**
   * Stream ID
   */
  @Input() id: string;

  /**
   * Emits on destroy component with the current value
   */
  @Output() update = new EventEmitter();

  /**
   * Emit for request export
   */
  @Output() exportProperties = new EventEmitter();

  /**
   * Emit for request deploy
   */
  @Output() deploy = new EventEmitter();

  /**
   * Emit for request copy
   */
  @Output() copyProperties = new EventEmitter();

  /**
   * Properties to load
   */
  @Input() properties: Array<string> = [];

  /**
   * Is Deployed
   */
  @Input() isDeployed = false;

  /**
   * Builder observable
   * Contains the form and the input data
   */
  builder$: Observable<any>;

  /**
   * Builder Reference
   */
  refBuilder;

  /**
   * States
   */
  state: any = {
    platform: true,
    deployer: true,
    app: true,
    specificPlatform: true
  };

  constructor(
    private streamDeployService: StreamDeployService,
    private changeDetector: ChangeDetectorRef,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  /**
   * On Init
   */
  ngOnInit(): void {
    this.builder$ = this.streamDeployService
      .config(this.id)
      .pipe(map(streamDeployConfig => this.build(streamDeployConfig)))
      .pipe(map(builder => this.populate(builder)))
      .pipe(map(builder => this.populateApp(builder)));
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    if (this.refBuilder) {
      this.update.emit(this.getProperties());
    }
  }

  /**
   * Return an array of properties
   * @returns {Array<string>}
   */
  private getProperties(): Array<string> {
    const result: Array<string> = [];
    const isEmpty = (control: AbstractControl) => !control || control.value === '' || control.value === null;
    const deployers: UntypedFormArray = this.refBuilder.formGroup.get('deployers') as UntypedFormArray;
    const appsVersion: UntypedFormGroup = this.refBuilder.formGroup.get('appsVersion') as UntypedFormGroup;
    const global: UntypedFormArray = this.refBuilder.formGroup.get('global') as UntypedFormArray;
    const specificPlatform: UntypedFormArray = this.refBuilder.formGroup.get('specificPlatform') as UntypedFormArray;

    // Platform
    if (!isEmpty(this.refBuilder.formGroup.get('platform'))) {
      result.push(`spring.cloud.dataflow.skipper.platformName=${this.refBuilder.formGroup.get('platform').value}`);
    }

    // Deployers
    this.refBuilder.streamDeployConfig.deployers.forEach((deployer, index) => {
      if (!isEmpty(deployers.controls[index].get('global'))) {
        result.push(`deployer.*.${deployer.id}=${deployers.controls[index].get('global').value}`);
      }
      this.refBuilder.streamDeployConfig.apps.forEach(app => {
        if (!isEmpty(deployers.controls[index].get(app.name))) {
          result.push(`deployer.${app.name}.${deployer.id}=${deployers.controls[index].get(app.name).value}`);
        }
      });
    });

    // Dynamic Form
    [specificPlatform, global].forEach((arr, index) => {
      const keyStart = !index ? 'deployer' : 'app';
      arr.controls.forEach((line: UntypedFormGroup) => {
        if (!isEmpty(line.get('property'))) {
          const key = line.get('property').value;
          if (!isEmpty(line.get('global'))) {
            result.push(`${keyStart}.*.${key}=${line.get('global').value}`);
          }
          this.refBuilder.streamDeployConfig.apps.forEach(app => {
            if (!isEmpty(line.get(app.name))) {
              result.push(`${keyStart}.${app.name}.${key}=${line.get(app.name).value}`);
            }
          });
        }
      });
    });

    // Apps Version (appsVersion)
    this.refBuilder.streamDeployConfig.apps.forEach(app => {
      if (!isEmpty(appsVersion.get(app.name))) {
        result.push(`version.${app.name}=${appsVersion.get(app.name).value}`);
      }
      // App deployment props set via modal
      this.getDeploymentProperties(this.refBuilder.builderDeploymentProperties, app.name).forEach(keyValue => {
        result.push(`deployer.${app.name}.${keyValue.key.replace(/spring.cloud.deployer./, '')}=${keyValue.value}`);
      });
    });

    // Apps Properties
    Object.keys(this.refBuilder.builderAppsProperties).forEach((key: string) => {
      this.getAppProperties(this.refBuilder.builderAppsProperties, key).forEach(keyValue => {
        result.push(`app.${key}.${keyValue.key}=${keyValue.value}`);
      });
    });

    // Global deployment props set via modal
    this.getDeploymentProperties(this.refBuilder.builderDeploymentProperties).forEach(keyValue => {
      result.push(`deployer.*.${keyValue.key.replace(/spring.cloud.deployer./, '')}=${keyValue.value}`);
    });

    // Errors
    this.refBuilder.errors.global.forEach(error => {
      result.push(error);
    });
    this.refBuilder.errors.app.forEach(error => {
      result.push(error);
    });

    return result;
  }

  private updateFormArray(builder, array: UntypedFormArray, appKey: string, key: string, value): void {
    let group: UntypedFormGroup;
    const lines = array.controls.filter((formGroup: UntypedFormGroup) => key === formGroup.get('property').value);

    if (lines.length > 0) {
      group = lines[0] as UntypedFormGroup;
    } else {
      group = new UntypedFormGroup(
        {
          property: new UntypedFormControl('', [StreamDeployValidator.key]),
          global: new UntypedFormControl('')
        },
        {validators: StreamDeployValidator.keyRequired}
      );
      builder.streamDeployConfig.apps.forEach(app => {
        group.addControl(app.name, new UntypedFormControl(''));
      });
      array.push(group);
    }
    group.get('property').setValue(key);
    group.get(appKey === '*' ? 'global' : appKey).setValue(value);
  }

  /**
   * Populate values app
   */
  private populateApp(builder?: any): any {
    builder = builder || this.refBuilder;
    if (!builder) {
      return false;
    }
    builder.formGroup.get('global').controls = [];
    builder.errors.app = [];
    const appNames: Array<string> = builder.streamDeployConfig.apps.map((app, index) => {
      const appInfo = builder.streamDeployConfig.apps[index];
      builder.builderAppsProperties[app.name] =
        appInfo && appInfo.options
          ? (builder.builderAppsProperties[app.name] = appInfo.options.map(property => Object.assign({}, property)))
          : [];
      return app.name;
    });
    const add = (array: UntypedFormArray) => {
      const group = new UntypedFormGroup(
        {
          property: new UntypedFormControl('', [StreamDeployValidator.key]),
          global: new UntypedFormControl('')
        },
        {validators: StreamDeployValidator.keyRequired}
      );

      builder.streamDeployConfig.apps.forEach(app => {
        group.addControl(app.name, new UntypedFormControl(''));
      });
      array.push(group);
    };
    this.properties.forEach((line: string) => {
      const arr = line.split(/=(.*)/);
      const key = arr[0] as string;
      const value = arr[1] as string;
      const appKey = key.split('.')[1];
      if (StreamDeployService.app.is(key)) {
        const keyReduce = StreamDeployService.app.extract(key);
        if ((appKey !== '*' && appNames.indexOf(appKey) === -1) || keyReduce === '') {
          // Error: app not found
          builder.errors.app.push(line);
        } else {
          let free = true;
          if (appNames.indexOf(appKey) > -1) {
            const appProperties = builder.streamDeployConfig.apps[appNames.indexOf(appKey)];
            if (appProperties.options && !appProperties.optionsState.isInvalid) {
              const option = builder.builderAppsProperties[appKey].find(
                opt => opt.name === keyReduce || opt.id === keyReduce
              );
              if (option) {
                option.value = value;
                free = false;
              }
            }
          }
          if (free) {
            this.updateFormArray(
              builder,
              builder.formGroup.get('global') as UntypedFormArray,
              appKey,
              keyReduce,
              value
            );
          }
        }
      }
    });
    add(builder.formGroup.get('global'));
    return builder;
  }

  /**
   * Populate values
   */
  private populate(builder: any): void {
    this.refBuilder = builder;

    const appNames: Array<string> = builder.streamDeployConfig.apps.map(app => app.name);
    const deployerKeys: Array<string> = builder.streamDeployConfig.deployers.map(deployer => deployer.name);
    builder.errors.global = [];

    // we need to iterate twice to get a possible platform name set
    // as it's needed later and we don't control order of these properties
    this.properties.some((line: string) => {
      const arr = line.split(/=(.*)/);
      const key = arr[0] as string;
      const value = arr[1] as string;
      if (StreamDeployService.platform.is(key)) {
        builder.formGroup.get('platform').setValue(value);
        const platform = builder.streamDeployConfig.platform.values.find(p => p.name === value);
        builder.builderDeploymentProperties.global = [];
        builder.streamDeployConfig.apps.forEach((app: any) => {
          builder.builderDeploymentProperties.apps[app.name] = [];
        });
        if (platform) {
          platform.options.forEach(o => {
            builder.builderDeploymentProperties.global.push(Object.assign({isSemantic: true}, o));
            builder.streamDeployConfig.apps.forEach((app: any) => {
              builder.builderDeploymentProperties.apps[app.name].push(Object.assign({isSemantic: true}, o));
            });
          });
        }
        // got it, break from loop
        return true;
      }
      return false;
    });

    this.properties.forEach((line: string) => {
      const arr = line.split(/=(.*)/);
      const key = arr[0] as string;
      const value = arr[1] as string;
      const appKey = key.split('.')[1];
      if (StreamDeployService.platform.is(key)) {
        // consume but don't do anything, otherwise error is added
        // platform value is set in first iteration
      } else if (StreamDeployService.deployer.is(key)) {
        // Deployer
        const keyReduce = StreamDeployService.deployer.extract(key);
        if ((appKey !== '*' && appNames.indexOf(appKey) === -1) || keyReduce === '') {
          // Error: app not found / * not found
          builder.errors.global.push(line);
        } else {
          if (deployerKeys.indexOf(keyReduce) > -1) {
            builder.formGroup
              .get('deployers')
              .controls[deployerKeys.indexOf(keyReduce)].get(appKey === '*' ? 'global' : appKey)
              .setValue(value);
          } else {
            const keymatch = 'spring.cloud.deployer.' + keyReduce;
            // go through deployment properties for global and apps and
            // mark match if it looks property is handled by modal, otherwise
            // it belong to form array
            let match = false;
            if (key.indexOf('deployer.*.') > -1) {
              builder.builderDeploymentProperties.global.forEach(p => {
                if (keymatch === p.id) {
                  match = true;
                  p.value = value;
                }
              });
            } else if (key.indexOf('deployer.' + appKey + '.') > -1) {
              builder.builderDeploymentProperties.apps[appKey].forEach(p => {
                if (keymatch === p.id) {
                  match = true;
                  p.value = value;
                }
              });
            }

            if (!match) {
              this.updateFormArray(
                builder,
                builder.formGroup.get('specificPlatform') as UntypedFormArray,
                appKey,
                keyReduce,
                value
              );
            }
          }
        }
      } else if (StreamDeployService.version.is(key)) {
        // Version
        if (appNames.indexOf(appKey) === -1) {
          // Error: app not found
          builder.errors.global.push(line);
        } else {
          const app = this.refBuilder.streamDeployConfig.apps.find((appConfig: any) => appConfig.name === appKey);
          // Populate if it's not the default version
          if (!app || app.version !== value) {
            builder.formGroup.get('appsVersion').get(appKey).setValue(value);
          }
        }
      } else if (!StreamDeployService.app.is(key)) {
        // Invalid Key
        builder.errors.global.push(line);
      }
    });
    return builder;
  }

  /**
   * Build the Group Form
   */
  private build(streamDeployConfig: StreamDeployConfig): any {
    const formGroup: UntypedFormGroup = new UntypedFormGroup({});

    const getValue = defaultValue => (!defaultValue ? '' : defaultValue);
    const builderAppsProperties = {};
    const builderDeploymentProperties = {global: [], apps: {}};

    // Platform
    const platformControl = new UntypedFormControl(
      getValue(streamDeployConfig.platform.defaultValue),
      (formControl: UntypedFormControl) => {
        if (this.isErrorPlatform(streamDeployConfig.platform.values, formControl.value)) {
          return {invalid: true};
        }
        if (streamDeployConfig.platform.values.length > 1 && !formControl.value) {
          return {invalid: true};
        }
        return null;
      }
    );

    const defaultPlatform =
      streamDeployConfig.platform.values.length === 1 ? streamDeployConfig.platform.values[0] : null;

    const populateDeployerProperties = value => {
      builderDeploymentProperties.global = [];
      streamDeployConfig.apps.forEach((app: any) => {
        builderDeploymentProperties.apps[app.name] = [];
      });
      const platform = streamDeployConfig.platform.values.find(p => p.name === value);
      if (platform) {
        platform.options.forEach(o => {
          builderDeploymentProperties.global.push(Object.assign({isSemantic: true}, o));
          streamDeployConfig.apps.forEach((app: any) => {
            builderDeploymentProperties.apps[app.name].push(Object.assign({isSemantic: true}, o));
          });
        });
      }
    };

    if (defaultPlatform) {
      populateDeployerProperties(defaultPlatform.name);
    }

    platformControl.valueChanges.subscribe(value => {
      if (!defaultPlatform) {
        populateDeployerProperties(value);
      }
    });

    formGroup.addControl('platform', platformControl);

    // Deployers
    const deployers = new UntypedFormArray([]);
    streamDeployConfig.deployers.forEach((deployer: any) => {
      const groupDeployer: UntypedFormGroup = new UntypedFormGroup({});
      const validators = [];
      if (deployer.type === 'java.lang.Integer') {
        validators.push(StreamDeployValidator.number);
      }
      groupDeployer.addControl('global', new UntypedFormControl(getValue(deployer.defaultValue), validators));
      streamDeployConfig.apps.forEach((app: any) => {
        groupDeployer.addControl(app.name, new UntypedFormControl('', validators));
      });
      deployers.push(groupDeployer);
    });

    // Applications
    const appsVersion = new UntypedFormGroup({});
    streamDeployConfig.apps.forEach((app: any) => {
      builderAppsProperties[app.name] = [];
      const control = new UntypedFormControl(null, (formControl: UntypedFormControl) => {
        if (this.isErrorVersion(app, formControl.value)) {
          return {invalid: true};
        }
        return null;
      });
      control.valueChanges.subscribe(value => {
        builderAppsProperties[app.name] = [];
        if (this.isErrorVersion(app, value)) {
          app.optionsState.isInvalid = true;
          app.options = null;
          this.changeDetector.markForCheck();
        } else {
          app.optionsState.isInvalid = false;
          app.optionsState.isOnError = false;
          app.optionsState.isLoading = true;
          this.streamDeployService.appDetails(app.type, app.origin, value).subscribe(
            options => {
              app.options = options;
            },
            error => {
              app.options = [];
              app.optionsState.isOnError = true;
            },
            () => {
              app.optionsState.isLoading = false;
              this.changeDetector.markForCheck();
              this.populateApp();
            }
          );
        }
      });
      control.setValue(getValue(app.defaultValue));
      appsVersion.addControl(app.name, control);
    });

    // Useful methods for FormArray
    const add = (array: UntypedFormArray) => {
      const group = new UntypedFormGroup(
        {
          property: new UntypedFormControl('', [StreamDeployValidator.key]),
          global: new UntypedFormControl('')
        },
        {validators: StreamDeployValidator.keyRequired}
      );

      streamDeployConfig.apps.forEach(app => {
        group.addControl(app.name, new UntypedFormControl(''));
      });
      array.push(group);
    };
    const isEmpty = (dictionary): boolean => Object.entries(dictionary).every(a => a[1] === '');
    const clean = (val: Array<any>, array: UntypedFormArray) => {
      const toRemove = val
        .map((a, index) => (index < val.length - 1 && isEmpty(a) ? index : null))
        .filter(a => a != null);

      toRemove.reverse().forEach(a => {
        array.removeAt(a);
      });
      if (!isEmpty(val[val.length - 1])) {
        return add(array);
      }
    };

    // Dynamic App properties
    const globalControls: UntypedFormArray = new UntypedFormArray([]);
    add(globalControls);
    globalControls.valueChanges.subscribe((val: Array<any>) => {
      clean(val, globalControls);
    });

    // Dynamic Platform properties
    const specificPlatformControls: UntypedFormArray = new UntypedFormArray([]);
    add(specificPlatformControls);
    specificPlatformControls.valueChanges.subscribe((val: Array<any>) => {
      clean(val, specificPlatformControls);
    });

    formGroup.addControl('deployers', deployers);
    formGroup.addControl('appsVersion', appsVersion);
    formGroup.addControl('global', globalControls);
    formGroup.addControl('specificPlatform', specificPlatformControls);

    return {
      formGroup,
      builderAppsProperties,
      builderDeploymentProperties,
      streamDeployConfig,
      errors: {
        global: [],
        app: []
      }
    };
  }

  /**
   * Return true if the version is not invalid
   *
   * @param {any} app
   * @param {string} version
   * @returns {boolean}
   */
  isErrorVersion(app: any, version: string): boolean {
    return version !== '' && !app.versions.find(v => v.version === version);
  }

  /**
   * Return true if the builder is valid
   * @param builder
   * @returns {boolean}
   */
  isSubmittable(builder: any): boolean {
    if (!builder) {
      return false;
    }
    return builder.formGroup.valid;
  }

  /**
   * Return true if the platform is on error
   *
   * @param {Array<any>} platforms
   * @param {string} platform
   * @returns {boolean}
   */
  isErrorPlatform(platforms: Array<any>, platform: string): boolean {
    return (platform !== '' && !platforms.find(p => p.key === platform)) || (platform === '' && platforms.length > 1);
  }

  /**
   * Return true if the platform is invalid (invalid value)
   *
   * @param {Array<any>} platforms
   * @param {string} platform
   * @returns {boolean}
   */
  isInvalidPlatform(platforms: Array<any>, platform: string): boolean {
    return platform !== '' && !platforms.find(p => p.key === platform);
  }

  /**
   * Generate a tooltip
   *
   * @param streamDeployConfig
   * @param control
   * @returns {string}
   */
  tooltip(streamDeployConfig: any, control: AbstractControl): string {
    const arr = [];
    if (control instanceof UntypedFormGroup) {
      if (control.get('property')) {
        if (control.get('property') && control.get('property').invalid) {
          arr.push(this.translate.instant('streams.deploy.builder.tooltip.invalidProperty'));
        }
      }
      if (control.get('global') && control.get('global').invalid) {
        arr.push(this.translate.instant('streams.deploy.builder.tooltip.invalidGlobal'));
      }
      streamDeployConfig.apps.forEach(app => {
        if (control.get(app.name).invalid) {
          arr.push(this.translate.instant('streams.deploy.builder.tooltip.invalidField', {name: app.name}));
        }
      });
    } else {
    }
    return arr.join('<br />');
  }

  /**
   * Load the deployment properties of an app or global
   *
   * @param {{}} builderDeploymentProperties
   * @param {string} appId
   * @returns {Array}
   */
  getDeploymentProperties(
    builderDeploymentProperties: {global: any[]; apps: any},
    appId?: string
  ): Array<{key: string; value: any}> {
    const deploymentProperties = appId ? builderDeploymentProperties.apps[appId] : builderDeploymentProperties.global;
    if (!deploymentProperties) {
      return [];
    }

    return deploymentProperties
      .map((property: Properties.Property) => {
        if (
          property.value !== null &&
          property.value !== undefined &&
          property.value.toString() !== '' &&
          property.value !== property.defaultValue
        ) {
          return {
            key: `${property.id}`,
            value: property.value
          };
        }
        return null;
      })
      .filter(app => app !== null);
  }

  /**
   * Open Deployment Properties modal for an app or global
   *
   * @param builder
   * @param {string} appId
   * @param app
   */
  openDeploymentProperties(builder: any, appId?: string): void {
    const options = appId
      ? builder.builderDeploymentProperties.apps[appId]
      : builder.builderDeploymentProperties.global;

    // jee.foo.bar-xxx -> jee.foo
    const deduceKey = key => key.substring(0, key.lastIndexOf('.'));

    // grouping all properties by a deduced key
    const groupBy = (items, key) =>
      items.reduce((result, item) => {
        const groupKey = deduceKey(item[key]);
        return {
          ...result,
          [groupKey]: [...(result[groupKey] || []), item]
        };
      }, {});

    // setup groups and sort alphabetically by group titles
    let groupedPropertiesSources: Array<GroupPropertiesSource> = [];
    const groupedEntries: {[s: string]: Array<any>} = groupBy(options, 'id');
    Object.entries(groupedEntries).forEach(v => {
      const groupedPropertiesSource = new GroupPropertiesSource(
        Object.assign(
          [],
          v[1].map(property => Object.assign({}, property))
        ),
        v[0]
      );
      groupedPropertiesSources.push(groupedPropertiesSource);
    });
    groupedPropertiesSources = groupedPropertiesSources.sort((a, b) =>
      a.title === b.title ? 0 : a.title < b.title ? -1 : 1
    );
    const groupPropertiesSources = new GroupPropertiesSources(groupedPropertiesSources);

    // get new props from modal
    groupPropertiesSources.confirm.subscribe((properties: Array<any>) => {
      if (appId) {
        builder.builderDeploymentProperties.apps[appId] = properties;
      } else {
        builder.builderDeploymentProperties.global = properties;
      }
      this.changeDetector.markForCheck();
    });
    this.groupsPropertiesModal.setData(groupPropertiesSources);
    this.groupsPropertiesModal.title = this.translate.instant(
      'streams.deploy.builder.tooltip.deploymentPropertiesTitle'
    );
    this.groupsPropertiesModal.isOpen = true;
  }

  /**
   * Load the properties of an app
   *
   * @param {{}} builderAppsProperties
   * @param {string} appId
   * @returns {Array}
   */
  getAppProperties(builderAppsProperties: any, appId: string): Array<{key: string; value: any}> {
    const appProperties = builderAppsProperties[appId];
    if (!appProperties) {
      return [];
    }
    return appProperties
      .map((property: Properties.Property) => {
        if (
          property.value !== null &&
          property.value !== undefined &&
          property.value.toString() !== '' &&
          property.value !== property.defaultValue
        ) {
          if (property.id.startsWith(`${appId}.`)) {
            return {
              key: `${property.name}`,
              value: property.value
            };
          } else {
            return {
              key: `${property.id}`,
              value: property.value
            };
          }
        }
        return null;
      })
      .filter(app => app !== null);
  }

  /**
   * Open Application Properties modal
   *
   * @param builder
   * @param app
   */
  openApp(builder: any, app: any): void {
    const version = builder.formGroup.get('appsVersion').get(app.name).value || app.version;
    const options = builder.builderAppsProperties[app.name] ? builder.builderAppsProperties[app.name] : app.options;
    const appPropertiesSource = new AppPropertiesSource(
      Object.assign(
        [],
        options.map(property => Object.assign({}, property))
      )
    );
    appPropertiesSource.confirm.subscribe((properties: Array<any>) => {
      builder.builderAppsProperties[app.name] = properties;
      this.changeDetector.markForCheck();
    });
    this.appPropertiesModal.app = new App();
    this.appPropertiesModal.app.name = app.name;
    this.appPropertiesModal.app.type = app.type;
    this.appPropertiesModal.app.version = version;
    this.appPropertiesModal.setData(appPropertiesSource);
    this.appPropertiesModal.isOpen = true;
  }

  /**
   * Remove an error property
   */
  removeError(value: {type: string; index: number}): void {
    const errors = this.refBuilder.errors[value.type];
    if (errors[value.index]) {
      errors.splice(value.index, 1);
    }
    this.properties = this.getProperties();
  }

  /**
   * Emit a request deploy
   */
  deployStream(): void {
    if (!this.isSubmittable(this.refBuilder)) {
      this.notificationService.error(
        this.translate.instant('commons.message.invalidFieldsTitle'),
        this.translate.instant('commons.message.invalidFieldsContent')
      );
    } else {
      this.deploy.emit(this.getProperties());
    }
  }

  /**
   * Emit a request export
   */
  exportProps(): void {
    this.exportProperties.emit(this.getProperties());
  }

  /**
   * Copye to clipboard
   */
  copyToClipboard(): void {
    this.copyProperties.emit(this.getProperties());
  }
}
