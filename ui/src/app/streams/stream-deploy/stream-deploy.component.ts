import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { StreamsService } from '../streams.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { validateDeploymentProperties } from './stream-deploy-validators';

@Component({
  selector: 'app-stream-deploy',
  templateUrl: './stream-deploy.component.html',
})

export class StreamDeployComponent implements OnInit {

  id: String;
  private sub: any;
  form: FormGroup;
  deploymentProperties = new FormControl("", validateDeploymentProperties);

  constructor(
    private streamsService: StreamsService,
    private route: ActivatedRoute,
    private router: Router,
    private toastyService: ToastyService,
    fb: FormBuilder
  ) {
     this.form = fb.group({
       "deploymentProperties": this.deploymentProperties
     });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = params['id'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  cancelDefinitionDeploy() {
    this.router.navigate(['streams/definitions']);
  }

  deployDefinition() {
    console.log('deployDefinition ' + this.deploymentProperties.value);

    var propertiesAsMap = {};
    if (this.deploymentProperties.value) {
      for (let prop of this.deploymentProperties.value.split('\n')) {
        if (prop && prop.length > 0 && !prop.startsWith('#')) {
          var keyValue = prop.split('=');
          if (keyValue.length===2) {
            propertiesAsMap[keyValue[0]] = keyValue[1];
          }
        }
      }
    }

    this.streamsService.deployDefinition(this.id, propertiesAsMap).subscribe(
      data => {
        this.toastyService.success('Successfully deployed stream definition "'
          + this.id + '"');
        this.router.navigate(['streams/definitions']);
      },
      error => {}
    );
  }

  displayFileContents(event) {
    var file:File = event.target.files[0];
    var reader:FileReader = new FileReader();
    var _form = this.form;
    reader.onloadend = function(e){
      console.log(reader.result);
      _form.patchValue({deploymentProperties: reader.result});
    }
    reader.readAsText(file);
  }
}
