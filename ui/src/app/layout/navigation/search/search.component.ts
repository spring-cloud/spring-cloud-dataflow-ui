import { Component, DoCheck, Input, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { TasksService } from 'src/app/tasks/tasks.service';
import { StreamsService } from 'src/app/streams/streams.service';
import { AppsService } from '../../../apps/apps.service';
import { AppRegistration } from '../../../shared/model/app-registration.model';
import { Page } from '../../../shared/model/page';
import { StreamDefinition } from '../../../streams/model/stream-definition';
import { TaskDefinition } from 'src/app/tasks/model/task-definition';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { OrderParams } from '../../../shared/components/shared.interface';

/**
 * Navigation Search component
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-navigation-search',
  templateUrl: './search.component.html',
})
export class NavigationSearchComponent implements OnInit {

  /**
   * Force small menu
   */
  @Input() force;

  /**
   * Focused Field
   * @type {string}
   */
  focusedField = '';

  /**
   * Quick search state (active)
   */
  quickSearch = false;

  /**
   * Quick search model
   */
  q = new FormControl('');

  /**
   * Running Search state
   */
  runningSearch = {
    app: false,
    stream: false,
    task: false
  };

  /**
   * Subscriptions Search
   */
  subscriptionsSearch = {
    app: null,
    stream: null,
    task: null
  };

  /**
   * Result Search
   */
  resultSearch = {
    app: null,
    stream: null,
    task: null
  };

  /**
   * Constructor
   *
   * @param {AppsService} appsService
   * @param {StreamsService} streamsService
   * @param {Router} router
   * @param {TasksService} tasksService
   */
  constructor(private appsService: AppsService,
              private streamsService: StreamsService,
              private router: Router,
              private tasksService: TasksService) {
  }

  /**
   * Init
   * Subscribe to the input changes and perform the search
   */
  ngOnInit() {
    this.q.valueChanges
      .map((value) => {
        this.runningSearch.app = true;
        this.runningSearch.stream = true;
        this.runningSearch.task = true;
        this.quickSearch = (value !== '') || this.force;
        return value;
      })
      .debounceTime(300)
      .subscribe((value) => {

        this.resultSearch.app = null;
        this.resultSearch.stream = null;
        this.resultSearch.task = null;

        if (this.subscriptionsSearch.app) {
          this.subscriptionsSearch.app.unsubscribe();
        }
        if (this.subscriptionsSearch.stream) {
          this.subscriptionsSearch.stream.unsubscribe();
        }
        if (this.subscriptionsSearch.task) {
          this.subscriptionsSearch.task.unsubscribe();
        }

        if (value) {
          this.subscriptionsSearch.app = this.appsService.getApps({
            q: value + '',
            type: null,
            page: 0,
            size: 5,
            sort: 'name',
            order: 'ASC'
          }).subscribe((page: Page<AppRegistration>) => {
            this.resultSearch.app = page;
            this.runningSearch.app = false;
          });
          this.subscriptionsSearch.stream = this.streamsService.getDefinitions({
            q: value + '',
            page: 0,
            size: 5,
            sort: 'name',
            order: 'ASC'
          }).subscribe((page: Page<StreamDefinition>) => {
            this.resultSearch.stream = page;
            this.runningSearch.stream = false;
          });
          this.subscriptionsSearch.task = this.tasksService.getDefinitions({
            q: value + '',
            page: 0,
            size: 5,
            sort: 'taskName',
            order: 'ASC'
          }).subscribe((page: Page<TaskDefinition>) => {
            this.resultSearch.task = page;
            this.runningSearch.task = false;
          });
        } else {
          this.runningSearch.app = false;
          this.runningSearch.stream = false;
          this.runningSearch.task = false;
        }
      });
  }

  /**
   * Is no result
   * @returns {boolean}
   */
  isNoResult(): boolean {
    if (this.isRunningSearch()) {
      return false;
    }
    if (!this.resultSearch.app || !this.resultSearch.stream || !this.resultSearch.task) {
      return false;
    }
    return this.resultSearch.app.totalElements === 0 && this.resultSearch.stream.totalElements === 0
      && this.resultSearch.task.totalElements === 0;
  }

  /**
   * Open Quick Search if a value is present on input focus
   */
  openQuickSearch(force: boolean = false) {
    if ((this.q.value && this.q.value !== '') || force) {
      this.q.updateValueAndValidity({ onlySelf: false, emitEvent: true });
      this.focusedField = 'search';
      this.quickSearch = true;
    }
  }

  /**
   * Hide Quick Search (wait 200ms)
   */
  hideQuickSearch() {
    timer(200).subscribe(() => {
      this.focusedField = '';
      this.quickSearch = false;
    });
  }

  /**
   * Is Running Search
   * @returns {boolean}
   */
  isRunningSearch(): boolean {
    if (this.runningSearch.app) {
      return true;
    }
    if (this.runningSearch.stream) {
      return true;
    }
    if (this.runningSearch.task) {
      return true;
    }
    return false;
  }

  /**
   * Navigate
   * @param page
   * @param item
   */
  navigate(page, item) {
    switch (page) {
      case 'app':
        this.router.navigate(['/apps/' + item.type + '/' + item.name]);
        break;
      case 'stream':
        this.router.navigate(['/streams/definitions/' + item.name]);
        break;
      case 'task':
        this.router.navigate(['/tasks/definitions/' + item.name]);
        break;
    }
  }

  /**
   * Redirect to the specified module with the current search value
   */
  moreResult(page) {
    switch (page) {
      case 'app':
        this.appsService.applicationsContext = {
          q: this.q.value,
          type: null,
          sort: 'name',
          order: 'ASC',
          page: 0,
          size: 30,
          itemsSelected: []
        };
        this.router.navigate(['about']).then(() =>
          this.router.navigate(['apps']));
        break;
      case 'stream':
        this.streamsService.streamsContext = {
          q: this.q.value,
          page: 0,
          size: 30,
          sort: 'name',
          order: OrderParams.ASC,
          itemsSelected: [],
          itemsExpanded: []
        };
        this.router.navigate(['about']).then(() =>
          this.router.navigate(['/streams/definitions']));
        break;
      case 'task':
        this.tasksService.tasksContext = {
          q: this.q.value,
          page: 0,
          size: 30,
          sort: 'name',
          order: OrderParams.ASC,
          itemsSelected: []
        };
        this.router.navigate(['about']).then(() =>
          this.router.navigate(['/tasks/definitions']));
        break;
    }
  }

}
