import {Component, OnInit, OnDestroy, EventEmitter} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormGroup, FormControl, AbstractControl, FormArray} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {StreamDeployService} from './stream-deploy.service';
import {StreamDefinition} from '../model/stream-definition';
import {catchError, map, takeUntil} from 'rxjs/operators';
import {StreamDeployValidator} from './stream-deploy.validator';
import {StreamDeployConfig} from '../model/stream-deploy-config';
import {StreamsService} from '../streams.service';
import {Subject} from 'rxjs/Subject';
import {ToastyService} from 'ng2-toasty';
import {BusyService} from '../../shared/services/busy.service';
import {saveAs} from 'file-saver/FileSaver';
import {BsModalService} from 'ngx-bootstrap';
import {AppPropertiesSource, StreamDeployAppPropertiesComponent} from './app-properties/app-properties.component';
import {Properties} from 'spring-flo';

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
  templateUrl: './stream-deploy.component.html',
  styleUrls: ['styles.scss']
})
export class StreamDeployComponent implements OnInit, OnDestroy {

  /**
   * Busy Subscriptions
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Observable
   * Contain a config and a form group
   */
  config$: Observable<{
    builder: FormGroup,
    builderAppsProperties: {},
    file: FormGroup,
    free: FormGroup,
    config: StreamDeployConfig
  }>;

  /**
   * State of the context
   */
  state: any = {
    platform: true,
    deployer: true,
    app: true,
    specificPlatform: true,
    view: 'file'
  };

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {StreamsService} streamsService
   * @param {ToastyService} toastyService
   * @param {BusyService} busyService
   * @param {Router} router
   * @param bsModalService
   * @param {StreamDeployService} streamDeployService
   */
  constructor(private route: ActivatedRoute,
              private streamsService: StreamsService,
              private toastyService: ToastyService,
              private busyService: BusyService,
              private router: Router,
              private bsModalService: BsModalService,
              private streamDeployService: StreamDeployService) {
  }

