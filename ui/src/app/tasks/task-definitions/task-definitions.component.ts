import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { Page } from '../../shared/model/page';
import { Router } from '@angular/router';
import { TaskDefinition } from '../model/task-definition';
import { TasksService } from '../tasks.service';
import { BusyService } from '../../shared/services/busy.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TaskListParams } from '../components/tasks.interface';
import { OrderParams, SortParams } from '../../shared/components/shared.interface';
import { TaskDefinitionsDestroyComponent } from '../task-definitions-destroy/task-definitions-destroy.component';

/**
 * Provides {@link TaskDefinition} related services.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Glenn Renfro
 * @author Damien Vitrac
 *
 */
@Component({
  selector: 'app-tasks-definitions',
  templateUrl: './task-definitions.component.html',
  styleUrls: ['styles.scss']
})
export class TaskDefinitionsComponent implements OnInit, OnDestroy {

  /**
   * Current page of task definitions
   */
  taskDefinitions: Page<TaskDefinition>;

  /**
   * Busy Subscriptions
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Current forms value
   */
  form: any = {
    q: '',
    type: '',
    checkboxes: []
  };

  /**
   * State of App List Params
   */
  params: TaskListParams = {
    sort: 'name',
    order: OrderParams.ASC,
    page: 0,
    size: 30,
    q: ''
  };

  /**
   * Contain a key application of each selected application
   * @type {Array}
   */
  itemsSelected: Array<string> = [];

  /**
   * Storage context
   */
  context: any;

  constructor(public tasksService: TasksService,
              private modalService: BsModalService,
              private busyService: BusyService,
              private router: Router,
              private toastyService: ToastyService) {

  }

  /**
   * Retrieves the {@link TaskDefinition}s to be displayed on the page.
   */
  ngOnInit() {
    this.context = this.tasksService.tasksContext;
    this.params = { ...this.context };
    this.form = { q: this.context.q, checkboxes: [] };
    this.itemsSelected = this.context.itemsSelected || [];
    this.refresh();
  }

  /**
   * Close subscription
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Initializes the taskDefinitions attribute with the results from Spring Cloud Data Flow server.
   */
  refresh() {
    const busy = this.tasksService
      .getDefinitions(this.params).map((page: Page<TaskDefinition>) => {
        this.form.checkboxes = page.items.map((task) => {
          return this.itemsSelected.indexOf(task.name) > -1;
        });
        return page;
      })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((page: Page<TaskDefinition>) => {
          if (page.items.length === 0 && this.params.page > 0) {
            this.params.page = 0;
            this.refresh();
            return;
          }
          this.taskDefinitions = page;
          this.changeCheckboxes();
          this.updateContext();
        },
        error => {
          this.toastyService.error(error);
        }
      );

    this.busyService.addSubscription(busy);
  }

  /**
   * Write the context in the service.
   */
  updateContext() {
    this.context.q = this.params.q;
    this.context.sort = this.params.sort;
    this.context.order = this.params.order;
    this.context.page = this.params.page;
    this.context.size = this.params.size;
    this.context.itemsSelected = this.itemsSelected;
  }

  /**
   * Apply sort
   * Triggered on column header click
   *
   * @param {SortParams} sort
   */
  applySort(sort: SortParams) {
    this.params.sort = sort.sort;
    this.params.order = sort.order;
    this.refresh();
  }

  /**
   * Run the search
   */
  search() {
    this.params.q = this.form.q;
    this.params.page = 0;
    this.refresh();
  }

  /**
   * Used to determinate the state of the query parameters
   *
   * @returns {boolean} Search is active
   */
  isSearchActive() {
    return (this.form.q !== this.params.q);
  }

  /**
   * Reset the search parameters and run the search
   */
  clearSearch() {
    this.form.q = '';
    this.search();
  }

  /**
   * Determine if there is no application
   */
  isTasksEmpty(): boolean {
    if (this.taskDefinitions) {
      if (this.taskDefinitions.totalPages < 2) {
        return (this.params.q === '' && this.taskDefinitions.items.length === 0);
      }
    }
    return false;
  }

  /**
   * Update the list of selected checkbox
   */
  changeCheckboxes() {
    if (!this.taskDefinitions || (this.taskDefinitions.items.length !== this.form.checkboxes.length)) {
      return;
    }
    const value: Array<string> = this.taskDefinitions.items.map((app, index) => {
      if (this.form.checkboxes[index]) {
        return app.name;
      }
    }).filter((a) => a != null);
    this.itemsSelected = value;
    this.updateContext();
  }

  /**
   * Number of selected task definitions
   * @returns {number}
   */
  countSelected(): number {
    return this.form.checkboxes.filter((a) => a).length;
  }

  /**
   * Used for requesting a new page. The past is page number is
   * 1-index-based. It will be converted to a zero-index-based
   * page number under the hood.
   *
   * @param page 1-index-based
   */
  getPage(page: number) {
    console.log(`Getting page ${page}.`);
    this.params.page = page - 1;
    this.refresh();
  }

  /**
   * Removes the {@link TaskDefinition} from the repository.  Shows modal dialog
   * prior to deletion to verify if user wants to destroy definition.
   * @param item the task definition to be removed.
   */
  destroy(item: TaskDefinition) {
    this.destroyTasks([item]);
  }

  /**
   * Starts the destroy process of multiple {@link TaskDefinition}s
   * by opening a confirmation modal dialog.
   */
  destroySelectedTasks() {
    const taskDefinitions = this.taskDefinitions.items
      .filter((item) => this.itemsSelected.indexOf(item.name) > -1);
    this.destroyTasks(taskDefinitions);
  }


  /**
   * Starts the destroy the {@link TaskDefinition}s in parameter
   * by opening a confirmation modal dialog.
   * @param {TaskDefinition[]} taskDefinitions
   */
  destroyTasks(taskDefinitions: TaskDefinition[]) {
    if (taskDefinitions.length === 0) {
      return;
    }
    console.log(`Destroy ${taskDefinitions} task definition(s).`, taskDefinitions);
    const className = taskDefinitions.length > 1 ? 'modal-lg' : 'modal-md';
    this.modal = this.modalService.show(TaskDefinitionsDestroyComponent, { class: className });
    this.modal.content.open({ taskDefinitions: taskDefinitions }).subscribe(() => {
      if (this.taskDefinitions.items.length === 0 &&
        this.taskDefinitions.pageNumber > 0) {
        this.taskDefinitions.pageNumber = this.taskDefinitions.pageNumber - 1;
      }
      this.refresh();
    });
  }

  /**
   * Route to {@link TaskDefinition} details page.
   * @param {TaskDefinition} taskDefinition
   */
  details(taskDefinition: TaskDefinition) {
    this.router.navigate([`tasks/definitions/${taskDefinition.name}`]);
  }

  /**
   * Route to {@link TaskDefinition} launch page.
   * @param {TaskDefinition} taskDefinition
   */
  launch(taskDefinition: TaskDefinition) {
    this.router.navigate([`tasks/definitions/launch/${taskDefinition.name}`]);
  }

}
