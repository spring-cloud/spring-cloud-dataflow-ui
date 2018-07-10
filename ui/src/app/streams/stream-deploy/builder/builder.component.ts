import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit,
  Output
} from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { StreamDeployService } from '../stream-deploy.service';
import { map } from 'rxjs/operators';
import { StreamDeployConfig } from '../../model/stream-deploy-config';
import { Observable } from 'rxjs/Observable';
import { StreamDeployValidator } from '../stream-deploy.validator';
import { AppPropertiesSource, StreamDeployAppPropertiesComponent } from '../app-properties/app-properties.component';
import { BsModalService } from 'ngx-bootstrap';
import { Properties } from 'spring-flo';

/**
 * TODO
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-deploy-builder',
  templateUrl: 'builder.component.html',
  styleUrls: ['styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamDeployBuilderComponent implements OnInit, OnDestroy {

  /**
   * Stream ID
   */
  @Input() id: string;

  /**
   * Skipper
   */
  @Input() skipper: boolean;

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
   * Properties to load
   */
  @Input() properties: Array<string> = [];

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

  constructor(private streamDeployService: StreamDeployService,
              private changeDetector: ChangeDetectorRef,
              private bsModalService: BsModalService) {
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.builder$ = this.streamDeployService
      .config(this.id, this.skipper)
      .pipe(map((streamDeployConfig) => this.build(streamDeployConfig)))
      .pipe(map((builder) => this.populate(builder)))
      .pipe(map((builder) => this.populateApp(builder)));
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.update.emit(this.getProperties());
  }

  /**
   * Return an array of properties
   * @returns {Array<string>}
   */
  private getProperties(): Array<string> {
    const result: Array<string> = [];
    const isEmpty = (control: AbstractControl) => !control || (control.value === '' || control.value === null);
    const deployers: FormArray = this.refBuilder.formGroup.get('deployers') as FormArray;
    const appsVersion: FormGroup = this.refBuilder.formGroup.get('appsVersion') as FormGroup;
    const global: FormArray = this.refBuilder.formGroup.get('global') as FormArray;
    const specificPlatform: FormArray = this.refBuilder.formGroup.get('specificPlatform') as FormArray;

    // Platform
    if (!isEmpty(this.refBuilder.formGroup.get('platform'))) {
      result.push(`spring.cloud.dataflow.skipper.platformName=${this.refBuilder.formGroup.get('platform').value}`);
    }

    // Deployers
    this.refBuilder.streamDeployConfig.deployers.forEach((deployer, index) => {
      if (!isEmpty(deployers.controls[index].get('global'))) {
        result.push(`deployer.*.${deployer.id}=${deployers.controls[index].get('global').value}`);
      }
      this.refBuilder.streamDeployConfig.apps.forEach((app) => {
        if (!isEmpty(deployers.controls[index].get(app.name))) {
          result.push(`deployer.${app.name}.${deployer.id}=${deployers.controls[index].get(app.name).value}`);
        }
      });
    });

    // Dynamic Form
    [specificPlatform, global].forEach((arr, index) => {
      const keyStart = (!index) ? 'deployer' : 'app';
      arr.controls.forEach((line: FormGroup) => {
        if (!isEmpty(line.get('property'))) {
          const key = line.get('property').value;
          if (!isEmpty(line.get('global'))) {
            result.push(`${keyStart}.*.${key}=${line.get('global').value}`);
          }
          this.refBuilder.streamDeployConfig.apps.forEach((app) => {
            if (!isEmpty(line.get(app.name))) {
              result.push(`${keyStart}.${app.name}.${key}=${line.get(app.name).value}`);
            }
          });
        }
      });
    });

    // Apps Version (appsVersion)
    this.refBuilder.streamDeployConfig.apps.forEach((app) => {
      if (!isEmpty(appsVersion.get(app.name))) {
        result.push(`version.${app.name}=${appsVersion.get(app.name).value}`);
      }
    });

    // Apps Properties
    Object.keys(this.refBuilder.builderAppsProperties).forEach((key: string) => {
      this.getAppProperties(this.refBuilder.builderAppsProperties, key).forEach((keyValue) => {
        result.push(`app.${key}.${keyValue.key}=${keyValue.value}`);
      });
    });

    // Errors
    this.refBuilder.errors.global.forEach((error) => {
      result.push(error);
    });
    this.refBuilder.errors.app.forEach((error) => {
      result.push(error);
    });

    return result;
  }

  private updateFormArray(builder, array: FormArray, appKey: string, key: string, value) {
    let group: FormGroup;
    const lines = array.controls
      .filter((formGroup: FormGroup) => key === formGroup.get('property').value);

    if (lines.length > 0) {
      group = lines[0] as FormGroup;
    } else {
      group = new FormGroup({
        'property': new FormControl('', [StreamDeployValidator.key]),
        'global': new FormControl('')
      }, { validators: StreamDeployValidator.keyRequired });
      builder.streamDeployConfig.apps.forEach((app) => {
        group.addControl(app.name, new FormControl(''));
      });
      array.push(group);
    }
    group.get('property').setValue(key);
    group.get(appKey === '*' ? 'global' : appKey).setValue(value);
  }

  /**
   * Populate values app
   */
  private populateApp(builder?: any) {
    builder = builder || this.refBuilder;
    builder.formGroup.get('global').controls = [];
    builder.errors.app = [];
    const appNames: Array<string> = builder.streamDeployConfig.apps.map((app, index) => {
      const appInfo = builder.streamDeployConfig.apps[index];
      builder.builderAppsProperties[app.name] = (appInfo && appInfo.options)
        ? builder.builderAppsProperties[app.name] = appInfo.options
          .map((property) => Object.assign({}, property))
        : [];
      return app.name;
    });
    const add = (array: FormArray) => {
      const group = new FormGroup({
        'property': new FormControl('', [StreamDeployValidator.key]),
        'global': new FormControl('')
      }, { validators: StreamDeployValidator.keyRequired });

      builder.streamDeployConfig.apps.forEach((app) => {
        group.addControl(app.name, new FormControl(''));
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
              const option = builder.builderAppsProperties[appKey].find(opt => {
                return opt.name === keyReduce || opt.id === keyReduce;
              });
              if (option) {
                option.value = value;
                free = false;
              }
            }
          }
          if (free) {
            this.updateFormArray(builder, builder.formGroup.get('global') as FormArray, appKey, keyReduce, value);
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
  private populate(builder) {
    this.refBuilder = builder;
    const appNames: Array<string> = builder.streamDeployConfig.apps.map(app => app.name);
    const deployerKeys: Array<string> = builder.streamDeployConfig.deployers.map(deployer => deployer.name);
    builder.errors.global = [];
    this.properties.forEach((line: string) => {
      const arr = line.split(/=(.*)/);
      const key = arr[0] as string;
      const value = arr[1] as string;
      const appKey = key.split('.')[1];
      if (StreamDeployService.platform.is(key)) {
        if (this.skipper) {
          builder.formGroup.get('platform').setValue(value);
        } else {
          builder.errors.global.push(line);
        }
      } else if (StreamDeployService.deployer.is(key)) {
        // Deployer
        const keyReduce = StreamDeployService.deployer.extract(key);
        if ((appKey !== '*' && appNames.indexOf(appKey) === -1) || keyReduce === '') {
          // Error: app not found / * not found
          builder.errors.global.push(line);
        } else {
          if (deployerKeys.indexOf(keyReduce) > -1) {
            builder.formGroup.get('deployers')
              .controls[deployerKeys.indexOf(keyReduce)]
              .get(appKey === '*' ? 'global' : appKey).setValue(value);
          } else {
            this.updateFormArray(builder, builder.formGroup.get('specificPlatform') as FormArray, appKey,
              keyReduce, value);
          }
        }
      } else if (StreamDeployService.version.is(key)) {
        // Version
        if (appNames.indexOf(appKey) === -1) {
          // Error: app not found
          builder.errors.global.push(line);
        } else {
          const app = this.refBuilder.streamDeployConfig.apps.find((app_: any) => app_.name === appKey);
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
  private build(streamDeployConfig: StreamDeployConfig) {
    const formGroup: FormGroup = new FormGroup({});

    const getValue = (defaultValue) => !defaultValue ? '' : defaultValue;
    const builderAppsProperties = {};

    // Platform
    if (this.skipper) {
      formGroup.addControl('platform', new FormControl(getValue(streamDeployConfig.platform.defaultValue),
        (formControl: FormControl) => {
          if (this.isErrorPlatform(streamDeployConfig.platform.values, formControl.value)) {
            return { invalid: true };
          }
          return null;
        }));
    }

    // Deployers
    const deployers = new FormArray([]);
    streamDeployConfig.deployers.forEach((deployer: any) => {
      const groupDeployer: FormGroup = new FormGroup({});
      const validators = [];
      if (deployer.type === 'java.lang.Integer') {
        validators.push(StreamDeployValidator.number);
      }
      groupDeployer.addControl('global', new FormControl(getValue(deployer.defaultValue), validators));
      streamDeployConfig.apps.forEach((app: any) => {
        groupDeployer.addControl(app.name, new FormControl('', validators));
      });
      deployers.push(groupDeployer);
    });

    // Applications
    const appsVersion = new FormGroup({});
    streamDeployConfig.apps.forEach((app: any) => {
      builderAppsProperties[app.name] = [];
      const control = new FormControl(null,
        (formControl: FormControl) => {
          if (this.isErrorVersion(app, formControl.value)) {
            return { invalid: true };
          }
          return null;
        });
      control.valueChanges.subscribe((value) => {
        builderAppsProperties[app.name] = [];
        if (this.isErrorVersion(app, value)) {
          app.optionsState.isInvalid = true;
          app.options = null;
          this.changeDetector.markForCheck();
        } else {
          app.optionsState.isInvalid = false;
          app.optionsState.isOnError = false;
          app.optionsState.isLoading = true;
          this.streamDeployService.appDetails(app.type, app.origin, value).subscribe((options) => {
            app.options = options;
          }, (error) => {
            app.options = [];
            app.optionsState.isOnError = true;
          }, () => {
            app.optionsState.isLoading = false;
            this.changeDetector.markForCheck();
            this.populateApp();
          });
        }
      });
      control.setValue(getValue(app.defaultValue));
      appsVersion.addControl(app.name, control);
    });

    // Useful methods for FormArray
    const add = (array: FormArray) => {
      const group = new FormGroup({
        'property': new FormControl('', [StreamDeployValidator.key]),
        'global': new FormControl('')
      }, { validators: StreamDeployValidator.keyRequired });

      streamDeployConfig.apps.forEach((app) => {
        group.addControl(app.name, new FormControl(''));
      });
      array.push(group);
    };
    const isEmpty = (dictionary): boolean => Object.entries(dictionary).every((a) => a[1] === '');
    const clean = (val: Array<any>, array: FormArray) => {
      const toRemove = val.map((a, index) =>
        ((index < (val.length - 1) && isEmpty(a)) ? index : null)).filter((a) => a != null);

      toRemove.reverse().forEach((a) => {
        array.removeAt(a);
      });
      if (!isEmpty(val[val.length - 1])) {
        return add(array);
      }
    };

    // Dynamic App properties
    const globalControls: FormArray = new FormArray([]);
    add(globalControls);
    globalControls.valueChanges.subscribe((val: Array<any>) => {
      clean(val, globalControls);
    });

    // Dynamic Platform properties
    const specificPlatformControls: FormArray = new FormArray([]);
    add(specificPlatformControls);
    specificPlatformControls.valueChanges.subscribe((val: Array<any>) => {
      clean(val, specificPlatformControls);
    });

    formGroup.addControl('deployers', deployers);
    formGroup.addControl('appsVersion', appsVersion);
    formGroup.addControl('global', globalControls);
    formGroup.addControl('specificPlatform', specificPlatformControls);

    return {
      formGroup: formGroup,
      builderAppsProperties: builderAppsProperties,
      streamDeployConfig: streamDeployConfig,
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
  isSubmittable(builder): boolean {
    return builder.formGroup.valid;
  }

  /**
   * Return true if the platform is not valid
   *
   * @param {Array<any>} platforms
   * @param {string} platform
   * @returns {boolean}
   */
  isErrorPlatform(platforms: Array<any>, platform: string): boolean {
    return platform !== '' && !platforms.find(p => p.key === platform);
  }

  /**
   * Generate a tooltip
   *
   * @param streamDeployConfig
   * @param control
   * @returns {string}
   */
  tooltip(streamDeployConfig, control: AbstractControl): string {
    const arr = [];
    if (control instanceof FormGroup) {
      if (control.get('property')) {
        if (control.get('property') && control.get('property').invalid) {
          arr.push(`The field "property" is not valid.`);
        }
      }
      if (control.get('global') && control.get('global').invalid) {
        arr.push(`The field "global" is not valid.`);
      }
      streamDeployConfig.apps.forEach((app) => {
        if (control.get(app.name).invalid) {
          arr.push(`The field "${app.name}" is not valid.`);
        }
      });
    } else {

    }
    return arr.join('<br />');
  }

  /**
   * Load the properties of an app
   *
   * @param {{}} builderAppsProperties
   * @param {string} appId
   * @returns {Array}
   */
  getAppProperties(builderAppsProperties: {}, appId: string): Array<{ key: string, value: string }> {
    const appProperties = builderAppsProperties[appId];
    if (!appProperties) {
      return [];
    }
    return appProperties.map((property: Properties.Property) => {
      if (property.value && property.value !== undefined && property.value.toString() !== ''
        && property.value !== property.defaultValue) {
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
    }).filter((app) => app !== null);
  }

  /**
   * Open Application Properties modal
   *
   * @param builder
   * @param app
   */
  openApp(builder, app: any) {
    const version = builder.formGroup.get('appsVersion').get(app.name).value || app.version;
    const options = builder.builderAppsProperties[app.name] ? builder.builderAppsProperties[app.name] : app.options;
    const modal = this.bsModalService.show(StreamDeployAppPropertiesComponent);

    modal.content.title = `Properties for ${app.name}`;
    if (version) {
      modal.content.title += ` (${version})`;
    }
    const appPropertiesSource = new AppPropertiesSource(Object.assign([], options
      .map((property) => Object.assign({}, property))));

    appPropertiesSource.confirm.subscribe((properties: Array<any>) => {
      builder.builderAppsProperties[app.name] = properties;
      this.changeDetector.markForCheck();
    });
    modal.content.setData(appPropertiesSource);
  }

  /**
   * Remove an error property
   */
  removeError(value: { type: string, index: number }) {
    const errors = this.refBuilder.errors[value.type];
    if (errors[value.index]) {
      errors.splice(value.index, 1);
    }
    this.properties = this.getProperties();
  }

  /**
   * Emit a request deploy
   */
  deployStream() {
    this.deploy.emit(this.getProperties());
  }

  /**
   * Emit a request export
   */
  exportProps() {
    this.exportProperties.emit(this.getProperties());
  }

}
