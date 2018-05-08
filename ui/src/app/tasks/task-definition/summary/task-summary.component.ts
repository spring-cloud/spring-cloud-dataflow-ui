import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Parser } from '../../../shared/services/parser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TasksService } from '../../tasks.service';
import { TaskDefinition } from '../../model/task-definition';
import { TaskDefinitionsDestroyComponent } from '../../task-definitions-destroy/task-definitions-destroy.component';
import { ToolsService } from '../../components/flo/tools.service';
import { TaskConversion } from '../../components/flo/model/models';
import { LoggerService } from '../../../shared/services/logger.service';

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
   * @param {ToolsService} toolsService
   * @param {LoggerService} loggerService
   * @param {TasksService} tasksService
   */
  constructor(private route: ActivatedRoute,
              private modalService: BsModalService,
              private router: Router,
              private toolsService: ToolsService,
              private loggerService: LoggerService,
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
        val => this.toolsService.parseTaskTextToGraph(val.dslText, val.name),
        (val1: TaskDefinition, val2: TaskConversion) => {
          let apps = [];
          if (val2.graph && val2.graph.nodes) {
            apps = val2.graph.nodes.map((node) => {
              if (node.name === 'START' || node.name === 'END') {
                return null;
              }
              const item = {
                name: node.name,
                origin: node.name,
                type: 'task'
              };
              if (node.metadata && node.metadata['label']) {
                item.name = node.metadata['label'];
              }
              return item;
            }).filter((app) => app !== null);
          }
          return {
            taskDefinition: val1,
            apps: apps
          };
        }
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
    this.loggerService.log(`Destroy ${taskDefinition.name} task definition.`, taskDefinition.name);
    this.modal = this.modalService.show(TaskDefinitionsDestroyComponent, { class: 'modal-md' });
    this.modal.content.open({ taskDefinitions: [taskDefinition] }).subscribe(() => {
      this.router.navigate([`/tasks/definitions`]);
    });
  }

}
