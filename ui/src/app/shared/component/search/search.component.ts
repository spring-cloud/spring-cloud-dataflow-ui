import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { AppPage } from '../../model/app.model';
import { AppService } from '../../api/app.service';
import { StreamService } from '../../api/stream.service';
import { TaskService } from '../../api/task.service';
import { StreamPage } from '../../model/stream.model';
import { TaskPage } from '../../model/task.model';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  isFocus = false;
  isFocusPersist = false;
  selected = 0;
  timer;
  search = new FormControl('');

  @ViewChild('inputQuickSearch', { static: true }) inputQuickSearch: ElementRef;

  searching = {
    apps: false,
    streams: false,
    tasks: false
  };

  results: {
    apps: AppPage,
    streams: StreamPage,
    tasks: TaskPage
  } = {
    apps: null,
    streams: null,
    tasks: null
  };

  subscriptions = {
    apps: null,
    streams: null,
    tasks: null
  };

  constructor(private appService: AppService,
              private streamService: StreamService,
              private taskService: TaskService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  ngOnInit(): void {
    // this.aboutService.getAbout()
    //   .subscribe((about: About) => {
    //     //this.searching.streams = about.features.streams;
    //     //this.searching.tasks = about.features.tasks;
    //   });
    this.search.valueChanges
      .pipe(
        map(val => {
          this.searching.streams = true;
          this.searching.tasks = true;
          this.searching.apps = true;
          return val;
        }),
        debounceTime(300)
      ).subscribe((value) => {
      this.results = {
        apps: null,
        streams: null,
        tasks: null
      };
      if (this.subscriptions.apps) {
        this.subscriptions.apps.unsubscribe();
      }
      if (this.subscriptions.streams) {
        this.subscriptions.streams.unsubscribe();
      }
      if (this.subscriptions.tasks) {
        this.subscriptions.tasks.unsubscribe();
      }
      this.selected = 0;
      if (this.isSearch()) {
        this.subscriptions.apps = this.appService
          .getApps(0, 5, `${value}`, null, 'name', 'ASC')
          .subscribe((page: AppPage) => {
            this.results.apps = page;
            this.searching.apps = false;
          }, error => {
            this.notificationService.error('An error occurred', error);
            this.searching.apps = false;
          });
        this.subscriptions.streams = this.streamService
          .getStreams(0, 5, `${value}`, 'name', 'ASC')
          .subscribe((page: StreamPage) => {
            this.results.streams = page;
            this.searching.streams = false;
          }, error => {
            this.notificationService.error('An error occurred', error);
            this.searching.streams = false;
          });
        this.subscriptions.tasks = this.taskService
          .getTasks(0, 5, `${value}`, 'taskName', 'ASC')
          .subscribe((page: TaskPage) => {
            this.results.tasks = page;
            this.searching.tasks = false;
          }, error => {
            this.notificationService.error('An error occurred', error);
            this.searching.tasks = false;
          });
      } else {
        this.searching.apps = false;
        this.searching.streams = false;
        this.searching.tasks = false;
      }
    });
  }

  isSearch() {
    return this.search.value.trim() !== '';
  }

  isNoResult(): boolean {
    if (this.isSearching()) {
      return false;
    }
    if (!this.results.apps || !this.results.streams || !this.results.tasks) {
      return false;
    }
    return this.results.apps.total === 0 && this.results.streams.total === 0
      && this.results.tasks.total === 0;
  }

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  isSearching(): boolean {
    return this.searching.apps || this.searching.streams || this.searching.tasks;
  }

  onInputFocus() {
    this.isFocus = true;
    this.isFocusPersist = false;
  }


  @HostListener('document:keyup', ['$event'])
  setFocus(event: KeyboardEvent) {
    if (event.code.toUpperCase() === 'SPACE' && event.ctrlKey) {
      this.inputQuickSearch.nativeElement.focus();
    }
  }

  clear() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
    this.inputQuickSearch.nativeElement.focus();
    this.search.setValue('');
    this.results = {
      apps: null,
      streams: null,
      tasks: null
    };
    this.searching.apps = false;
    this.searching.streams = false;
    this.searching.tasks = false;
  }

  onInputBlur() {
    this.timer = timer(200).subscribe(() => {
      this.isFocus = false;
      this.search.setValue('');
      this.results = {
        apps: null,
        streams: null,
        tasks: null
      };
      this.searching.apps = false;
      this.searching.streams = false;
      this.searching.tasks = false;
      this.timer.unsubscribe();
    });
  }

  onKeyDown(event) {
    if (this.isSearching() || !this.isSearch()) {
      return;
    }
    switch (event.keyCode) {
      case 40: // Down
        event.preventDefault();
        const max = this.results.apps.items.length + this.results.streams.items.length + this.results.tasks.items.length;
        this.selected = Math.min(this.selected + 1, max - 1);
        break;
      case 38: // Up
        event.preventDefault();
        this.selected = Math.max(this.selected - 1, 0);
        break;
      case 13: // Enter
        event.preventDefault();
        let item;
        if (this.selected < (this.results.apps.items.length)) {
          item = this.results.apps.items[this.selected];
          this.navigate(`/apps/${item.type}/${item.name}`);
        } else if (this.selected < ((this.results.apps.items.length) + (this.results.streams.items.length))) {
          item = this.results.streams.items[this.selected - this.results.apps.items.length];
          this.navigate(`/streams/list/${item.name}`);
        } else {
          item = this.results.tasks.items[this.selected - this.results.apps.items.length - this.results.streams.items.length];
          this.navigate(`/tasks-jobs/tasks/${item.name}`);
        }
        this.inputQuickSearch.nativeElement.blur();
        break;
      case 27: // Escape
        event.preventDefault();
        // onClose()
        this.inputQuickSearch.nativeElement.blur();
        break;
      case 39: // Right
      case 37: // Left
        break;
      case 9: // Tab
        event.preventDefault();
        break;
      // case 91: // Command
      // case 93: // Command
      //   this.selected = 0;
    }
  }


}
