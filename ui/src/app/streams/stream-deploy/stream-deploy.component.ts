import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormControl, FormBuilder} from '@angular/forms';
import {StreamsService} from '../streams.service';
import {ToastyService} from 'ng2-toasty';
import {validateDeploymentProperties} from './stream-deploy-validators';
import {Subscription} from 'rxjs/Subscription';
import {Platform} from '../model/platform';
import {SharedAboutService} from '../../shared/services/shared-about.service';
import { Subject } from 'rxjs/Subject';
import { BusyService } from '../../shared/services/busy.service';
import { takeUntil } from 'rxjs/operators';

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
  templateUrl: './stream-deploy.component.html'
})
export class StreamDeployComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  id: String;
  form: FormGroup;

  deploymentProperties = new FormControl('', validateDeploymentProperties);
  deploymentPlatform = new FormControl('');

  propertiesAsMap = {};
  platforms: Platform[];
  skipperEnabled = false;

  /**
   * Adds deployment properties to the FormBuilder
   * @param streamsService The service used to deploy the stream.
   * @param route used to subscribe to the id param
   * @param router used to navigate back to the home page
   * @param toastyService used to display the status of a deployment
   * @param sharedAboutService used to check if skipper is enable
   * @param fb used establish the deployment properties as a part of the form.
   */
  constructor(
              private busyService: BusyService,
              private streamsService: StreamsService,
              private route: ActivatedRoute,
              private router: Router,
              private toastyService: ToastyService,
              private sharedAboutService: SharedAboutService,
              fb: FormBuilder) {

    this.form = fb.group({
      'deploymentProperties': this.deploymentProperties,
      'deploymentPlatform': this.deploymentPlatform
    });
  }

  /**
   * Establishes the stream name for the deployment as obtained from the URL.
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.sharedAboutService.getFeatureInfo()
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(featureInfo => {
      this.skipperEnabled = featureInfo.skipperEnabled;
      if (this.skipperEnabled) {
        this.streamsService.platforms()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((platforms: Platform[]) => {
          this.platforms = platforms;
          this.deploymentPlatform.setValue('default');
        });
      }
    });
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
   * Navigates back to the stream definitions page.
   */
  cancelDefinitionDeploy() {
    this.router.navigate(['streams/definitions']);
  }

  /**
   * Requests a stream deployment for the {@link StreamDefinition}.
   */
  deployDefinition() {
    console.log('deployDefinition ' + this.deploymentProperties.value);

    this.propertiesAsMap = {};
    if (this.deploymentProperties.value) {
      for (const prop of this.deploymentProperties.value.split('\n')) {
        if (prop && prop.length > 0 && !prop.startsWith('#')) {
          const index = prop.indexOf('=');
          if (index > 0) {
            this.propertiesAsMap[prop.substr(0, index)] = prop.substr(index + 1);
          }
        }
      }
    }

    if (this.skipperEnabled) {
      this.propertiesAsMap['spring.cloud.dataflow.skipper.platformName'] = this.deploymentPlatform.value;
    }

    const busy = this.streamsService.deployDefinition(this.id, this.propertiesAsMap)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        this.toastyService.success('Successfully deployed stream definition "'
          + this.id + '"');
        this.router.navigate(['streams/definitions']);
      },
      error => {
        if (error.message != null) {
          this.toastyService.error(error.message);
        } else {
          this.toastyService.error(error);
        }
      }
    );
    this.busyService.addSubscription(busy);
  }

  /**
   * Used to read the deployment properties of a stream from a flat file
   * @param event The event from the file selection dialog.
   */
  displayFileContents(event: any) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    const _form = this.form;
    reader.onloadend = () => {
      _form.patchValue({deploymentProperties: reader.result});
    };
    reader.readAsText(file);
  }
}
