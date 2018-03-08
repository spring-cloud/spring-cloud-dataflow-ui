import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Platform} from '../model/platform';
import {SharedAboutService} from '../../shared/services/shared-about.service';
import {StreamsService} from '../streams.service';
import {mergeMap} from 'rxjs/operators';
import {Parser} from '../../shared/services/parser';
import {ApplicationType} from '../../shared/model/application-type';
import {SharedAppsService} from '../../shared/services/shared-apps.service';
import {AppVersion} from '../../shared/model/app-version';
import {AppsService} from '../../apps/apps.service';
import {
  DetailedAppRegistration,
  ConfigurationMetadataProperty
} from '../../shared/model/detailed-app-registration.model';
import {StreamDeployConfig} from '../model/stream-deploy-config';
import {Utils} from '../../shared/flo/support/utils';


/**
 * Provides {@link StreamDeployConfig} related services.
 *
 * @author Damien Vitrac
 */
@Injectable()
export class StreamDeployService {

  /**
   * Constructor
   *
   * @param {SharedAboutService} sharedAboutService
   * @param {StreamsService} streamsService
   * @param {SharedAppsService} sharedAppsService
   * @param {AppsService} appsService
   */
  constructor(private sharedAboutService: SharedAboutService,
              private streamsService: StreamsService,
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
    return this.sharedAboutService
      .getFeatureInfo()
      .debounceTime(100)
      .pipe(
        mergeMap(
          val => this.streamsService.getDefinition(id),
          (val1, val2) => {
            return {
              feature: val1,
              streamDefinition: val2,
            };
          })
      ).pipe(
        mergeMap(
          val => {
            const observablesApplications = Parser.parse(val.streamDefinition.dslText as string, 'stream')
              .lines[0].nodes
              .map((node) => {
                  return Observable.of({
                    origin: node['name'],
                    name: node['label'] || node['name'],
                    type: node.type.toString(),
                    version: null
                  })
                    .pipe(
                      mergeMap(
                        val1 => this.appsService.getAppVersions(ApplicationType[node.type], val1.origin),
                        (val1: any, val2: AppVersion[]) => {
                          val1.versions = val2;
                          const current = val2.find((a: AppVersion) => a.defaultVersion);
                          if (current) {
                            val1.version = current.version;
                          }
                          return val1;
                        }
                      )
                    );
                }
              );

            if (val.feature.skipperEnabled) {
              return Observable.forkJoin(this.streamsService.platforms(), ...observablesApplications);
            }
            return Observable.forkJoin(...observablesApplications);
          },
          (val, val2) => ({
            feature: val.feature,
            streamDefinition: val.streamDefinition,
            args: val2,
          }))
      ).map(result => {
        const config = new StreamDeployConfig();
        config.skipper = result.feature.skipperEnabled;
        config.id = id;

        // Platform
        if (config.skipper) {
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
                type: platform.type
              };
            })
          };

        }
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
            isOnError: false
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
            suffix: 'Mb'
          },
          {
            id: 'cpu',
            name: 'cpu',
            form: 'autocomplete',
            type: 'java.lang.Integer',
            value: null,
            defaultValue: null,
            suffix: 'Core'
          },
          {
            id: 'disk',
            name: 'disk',
            form: 'autocomplete',
            type: 'java.lang.Integer',
            value: null,
            defaultValue: null,
            suffix: 'Mb'
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
      });
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
  app(type: ApplicationType, name: string, version: string): Observable<Array<any>> {
    return this.sharedAppsService.getAppInfo(type, name, version)
      .map((app: DetailedAppRegistration) => {
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
      });
  }

}
