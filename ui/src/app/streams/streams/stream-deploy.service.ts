import { Injectable } from '@angular/core';
import { StreamService } from '../../shared/api/stream.service';
import { AppService } from '../../shared/api/app.service';
import { Stream, StreamDeployConfig } from '../../shared/model/stream.model';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { App, ApplicationType } from '../../shared/model/app.model';
import { Platform } from '../../shared/model/platform.model';
import { ConfigurationMetadataProperty, DetailedApp } from '../../shared/model/detailed-app.model';
import { Utils } from '../../flo/shared/support/utils';
import get from 'lodash.get';
import set from 'lodash.set';
import { ParserService } from '../../flo/shared/service/parser.service';

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
      return /^(spring\.cloud\.dataflow\.skipper\.platformName)$/.test(key);
    }
  };

  /**
   * Deployer key validation
   */
  public static deployer = {
    keyEdit: 'spring.cloud.deployer.',
    is: (key: string): boolean => {
      return /^(deployer\.)/.test(key);
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
      return /^(version\.)/.test(key);
    }
  };

  /**
   * App key validation
   */
  public static app = {
    is: (key: string): boolean => {
      return /^(app\.)/.test(key);
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

  constructor(private streamService: StreamService,
              private appService: AppService,
              private parserService: ParserService) {
  }

  /**
   * Provide an observable of {@link StreamDeployConfig} for an ID stream passed in parameter
   *
   * @param {string} id Stream ID
   * @returns {Observable<StreamDeployConfig>}
   */
  config(id: string): Observable<StreamDeployConfig> {
    return this.streamService.getStream(id)
      .pipe(
        mergeMap(
          (val: Stream) => {
            const observablesApplications = this.parserService.parseDsl(val.dslText as string, 'stream')
              .lines[0].nodes
              .map((node) => {
                  return of({
                    origin: get(node, 'name'),
                    name: get(node, 'label') || get(node, 'name'),
                    type: node.type.toString(),
                    version: null,
                    options: null
                  }).pipe(
                    mergeMap(
                      (val1: any) => this.appService.getAppVersions(val1.origin, node.type as any)
                        .pipe(map((val2: App[]) => {
                          val1.versions = val2;
                          const current = val2.find((a: App) => a.defaultVersion);
                          if (current) {
                            val1.version = current.version;
                          }
                          return val1;
                        }))
                    ));
                }
              );
            return forkJoin([this.streamService.getPlatforms(), ...observablesApplications])
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
    return this.appService.getApp(name, type, version)
      .pipe(map((app: DetailedApp) => {
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
                  set(opt, 'valueOptions', ['groovy', 'javascript', 'ruby', 'python']);
                  break;
                case 'script':
                  set(opt, 'code', { langPropertyName: 'scriptable-transformer.language' });
                  break;
              }
            } else if (opt.sourceType === Utils.RX_JAVA_PROCESSOR_SOURCE_TYPE) {
              if (opt.name.toLowerCase() === 'code') {
                set(opt, 'code', { language: 'java' });
              }
            }
            if (opt.type) {
              switch (opt.type) {
                case 'java.util.concurrent.TimeUnit':
                  set(opt, 'valueOptions', [
                    'NANOSECONDS',
                    'MICROSECONDS',
                    'MILLISECONDS',
                    'SECONDS',
                    'MINUTES',
                    'HOURS',
                    'DAYS'
                  ]);
              }
            }
            return opt;
          });
      }));
  }

  deploymentProperties(name: string): Observable<any> {
    return this.streamService.getDeploymentInfo(name, true)
      .pipe(
        map((deploymentInfo: Stream) => {
          const properties = [];
          const ignoreProperties = [];
          // Deployer properties
          if (deploymentInfo.deploymentProperties) {
            Object.keys(deploymentInfo.deploymentProperties).map(app => {
              Object.keys(deploymentInfo.deploymentProperties[app]).forEach((key: string) => {
                const value = this.cleanValueProperties(deploymentInfo.deploymentProperties[app][key]);
                if (key === StreamDeployService.version.keyEdit) {
                  properties.push(`version.${app}=${value}`);
                } else if (key.startsWith(StreamDeployService.deployer.keyEdit)) {
                  const keyShort = key.substring(StreamDeployService.deployer.keyEdit.length, key.length);
                  if (keyShort !== 'group') {
                    properties.push(`deployer.${app}.${keyShort}=${value}`);
                  } else {
                    // this.loggerService.log(`${key} is bypassed (app: ${app}, value: ${value})`);
                  }
                } else {
                  // this.loggerService.log(`${key} is bypassed (app: ${app}, value: ${value})`);
                }
              });
            });
          }
          // Application properties
          const dslTextParsed = this.parserService.parseDsl(deploymentInfo.dslText, 'stream');
          dslTextParsed.lines[0].nodes.forEach((node) => {
            const app = get(node, 'label') || get(node, 'name');
            const appType = get(node, 'name');
            get(node, 'options', []).forEach((value, key) => {
              value = this.cleanValueProperties(value);
              let keyShort = key;
              if (key.startsWith(`${appType}.`)) {
                ignoreProperties.push(`app.${app}.${keyShort}=${value}`);
                keyShort = key.substring(`${appType}.`.length, key.length);
              }
              properties.push(`app.${app}.${keyShort}=${value}`);
              ignoreProperties.push(`app.${app}.${keyShort}=${value}`);
            });
          });
          return {
            properties,
            ignoreProperties,
            stream: deploymentInfo
          };
        })
      );
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
