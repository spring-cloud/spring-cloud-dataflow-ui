import { Injectable } from '@angular/core';
import { StreamsService } from '../streams.service';
import { Parser } from '../../shared/services/parser';
import { ApplicationType } from '../../shared/model/application-type';
import { SharedAppsService } from '../../shared/services/shared-apps.service';
import { AppVersion } from '../../shared/model/app-version';
import { AppsService } from '../../apps/apps.service';
import {
  DetailedAppRegistration,
  ConfigurationMetadataProperty
} from '../../shared/model/detailed-app-registration.model';
import { StreamDeployConfig } from '../model/stream-deploy-config';
import { Utils } from '../../shared/flo/support/utils';
import { map, mergeMap } from 'rxjs/operators';
import { StreamDefinition } from '../model/stream-definition';
import { Observable, forkJoin, of } from 'rxjs';
import { Platform } from '../../shared/model/platform';

/**
 * Provides {@link StreamDeployConfig} related services.
 *
 * @author Damien Vitrac
 * @author Janne Valkealahti
 */
@Injectable()
export class StreamDeployService {

  /**
   * Platform key validation
   */
  public static platform = {
    is: (key: string): boolean => {
      return /^(spring.cloud.dataflow.skipper.platformName)$/.test(key);
    }
  };

  /**
   * Deployer key validation
   */
  public static deployer = {
    keyEdit: 'spring.cloud.deployer.',
    is: (key: string): boolean => {
      return /^(deployer.)/.test(key);
    },
    extract: (key: string): string => {
      const result = key.split('.');
      if (result.length < 3) {
        return '';
      }
      return result.slice(2, result.length)
        .join('.');
    },
  };

  /**
   * Version key validation
   */
  public static version = {
    keyEdit: 'version',
    is: (key: string): boolean => {
      return /^(version.)/.test(key);
    }
  };

  /**
   * App key validation
   */
  public static app = {
    is: (key: string): boolean => {
      return /^(app.)/.test(key);
    },
    extract: (key: string): string => {
      const result = key.split('.');
      if (result.length < 3) {
        return '';
      }
      return result.slice(2, result.length)
        .join('.');
    }
  };

  /**
   * Constructor
   *
   * @param {StreamsService} streamsService
   * @param {SharedAppsService} sharedAppsService
   * @param {AppsService} appsService
   */
  constructor(private streamsService: StreamsService,
              private sharedAppsService: SharedAppsService,
              private appsService: AppsService) {
  }

