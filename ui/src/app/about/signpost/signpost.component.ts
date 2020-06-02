import { Component, OnInit, ViewChild } from '@angular/core';
import { About } from '../../shared/model/about.model';
import { AboutService } from '../../shared/api/about.service';
import { InfoComponent } from '../info/info.component';
import { ClrSignpostContent } from '@clr/angular';

@Component({
  selector: 'app-about-signpost',
  templateUrl: './signpost.component.html'
})
export class SignpostComponent implements OnInit {
  loading = true;
  about: About;
  @ViewChild('infoModal', { static: true }) infoModal: InfoComponent;
  @ViewChild('signpost') signpost: ClrSignpostContent;

  constructor(private aboutService: AboutService) {
  }

  ngOnInit(): void {
    this.aboutService.getAbout().subscribe((about: About) => {
      this.about = about;
      this.loading = false;
    });
  }

  more() {
    this.infoModal.isOpen = true;
    this.signpost.close();
  }

}
