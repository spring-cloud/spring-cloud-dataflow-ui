import { Component, OnInit, ViewChild } from '@angular/core';
import { InfoComponent } from '../info/info.component';
import { ClrSignpostContent } from '@clr/angular';
import { AboutState } from '../../shared/store/about.reducer';
import { AboutService } from '../../shared/api/about.service';

@Component({
  selector: 'app-about-signpost',
  templateUrl: './signpost.component.html'
})
export class SignpostComponent implements OnInit {
  loading = true;
  about: AboutState;
  @ViewChild('infoModal', { static: true }) infoModal: InfoComponent;
  @ViewChild('signpost') signpost: ClrSignpostContent;

  constructor(private aboutService: AboutService) {
  }

  ngOnInit(): void {
    this.aboutService.getAbout()
      .subscribe(((about: AboutState) => {
        this.about = about;
        this.loading = false;
      }));
  }

  more() {
    this.infoModal.isOpen = true;
    this.signpost.close();
  }

}