  /**
   * Provide an observable of {@link StreamDeployConfig} for an ID stream passed in parameter
   *
   * @param {string} id Stream ID
   * @returns {Observable<StreamDeployConfig>}
   */
  config(id: string): Observable<StreamDeployConfig> {
    return this.streamsService.getDefinition(id)
      .pipe(
        mergeMap(
          (val: StreamDefinition) => {
            const observablesApplications = Parser.parse(val.dslText as string, 'stream')
              .lines[0].nodes
              .map((node) => {
                  return of({
                    origin: node['name'],
                    name: node['label'] || node['name'],
                    type: node.type.toString(),
                    version: null,
                    options: null
                  }).pipe(
                    mergeMap(
                      (val1: any) => this.appsService.getAppVersions(ApplicationType[node.type], val1.origin)
                        .pipe(map((val2: AppVersion[]) => {
                          val1.versions = val2;
                          const current = val2.find((a: AppVersion) => a.defaultVersion);
                          if (current) {
                            val1.version = current.version;
                          }
                          return val1;
                        }))
                    ));
                }
              );
            return forkJoin([this.streamsService.getPlatforms(), ...observablesApplications])
              .pipe(
                map((val2) => ({
                    streamDefinition: val,
                    args: val2,
                  })
                ));
          }
        ))
      .pipe(map((result) => {
        const config = new StreamDeployConfig();
        config.id = id;

        // Platform
        const platforms = result.args[0] as Platform[];
        (result.args as Array<any>).splice(0, 1);
        config.platform = {
          id: 'platform',
          name: 'platform',
          form: 'select',
          type: 'java.lang.String',
          defaultValue: '',
          values: platforms.map((platform: Platform) => {
            return {
              key: platform.name,
              name: platform.name,
              type: platform.type,
              options: platform.options
            };
          })
        };

        // Applications
        config.apps = (result.args as Array<any>).map((app: any) => ({
          origin: app.origin,
          name: app.name,
          type: app.type,
          version: app.version,
          versions: app.versions,
          options: null,
          optionsState: {
            isLoading: false,
            isOnError: false,
            isInvalid: false
          }
        }));

        // Deployers
        config.deployers = [
          {
            id: 'memory',
            name: 'memory',
            form: 'autocomplete',
            type: 'java.lang.Integer',
            value: null,
            defaultValue: null,
            suffix: 'MB'
          },
          {
            id: 'cpu',
            name: 'cpu',
            form: 'autocomplete',
            type: 'java.lang.Integer',
            value: null,
            defaultValue: null,
            suffix: 'Core(s)'
          },
          {
            id: 'disk',
            name: 'disk',
            form: 'autocomplete',
            type: 'java.lang.Integer',
            value: null,
            defaultValue: null,
            suffix: 'MB'
          },
          {
            id: 'count',
            name: 'count',
            form: 'autocomplete',
            type: 'java.lang.Integer',
            value: null,
            defaultValue: null
          },
        ];
        return config;
      }));
  }

  /**
   * Provide an observable of {@link StreamDeployConfig}
   * Work around: copy code from Flo Project to inject options for select value
   *
   * @param {ApplicationType} type
   * @param {string} name
   * @param {string} version
   * @returns {Observable<Array<any>>}
   */
  appDetails(type: ApplicationType, name: string, version: string): Observable<Array<any>> {
    return this.sharedAppsService.getAppInfo(type, name, version)
      .pipe(map((app: DetailedAppRegistration) => {
        return app.options
          .map((option: ConfigurationMetadataProperty) => {
            const opt = {
              id: option.id,
              name: option.name,
              description: option.description,
              shortDescription: option.shortDescription,
              deprecation: option.deprecation,
              sourceType: option.sourceType,
              isDeprecated: option.isDeprecated,
              type: option.type,
              defaultValue: option.defaultValue,
              isSemantic: true
            };
            if (opt.sourceType === Utils.SCRIPTABLE_TRANSFORM_SOURCE_TYPE) {
              switch (opt.name.toLowerCase()) {
                case 'language':
                  opt['valueOptions'] = [
                    'groovy', 'javascript', 'ruby', 'python'
                  ];
                  break;
                case 'script':
                  opt['code'] = {
                    langPropertyName: 'scriptable-transformer.language'
                  };
                  break;
              }
            } else if (opt.sourceType === Utils.RX_JAVA_PROCESSOR_SOURCE_TYPE) {
              if (opt.name.toLowerCase() === 'code') {
                opt['code'] = {
                  language: 'java'
                };
              }
            }
            if (opt.type) {
              switch (opt.type) {
                case 'java.util.concurrent.TimeUnit':
                  opt['valueOptions'] = [
                    'NANOSECONDS',
                    'MICROSECONDS',
                    'MILLISECONDS',
                    'SECONDS',
                    'MINUTES',
                    'HOURS',
                    'DAYS'
                  ];
              }
            }
            return opt;
          });
      }));
  }

  /**
   * Clean value properties
   * @param {string} value
   * @returns {any}
   */
  cleanValueProperties(value: string) {
    if ((value && value.length > 1 && value.startsWith('"') && value.endsWith('"'))) {
      return value.substring(1, value.length - 1);
    }
    if ((value && value.length > 1 && value.startsWith('\'') && value.endsWith('\''))) {
      return value.substring(1, value.length - 1);
    }
    return value;
  }

}
