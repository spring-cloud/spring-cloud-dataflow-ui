import { Component, Input, OnInit } from '@angular/core';
import { AboutState } from '../../shared/store/about.reducer';
import { AboutService } from '../../shared/api/about.service';

@Component({
  selector: 'app-about-info',
  templateUrl: './info.component.html'
})
export class InfoComponent implements OnInit {
  loading = true;
  about: AboutState;
  @Input() isOpen = false;

  constructor(private aboutService: AboutService) {
  }

  ngOnInit(): void {
    this.aboutService.getAbout()
      .subscribe(((about: AboutState) => {
        this.about = about;
        this.loading = false;
      }));
  }

}
