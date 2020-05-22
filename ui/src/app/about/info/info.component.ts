import { Component, OnInit } from '@angular/core';
import { About } from '../../shared/model/about.model';
import { AboutService } from '../../shared/api/about.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  loading = true;
  about: About;

  constructor(private aboutService: AboutService) {
  }

  ngOnInit(): void {
    this.aboutService.getAbout().subscribe((about: About) => {
      this.about = about;
      this.loading = false;
    });
  }

  isEmpty(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

}
