import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { StreamDefinition } from '../../model/stream-definition';
import { Subscription } from 'rxjs/Subscription';
import { Platform } from '../../model/platform';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { StreamsService } from '../../streams.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { StreamDeployValidator } from '../../stream-deploy/stream-deploy.validator';

@Component({
  selector: 'app-stream-deployment-properties',
  templateUrl: './deployment-properties.component.html',
})

/**
 * Component used to deploy stream definitions.
 *
 * @author Damien Vitrac
 * @author Gunnar Hillert
 */
export class DeploymentPropertiesComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  id: String;
  form: FormGroup;
  deploymentProperties = new FormControl('', StreamDeployValidator.validateDeploymentProperties);
  deploymentPlatform = new FormControl('');

  platforms: Platform[];

  subscriptionPlatforms: Subscription;
  subscriptionFeatureInfo: Subscription;
  skipperEnabled = false;

  @Output()
  public cancel = new EventEmitter();

  @Output()
  public submit = new EventEmitter();

  @Input()
  public stream: StreamDefinition;

  /**
   * Adds deployment properties to the FormBuilder
   * @param fb used establish the deployment properties as a part of the form.
   * @param sharedAboutService used to check if skipper is enable
   * @param streamsService The service used to deploy the stream.
   */
  constructor(private fb: FormBuilder,
              private sharedAboutService: SharedAboutService,
              private streamsService: StreamsService) {
    this.form = fb.group({
      'deploymentProperties': this.deploymentProperties,
      'deploymentPlatform': this.deploymentPlatform
    });
  }

  /**
   * Initialize states
   * Load platforms if skipper is enabled
   * Parse the current parameters and populate fields
   */
  ngOnInit() {
    this.subscriptionFeatureInfo = this.sharedAboutService.getFeatureInfo()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(featureInfo => {
        this.skipperEnabled = featureInfo.skipperEnabled;
        if (this.skipperEnabled) {
          this.subscriptionPlatforms = this.streamsService.getPlatforms()
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((platforms: Platform[]) => {
              this.platforms = platforms;
            });
        }
      });
    this.deploymentPlatform.setValue('default');
    if (this.stream.deploymentProperties instanceof Object) {
      if (this.stream.deploymentProperties.platformName) {
        this.deploymentPlatform.setValue(this.stream.deploymentProperties.platformName);
      }
      this.deploymentProperties.setValue(Object.keys(this.stream.deploymentProperties)
        .filter(a => a !== 'spring.cloud.dataflow.skipper.platformName')
        .map(a => {
          return a + '=' + this.stream.deploymentProperties[a];
        }).join('\n'));
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
   * Deploy the definition and emit on submit event
   */
  deployDefinition() {
    const propertiesAsMap = {};
    if (this.deploymentProperties.value) {
      for (const prop of this.deploymentProperties.value.split('\n')) {
        if (prop && prop.length > 0 && !prop.startsWith('#')) {
          const index = prop.indexOf('=');
          if (index > 0) {
            propertiesAsMap[prop.substr(0, index)] = prop.substr(index + 1);
          }
        }
      }
    }
    if (this.skipperEnabled) {
      propertiesAsMap['spring.cloud.dataflow.skipper.platformName'] = this.deploymentPlatform.value;
    }
    this.stream.deploymentProperties = propertiesAsMap;
    this.submit.emit();
  }

  /**
   * Fire cancel event
   */
  cancelDeployment() {
    this.cancel.emit();
  }

  /**
   * Used to read the deployment properties of a stream from a flat file
   * @param event The event from the file selection dialog.
   */
  displayFileContents(event: any) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    const _form = this.form;
    reader.onloadend = function (e) {
      _form.patchValue({ deploymentProperties: reader.result });
    };
    reader.readAsText(file);
  }
}
