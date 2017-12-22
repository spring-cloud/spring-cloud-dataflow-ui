import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { StreamsService } from '../streams.service';
import { ToastyService } from 'ng2-toasty';
import { validateDeploymentProperties } from './stream-deploy-validators';
import { Subscription } from 'rxjs/Subscription';

/**
 * Component used to deploy stream definitions.
 *
 * @author Janne Valkealahti
 * @author Glenn Renfro
 */
@Component({
  selector: 'app-stream-deploy',
  templateUrl: './stream-deploy.component.html'
})
export class StreamDeployComponent implements OnInit, OnDestroy {

  id: String;
  private sub: any;
  form: FormGroup;
  deploymentProperties = new FormControl('', validateDeploymentProperties);
  propertiesAsMap = {};
  busy: Subscription;

  /**
   * Adds deployment properties to the FormBuilder
   * @param streamsService The service used to deploy the stream.
   * @param route used to subscribe to the id param
   * @param router used to navigate back to the home page
   * @param toastyService used to display the status of a deployment
   * @param fb used establish the deployment properties as a part of the form.
   */
  constructor(
    private streamsService: StreamsService,
    private route: ActivatedRoute,
    private router: Router,
    private toastyService: ToastyService,
    fb: FormBuilder
  ) {
     this.form = fb.group({
       'deploymentProperties': this.deploymentProperties
     });
  }

  /**
   * Establishes the stream name for the deployment as obtained from the URL.
   */
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = params['id'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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

    this.busy = this.streamsService.deployDefinition(this.id, this.propertiesAsMap).subscribe(
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
  }

  /**
   * Used to read the deployment properties of a stream from a flat file
   * @param event The event from the file selection dialog.
   */
  displayFileContents(event: any) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    const _form = this.form;
    reader.onloadend = function(e){
      _form.patchValue({deploymentProperties: reader.result});
    };
    reader.readAsText(file);
  }
}
