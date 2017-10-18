import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {validateDeploymentProperties} from '../../stream-deploy/stream-deploy-validators';
import {StreamDefinition} from '../../model/stream-definition';

@Component({
  selector: 'app-stream-deployment-properties',
  templateUrl: './deployment-properties.component.html',
})

/**
 * Component used to deploy stream definitions.
 *
 * @author Damien Vitrac
 */
export class DeploymentPropertiesComponent implements OnInit {

  id: String;
  form: FormGroup;
  deploymentProperties = new FormControl('', validateDeploymentProperties);

  @Output()
  public cancel = new EventEmitter();

  @Output()
  public submit = new EventEmitter();

  @Input()
  public stream: StreamDefinition;

  /**
   * Adds deployment properties to the FormBuilder
   * @param fb used establish the deployment properties as a part of the form.
   */
  constructor(
    fb: FormBuilder
  ) {
     this.form = fb.group({
       'deploymentProperties': this.deploymentProperties
     });
  }

  ngOnInit() {
    if (this.stream.deploymentProperties instanceof Object) {
      this.deploymentProperties.setValue(Object.keys(this.stream.deploymentProperties)
        .map(a => {
          return a + '=' + this.stream.deploymentProperties[a];
        }).join('\n'));
    }
  }

  /**
   * Deploy the definition and submit the event
   */
  deployDefinition() {
    const propertiesAsMap = {};
    if (this.deploymentProperties.value) {
      for (const prop of this.deploymentProperties.value.split('\n')) {
        if (prop && prop.length > 0 && !prop.startsWith('#')) {
          const keyValue = prop.split('=');
          if (keyValue.length === 2) {
            propertiesAsMap[keyValue[0]] = keyValue[1];
          }
        }
      }
    }
    this.stream.deploymentProperties = propertiesAsMap;
    this.submit.emit();
  }

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
    reader.onloadend = function(e){
      _form.patchValue({deploymentProperties: reader.result});
    };
    reader.readAsText(file);
  }
}
