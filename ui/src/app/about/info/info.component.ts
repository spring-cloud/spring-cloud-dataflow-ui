import { Component, Input, OnInit } from '@angular/core';
import { About } from '../../shared/model/about.model';
import { AboutService } from '../../shared/api/about.service';

@Component({
  selector: 'app-about-info',
  templateUrl: './info.component.html'
})
export class InfoComponent implements OnInit {
  loading = true;
  about: About;
  @Input() isOpen = false;

  constructor(private aboutService: AboutService) {
  }

  ngOnInit(): void {
    this.aboutService.getAbout()
      .subscribe((about: About) => {
        this.about = about;
        this.loading = false;
      });
  }

}
