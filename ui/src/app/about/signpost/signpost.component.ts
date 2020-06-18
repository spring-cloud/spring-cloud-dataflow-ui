import { Component, OnInit, ViewChild } from '@angular/core';
import { AboutService } from '../../shared/api/about.service';
import { InfoComponent } from '../info/info.component';
import { ClrSignpostContent } from '@clr/angular';
import { select, Store } from '@ngrx/store';
import { aboutFeatureKey, AboutState, getAbout, State } from '../../shared/store/about.reducer';

@Component({
  selector: 'app-about-signpost',
  templateUrl: './signpost.component.html'
})
export class SignpostComponent implements OnInit {
  loading = true;
  about: AboutState;
  @ViewChild('infoModal', { static: true }) infoModal: InfoComponent;
  @ViewChild('signpost') signpost: ClrSignpostContent;

  constructor(private aboutService: AboutService,
              private store: Store<State>) {
  }

  ngOnInit(): void {
    this.store
      .pipe(select(getAbout))
      .subscribe((about => {
        this.about = about;
        this.loading = false;
      }));
  }

  more() {
    this.infoModal.isOpen = true;
    this.signpost.close();
  }

}
