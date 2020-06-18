import { Component, Input, OnInit } from '@angular/core';
import { aboutFeatureKey, AboutState, getAbout, State } from '../../shared/store/about.reducer';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-about-info',
  templateUrl: './info.component.html'
})
export class InfoComponent implements OnInit {
  loading = true;
  about: AboutState;
  @Input() isOpen = false;

  constructor(private store: Store<State>) {
  }

  ngOnInit(): void {
    this.store
      .pipe(select(getAbout))
      .subscribe((about => {
        this.about = about;
        this.loading = false;
      }));
  }

}
