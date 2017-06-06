import { Component, OnInit } from '@angular/core';
import {AboutService} from './about-service.service'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  providers: [AboutService]
})
export class AboutComponent implements OnInit {

  private dataflowVersionInfo;

  constructor(private aboutService: AboutService) { }

  ngOnInit() {
    this.getVersionInfo();
  }

  getVersionInfo(): void {
    this.aboutService.getAboutInfo().subscribe(
      data => {
        console.log('>>>>>>>>>>>', data);
        this.dataflowVersionInfo = data;
      }
    );
  }
}
