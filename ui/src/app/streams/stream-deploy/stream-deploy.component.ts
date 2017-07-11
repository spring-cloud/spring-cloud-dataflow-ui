import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {StreamDeployService} from "./stream-deploy.service";
import {StreamDeploymentRequest} from "./model/stream-deployment-request";
import {ToastyService} from "ng2-toasty";

@Component({
  selector: 'app-stream-deploy',
  templateUrl: './stream-deploy.component.html',
  providers: [StreamDeployService]
})

/**
 * Component that handles Stream Deployments.   Captures the deployment properties required for a stream deployment
 * as well as submits the {@link StreamDeploymentRequest} to the {@link StreamDeployService}.
 *
 * @author Glenn Renfro
 */
export class StreamDeployComponent implements OnInit {

  private streamName: string;

  private propertiesText: string;

  private propertiesAsMap: {};

  private isValid = true;


  constructor(private route: ActivatedRoute, private router: Router, private streamDeployService: StreamDeployService,
              private toastyService: ToastyService) {
  }

  /**
   * Retrieves the name of the stream to be deployed from the URL.
   */
  ngOnInit() {
    this.streamName = this.route.snapshot.params['streamname'];
  }

  /**
   * Navigates back to the streams list page.
   */
  onCancelDefinitionDeploy() {
    this.router.navigate(['/streams']);
  }

  /**
   * Upon form submission, the application captures form information submits a {@link StreamDeploymentRequest}.
   */
  onSubmit() {
    let isDeployRequestAccepted: boolean = true;

    if (this.parseProperties()) {
      let streamDeploymentRequest: StreamDeploymentRequest = new StreamDeploymentRequest(this.streamName,
        this.propertiesAsMap)
      this.streamDeployService.deployStream(streamDeploymentRequest).subscribe(data => {
          this.router.navigate(['/streams']);
          this.toastyService.success('Deployment Request Sent');
        },
        error => {
          isDeployRequestAccepted = false;
          if (error.message != null) {
            this.toastyService.error(error.message);
          }
          else {
            this.toastyService.error(error);
          }
        });
    }
  }

  /**
   * Handles the event when the File selection button is selected.
   * @param event Used to capture the file name selected by the user.
   */
  onFileSelect(event) {
    let fileName = event.target.files[0];
    if (!fileName) {
      return;
    }
    let reader = new FileReader();
    reader.onload = file => {
      let contents: any = file.target;
      this.propertiesText = contents.result;
    };
    reader.readAsText(fileName);
  }

  private parseProperties() {
    this.propertiesAsMap = {};
    if (this.propertiesText) {
      for (let prop of this.propertiesText.split("\n")) {
        if (prop && prop.length > 0 && !prop.startsWith('#')) {
          let keyValue = prop.split('=');
          if (keyValue.length === 2) {
            this.propertiesAsMap[keyValue[0]] = keyValue[1];
          }
          else {
            console.warn('Invalid deployment property "' + prop + '" must contain a single "=".');
            this.isValid = false;
            return false;
          }
        }
      }
    }
    this.isValid = true;
    return true;
  }
}
