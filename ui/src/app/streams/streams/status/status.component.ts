import { Component } from '@angular/core';

@Component({
  selector: 'app-stream-status',
  template: `
    <clr-modal [(clrModalOpen)]="isOpen">
      <h3 class="modal-title">Stream status</h3>
      <div class="modal-body">
        <div class="list-status">
          <div>
            <span class="status"><span class="label label-info">DEPLOYING</span></span>
            <span class="desc">Deployment has been initiated</span>
          </div>
          <div>
            <span class="status"><span class="label label-success">DEPLOYED</span></span>
            <span class="desc">Fully deployed based on each of the stream's apps' count properties</span>
          </div>
          <div>
            <span class="status"><span class="label label-warning">INCOMPLETE</span></span>
            <span class="desc">At least 1 of each app, but 1 or more of them not at requested capacity</span>
          </div>
          <div>
            <span class="status"><span class="label label-danger">FAILED</span></span>
            <span class="desc">1 or more of the apps does not have even a single instance deployed</span>
          </div>
          <div>
            <span class="status"><span class="label label-deploying">UNDEPLOYED</span></span>
            <span class="desc">Intentionally undeployed, or created but not yet deployed</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" (click)="close()">Close</button>
      </div>
    </clr-modal>
  `
})
export class StatusComponent {
  isOpen = false;

  constructor() {
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

}
