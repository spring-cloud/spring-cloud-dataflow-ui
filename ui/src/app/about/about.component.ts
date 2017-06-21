import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';
import { Subscription } from 'rxjs/Subscription';
import { BusyModule, BusyDirective } from 'angular2-busy';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { StompService } from 'ng2-stomp-service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  providers: [AboutService]
})
export class AboutComponent implements OnInit {

  dataflowVersionInfo;
  busy: Subscription;
  websocketData;

  private subscription: any;

  constructor(private aboutService: AboutService, private toastyService: ToastyService,
              stomp: StompService, private router: Router) {

    stomp.configure({
      host: '/websocket',
      debug: true,
      queue: { 'init': false }
    });

    // start connection
    stomp.startConnect().then(() => {
      stomp.done('init');
      console.log('connected');

      // subscribe
      // this.subscription = stomp.subscribe('/topic/price.stock.*', this.response);

      // this.subscription = stomp.subscribe('/topic/updates', this.response);

      // send data
      // stomp.send('destionation',{"data":"data"});

      // unsubscribe
      // this.subscription.unsubscribe();

      // disconnect
      // stomp.disconnect().then(() => {
      // console.log( 'Connection closed' )
      // })
    });
  }

  stopWebsockets() {
    console.log('Unsubscribing...');
    this.subscription.unsubscribe('/topic/updates');
  }

  public response = (data) => {
    console.log(data);
    this.websocketData = data.message;
    this.toastyService.warning(`Time ${data.message} loaded.`);
  }

  ngOnInit() {
    console.log('init');
    this.getVersionInfo();
  }

  getVersionInfo(): void {
    this.busy = this.aboutService.getAboutInfo().subscribe(
      data => {
        this.dataflowVersionInfo = data;
        this.toastyService.success('About data loaded.');
      }
    );
  }

  goToDetails() {
    console.log('Go to details ...');
    this.router.navigate(['about/details']);
  };
}
