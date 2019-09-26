import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderParams } from '../../../shared/components/shared.interface';
import { map } from 'rxjs/operators';
import { Page } from '../../../shared/model';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { TasksService } from '../../tasks.service';
import { TasksUtilsService } from '../tasks-utils.service';
import { TaskDefinition } from '../../model/task-definition';

/**
 * Tasks Export
 * The user can selected the tasks to export (by default, all tasks are selected).
 * The action will create a JSON file and force the download.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-tasks-export',
  styleUrls: ['./../styles.scss'],
  templateUrl: './tasks-export.component.html'
})
export class TasksExportComponent implements OnInit {

  /**
   * Tasks observable
   */
  tasks$: Observable<any>;

  /**
   * Count selected tasks
   */
  selected = 0;

  /**
   * Checkbox state
   */
  form = {
    checkboxes: []
  };

  /**
   * Constructor
   *
   * @param tasksService
   * @param blockerService
   * @param tasksUtilsService
   * @param notificationService
   * @param router
   */
  constructor(private tasksService: TasksService,
              private blockerService: BlockerService,
              private tasksUtilsService: TasksUtilsService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  /**
   * Retrieve tasks metrics (total count)
   */
  ngOnInit() {
    this.tasks$ = this.tasksService.getDefinitions({
      q: '',
      page: 0,
      size: 10000,
      sort: 'taskName',
      order: OrderParams.ASC,
    }).pipe(
      map((page: Page<TaskDefinition>) => {
        this.form.checkboxes = page.items.map(() => true);
        this.changeCheckboxes();
        return page;
      })
    );
  }

  /**
   * Handler change for checkbox
   * Update the selected state
   */
  changeCheckboxes() {
    this.selected = this.form.checkboxes.filter(item => !!item).length;
  }


  /**
   * Run the export tasks
   */
  exportTasks(tasks) {
    const tasksSelected = tasks.filter((item, index) => !!this.form.checkboxes[index]);
    if (tasksSelected.length > 0) {
      this.blockerService.lock();
      this.tasksUtilsService.createFile(tasksSelected);
      this.blockerService.unlock();
    } else {
      this.notificationService.error('Please, select tasks to export.');
    }
  }

  /**
   * Navigate to the tasks list
   */
  cancel() {
    this.router.navigate(['tasks']);
  }

}
