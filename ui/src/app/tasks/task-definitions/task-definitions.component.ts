import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService } from 'ng2-toasty';
import { ModalDirective} from 'ngx-bootstrap/modal';
import { Page } from '../../shared/model/page';
import { Router } from '@angular/router';
import { TaskDefinition } from '../model/task-definition';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task-definition',
  templateUrl: './task-definitions.component.html',
})
export class TaskDefinitionsComponent implements OnInit {

  taskDefinitions: Page<TaskDefinition>;
  busy: Subscription;
  taskDefinitionToDestroy: TaskDefinition;

  // undefined indicates that order is not selected
  // thus we simply show double arrow.
  // for sorting toggles, we just switch
  // and first sort with true which equals desc
  definitionNameSort: boolean = undefined;
  definitionSort: boolean = undefined;

  @ViewChild('childPopover')
  public childPopover: PopoverDirective;

  @ViewChild('childModal')
  public childModal: ModalDirective;

  constructor(
    private tasksService: TasksService,
    private toastyService: ToastyService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadTaskDefinitions();
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
    this.tasksService.taskDefinitions.pageNumber = page - 1;
    this.loadTaskDefinitions();
  }

  loadTaskDefinitions() {
    console.log('Loading Task Definitions...', this.taskDefinitions);

    this.busy = this.tasksService.getDefinitions(this.definitionNameSort, this.definitionSort).subscribe(
      data => {
        this.taskDefinitions = data;
        this.toastyService.success('Task definitions loaded.');
      }
    );
  }

  bulkDefineTasks() {
    this.router.navigate(['tasks/bulk-define-tasks']);
  }

  launchTask(item: TaskDefinition) {
    this.router.navigate(['tasks/definitions/launch/' + item.name]);
  }

  destroyTask(item: TaskDefinition) {
    this.taskDefinitionToDestroy = item;
    this.showChildModal();
  }

  toggleDefinitionNameSort() {
    if (this.definitionNameSort === undefined) {
      this.definitionNameSort = true;
    } else if (this.definitionNameSort) {
      this.definitionNameSort = false;
    } else {
      this.definitionNameSort = undefined;
    }
    this.loadTaskDefinitions();
  }

  toggleDefinitionSort() {
    if (this.definitionSort === undefined) {
      this.definitionSort = true;
    } else if (this.definitionSort) {
      this.definitionSort = false;
    } else {
      this.definitionSort = undefined;
    }
    this.loadTaskDefinitions();
  }

  public proceed(taskDefinition: TaskDefinition): void {
    console.log('Proceeding to destroy definition...', taskDefinition);
    this.tasksService.destroyDefinition(taskDefinition.name).subscribe(
      data => {
        this.cancel();
        this.toastyService.success('Successfully destroyed task definition "'
          + taskDefinition.name + '"');
      },
      error => {
        this.toastyService.error(error);
      }
    );
  }

  /**
   * Route to {@link TaskDefinition} details page.
   * @param item the task definition to be displayed.
   */
  details(taskDefinition: TaskDefinition) {
    this.router.navigate(['tasks/definitions/' + taskDefinition.name]);
  }

  /**
   * Displays modal dialog box that confirms the user wants to destroy a {@link TaskDefinition}.
   */
  public showChildModal(): void {
    this.childModal.show();
  }

  /**
   *  Hides the modal dialog box that confirms whether the user wants to
   *  destroy a {@link TaskDefinition}.
   */
  public hideChildModal(): void {
    this.childModal.hide();
  }

  /**
   * Hides the modal dialog box.
   */
  public cancel = function() {
    this.hideChildModal();
  };
}
