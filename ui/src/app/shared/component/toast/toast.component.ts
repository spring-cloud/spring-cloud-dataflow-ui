import { Component, OnInit } from '@angular/core';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        opacity: 0,
      })),
      transition('inactive => active', animate('400ms ease-out', keyframes([
        style({
          transform: 'translate3d(100%, 0, 0)',
          opacity: 0,
        }),
        style({
          opacity: 1,
        }),
        style({
          opacity: 1,
        }),
        style({
          transform: 'none',
          opacity: 1,
        }),
      ]))),
      transition('active => removed', animate('400ms ease-out', keyframes([
        style({
          opacity: 1,
        }),
        style({
          transform: 'translate3d(100%, 0, 0)',
          opacity: 0,
        }),
      ]))),
    ]),
  ],
})
export class ToastComponent extends Toast {

  constructor(protected toastrService: ToastrService,
              public toastPackage: ToastPackage) {
    super(toastrService, toastPackage);
  }

}
