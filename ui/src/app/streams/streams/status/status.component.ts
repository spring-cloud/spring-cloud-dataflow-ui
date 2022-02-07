import {Component} from '@angular/core';

@Component({
  selector: 'app-stream-status',
  template: `
    <clr-modal [(clrModalOpen)]="isOpen">
      <h3 class="modal-title">{{ 'streams.status.title' | translate }}</h3>
      <div class="modal-body">
        <div class="list-status">
          <div>
            <span class="status"
              ><span class="label label-stream deploying">{{
                'streams.status.deploying' | translate | uppercase
              }}</span></span
            >
            <span class="desc">{{ 'streams.status.deployingContent' | translate }}</span>
          </div>
          <div>
            <span class="status"
              ><span class="label label-stream deployed">{{
                'streams.status.deployed' | translate | uppercase
              }}</span></span
            >
            <span class="desc">{{ 'streams.status.deployedContent' | translate }}</span>
          </div>
          <div>
            <span class="status"
              ><span class="label label-stream incomplete">{{
                'streams.status.partial' | translate | uppercase
              }}</span></span
            >
            <span class="desc">{{ 'streams.status.partialContent' | translate }}</span>
          </div>
          <div>
            <span class="status"
              ><span class="label label-stream incomplete">{{
                'streams.status.incomplete' | translate | uppercase
              }}</span></span
            >
            <span class="desc">{{ 'streams.status.incompleteContent' | translate }}</span>
          </div>
          <div>
            <span class="status"
              ><span class="label label-stream failed">{{
                'streams.status.failed' | translate | uppercase
              }}</span></span
            >
            <span class="desc">{{ 'streams.status.failedContent' | translate }}</span>
          </div>
          <div>
            <span class="status"
              ><span class="label label-stream undeployed">{{
                'streams.status.undeployed' | translate | uppercase
              }}</span></span
            >
            <span class="desc">{{ 'streams.status.undeployedContent' | translate }}</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" (click)="close()">{{ 'commons.close' | translate }}</button>
      </div>
    </clr-modal>
  `
})
export class StatusComponent {
  isOpen = false;

  constructor() {}

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }
}