  /**
   * Initialize compoment
   * Subscribe to route params and load a config for a stream
   */
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.config$ = this.streamDeployService
        .config(params.id)
        .pipe(catchError(val => {
          if (val === `Could not find stream definition named ${params.id}`) {
            this.router.navigate(['streams/definitions']);
          }
          return Observable.of(val);
        }))
        .pipe(map((value) => this.buildForm(value)));
    });
  }

  /**
   * Build a form group which contains all the controls
   */
  buildForm(config: StreamDeployConfig): {
    builder: FormGroup, builderAppsProperties: {}, free: FormGroup, file: FormGroup,
    config: StreamDeployConfig
  } {
    const groups = new FormGroup({});
    const getValue = (defaultValue) => !defaultValue ? '' : defaultValue;
    const builderAppsProperties = {};

    // Platform
    if (config.skipper) {
      groups.addControl('platform', new FormControl(getValue(config.platform.defaultValue),
        (formControl: FormControl) => {
          if (formControl.value && !config.platformExist(formControl.value)) {
            return {invalid: true};
          }
          return null;
        }));
    }

    // Deployers
    const deployers = new FormArray([]);
    config.deployers.forEach((deployer: any) => {
      const groupDeployer: FormGroup = new FormGroup({});
      const validators = [];
      if (deployer.type === 'java.lang.Integer') {
        validators.push(StreamDeployValidator.number);
      }
      groupDeployer.addControl('global', new FormControl(getValue(deployer.defaultValue), validators));
      config.apps.forEach((app: any) => {
        groupDeployer.addControl(app.name, new FormControl('', validators));
      });
      deployers.push(groupDeployer);
    });

    // Applications
    const appsVersion = new FormGroup({});
    config.apps.forEach((app: any) => {
      builderAppsProperties[app.name] = null;
      const control = new FormControl(null);
      control.valueChanges.subscribe((value) => {
        builderAppsProperties[app.name] = null;
        app.optionsState.isOnError = false;
        app.optionsState.isLoading = true;
        this.streamDeployService.app(app.type, app.origin, value).subscribe((options) => {
          app.options = options;
          app.optionsState.isLoading = false;
        }, (error) => {
          app.optionsState.isLoading = false;
          app.optionsState.isOnError = true;
        });
      });

      control.setValue(getValue(app.defaultValue));
      appsVersion.addControl(app.name, control);
    });

    // Useful methods for FormArray
    const add = (array: FormArray) => {
      const group = new FormGroup({
        'property': new FormControl('', [StreamDeployValidator.key]),
        'global': new FormControl('')
      });
      config.apps.forEach((app) => {
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

    groups.addControl('deployers', deployers);
    groups.addControl('appsVersion', appsVersion);
    groups.addControl('global', globalControls);
    groups.addControl('specificPlatform', specificPlatformControls);

    // Free File Text
    const fileGroup = new FormGroup({
      file: new FormControl(),
      properties: new FormControl('', StreamDeployValidator.properties)
    });

    // Free Text
    const freeGroup = new FormGroup({
      file: new FormControl(),
      properties: new FormControl('', StreamDeployValidator.properties)
    });

    return {
      builder: groups,
      builderAppsProperties: builderAppsProperties,
      free: freeGroup,
      file: fileGroup,
      config: config
    };
  }

  /**
   * Get properties raw
   *
   * @param value
   */
  toRaw(value: {
    builder: FormGroup, builderAppsProperties: {}, free: FormGroup, file: FormGroup,
    config: StreamDeployConfig
  }): Array<{ key: string, value: string, status: string }> {

    let result = [];
    const isEmpty = (control: AbstractControl) => !control || (control.value === '' || control.value === null);
    const status = (controls: AbstractControl[]): string =>
      controls.every((a) => !a.invalid) ? 'valid' : 'invalid';

    if (!value.config.skipper) {
      result = value.free.get('properties').value
        .toString()
        .split('\n')
        .filter((a) => a)
        .map((line) => {
          const arr = line
            .toString()
            .split('=');

          return (arr.length === 2) ? {
            key: arr[0],
            value: arr[1],
            status: 'valid'
          } : null;
        }).filter((a) => a);
    } else {

      if (this.state.view === 'builder') {
        const deployers: FormArray = value.builder.get('deployers') as FormArray;
        const appsVersion: FormGroup = value.builder.get('appsVersion') as FormGroup;
        const global: FormArray = value.builder.get('global') as FormArray;
        const specificPlatform: FormArray = value.builder.get('specificPlatform') as FormArray;

        // Platform
        if (!isEmpty(value.builder.get('platform'))) {
          result.push({
            key: 'spring.cloud.dataflow.skipper.platformName',
            value: value.builder.get('platform').value,
            status: 'valid'
          });
        }

        // Deployers
        value.config.deployers.forEach((deployer, index) => {
          if (!isEmpty(deployers.controls[index].get('global'))) {
            result.push({
              key: `deployer.*.${deployer.id}`,
              value: deployers.controls[index].get('global').value,
              status: status([deployers.controls[index].get('global')])
            });
          }
          value.config.apps.forEach((app) => {
            if (!isEmpty(deployers.controls[index].get(app.name))) {
              result.push({
                key: `deployer.${app.name}.${deployer.id}`,
                value: deployers.controls[index].get(app.name).value,
                status: status([deployers.controls[index].get(app.name)])
              });
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
                result.push({
                  key: `${keyStart}.*.${key}`,
                  value: line.get('global').value,
                  status: status([line.get('property'), line.get('global')])
                });
              }
              value.config.apps.forEach((app) => {
                if (!isEmpty(line.get(app.name))) {
                  result.push({
                    key: `${keyStart}.${app.name}.${key}`,
                    value: line.get(app.name).value,
                    status: status([line.get('property'), line.get(app.name)])
                  });
                }
              });
            }
          });
        });

        // Apps Version (appsVersion)
        value.config.apps.forEach((app) => {
          if (!isEmpty(appsVersion.get(app.name))) {
            result.push({
              key: `version.${app.name}`,
              value: appsVersion.get(app.name).value,
              status: 'valid'
            });
          }
        });

        // Apps Properties
        Object.keys(value.builderAppsProperties).forEach((key: string) => {
          this.getAppProperties(value.builderAppsProperties, key).forEach((keyValue) => {
            result.push({
              key: `app.${key}.${keyValue.key}`,
              value: keyValue.value,
              status: 'valid'
            });
          });
        });

      } else {
        if (!isEmpty(value.file.get('properties'))) {
          value.file.get('properties').value
            .toString()
            .split('\n')
            .map((a) => a.trim())
            .filter((a) => a.toString())
            .map((a: String) => {
              const tmp = a.split('=');
              if (tmp.length === 2) {
                const control = new FormControl(tmp[0]);
                result.push({
                  key: tmp[0],
                  value: tmp[1],
                  status: (StreamDeployValidator.keyProperty(control) === null) ? 'valid' : 'invalid'
                });
              } else {
                result.push({
                  key: a,
                  status: 'invalid'
                });
              }
            });
        }
      }
    }

    return result;
  }

  /**
   * Get the details of an line error
   *
   * @param {StreamDeployConfig} config
   * @param {FormGroup} builder
   * @returns {string}
   */
  tooltip(config: StreamDeployConfig, builder: FormGroup) {
    const arr = [];
    if (builder.get('property')) {
      if (builder.get('property').invalid) {
        arr.push(`The field "property" is not valid.`);
      }
    }
    if (builder.get('global').invalid) {
      arr.push(`The field "global" is not valid.`);
    }
    config.apps.forEach((app) => {
      if (builder.get(app.name).invalid) {
        arr.push(`The field "${app.name}" is not valid.`);
      }
    });
    return arr.join('<br />');
  }

  /**
   * Parse and load a file to the properties control
   *
   * @param {FormGroup} formGroup
   * @param {Blob} contents File
   */
  fileChange(formGroup: FormGroup, contents) {
    try {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        formGroup.get('properties').setValue(reader.result);
        formGroup.get('file').setValue('');
      };
      reader.readAsText(contents.target.files[0]);
    } catch (e) {
    }
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Requests a stream deployment for the {@link StreamDefinition}.
   *
   * @param value
   */
  deployDefinition(value: {
    builder: FormGroup, builderAppsProperties: any, file: FormGroup,
    free: FormGroup, config: StreamDeployConfig
  }) {
    const propertiesMap = {};
    this.toRaw(value).forEach((line) => {
      propertiesMap[line.key] = line.value;
    });
    const busy = this.streamsService.deployDefinition(value.config.id, propertiesMap)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        data => {
          this.toastyService.success('Successfully deployed stream definition "'
            + value.config.id + '"');
          this.router.navigate(['streams/definitions']);
        },
        error => {
          this.toastyService.error(error.message !== null ? error.message : error);
        }
      );
    this.busyService.addSubscription(busy);
  }

  /**
   * Set App properties
   *
   * @param config
   * @param versions
   * @param app
   */
  setAppProperties(config: any, app: any) {
    const builderAppsProperties = config.builderAppsProperties;
    const version = config.builder.get('appsVersion').get(app.name).value || app.version;
    const options = builderAppsProperties[app.name] ? builderAppsProperties[app.name] : app.options;
    const modal = this.bsModalService.show(StreamDeployAppPropertiesComponent);

    modal.content.title = `Properties for ${app.name} (${version})`;
    const appPropertiesSource = new AppPropertiesSource(Object.assign([], options
      .map((property) => Object.assign({}, property))));

    appPropertiesSource.confirm.subscribe((properties: Array<any>) => {
      builderAppsProperties[app.name] = properties;
    });
    modal.content.setData(appPropertiesSource);
  }

  getAppProperties(builderAppsProperties: {}, appId: string): Array<{ key: string, value: string }> {
    const appProperties = builderAppsProperties[appId];
    if (!appProperties) {
      return [];
    }
    return appProperties.map((property: Properties.Property) => {
      return (property.value !== undefined && property.value.toString() !== '' && property.value !== property.defaultValue) ? ({
        key: `${property.name}`,
        value: property.value
      }) : null;
    }).filter((app) => app !== null);
  }

  /**
   * Export the builder to a TXT file
   *
   * @param value
   */
  exportBuilderToFile(value: {
    builder: FormGroup, builderAppsProperties: any,
    free: FormGroup, file: FormGroup, config: StreamDeployConfig
  }) {
    const propertiesString = this.toRaw(value).map((a) => `${a.key}=${a.value}`).join('\n');
    const filename = `${value.config.id}.${new Date().getTime()}.txt`;
    const blob = new Blob([propertiesString], {type: 'text/plain'});
    saveAs(blob, filename);
  }

}
