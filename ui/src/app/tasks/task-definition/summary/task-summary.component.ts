import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Parser } from '../../../shared/services/parser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TasksService } from '../../tasks.service';
import { TaskDefinition } from '../../model/task-definition';
import { TaskDefinitionsDestroyComponent } from '../../task-definitions-destroy/task-definitions-destroy.component';

/**
 * Component that shows the summary details of a Stream Definition
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-summary',
  templateUrl: 'task-summary.component.html',
  styleUrls: ['../styles.scss'],
})
export class TaskSummaryComponent implements OnInit {

  /**
   * Observable of stream information
   * Contains the stream definition, a list of the streams"s apps
   */
  task$: Observable<any>;

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {BsModalService} modalService
   * @param {Router} router
   * @param {TasksService} tasksService
   */
  constructor(private route: ActivatedRoute,
              private modalService: BsModalService,
              private router: Router,
              private tasksService: TasksService) {
  }

  /**
   * Init component, call refresh method
   */
  ngOnInit() {
    this.refresh();
  }

  /**
   * Refresh
   * Create an observable which provides the required data
   */
  refresh() {
    this.task$ = this.route.parent.params
      .pipe(mergeMap(
        val => this.tasksService.getDefinition(val.id),
        (val1: Params, val2: TaskDefinition) => val2
      ))
      .pipe(mergeMap(
        val => Observable.of(Parser.parse(val.dslText as string, 'task')),
        (val1: TaskDefinition, val2: any) => ({
          taskDefinition: val1,
          apps: val2.lines[0].nodes
            .map((node) => (
              {
                origin: node['name'],
                name: node['label'] || node['name'],
                type: node.type.toString()
              }
            ))
        })
      ));
  }

  /**
   * Deploy the stream, navigation to the dedicate page
   *
   * @param {TaskDefinition} taskDefinition
   */
  launch(taskDefinition: TaskDefinition) {
    this.router.navigate([`/tasks/definitions/launch/${taskDefinition.name}`]);
  }

  /**
   * Destroy the task
   *
   * @param {TaskDefinition} taskDefinition
   */
  destroy(taskDefinition: TaskDefinition) {
    console.log(`Destroy ${taskDefinition.name} task definition.`, taskDefinition.name);
    this.modal = this.modalService.show(TaskDefinitionsDestroyComponent, { class: 'modal-md' });
    this.modal.content.open({ taskDefinitions: [taskDefinition] }).subscribe(() => {
      this.router.navigate([`/tasks/definitions`]);
    });
  }

}
