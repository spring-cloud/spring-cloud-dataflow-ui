import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, Subscriber } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { saveAs } from 'file-saver/FileSaver';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Parser } from '../../shared/services/parser';
import { TasksService } from '../tasks.service';
import { TaskDefinition } from '../model/task-definition';

@Injectable()
export class TasksUtilsService {

  constructor(private tasksService: TasksService) {
  }

  createFile(tasks: TaskDefinition[]) {
    const json = JSON.stringify({
      date: new Date().getTime(),
      tasks: tasks
    });
    const date = DateTime.local().toFormat('yyyy-MM-HHmmss');
    const filename = `tasks-export_${date}.json`;
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, filename);
    return true;
  }

  importTasks(file: Blob, options: any): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      if (!file) {
        subscriber.error('No file');
        subscriber.complete();
      }
      try {
        const reader = new FileReader();
        reader.onloadend = (e) => {
          try {
            const json = JSON.parse(reader.result.toString());
            subscriber.next(json);
            subscriber.complete();
          } catch (err) {
            subscriber.error('Invalid File');
            subscriber.complete();
          }
        };
        reader.readAsText(file);
      } catch (e) {
        subscriber.error('Invalid File');
        subscriber.complete();
      }
    }).pipe(
      map((json) => {
        if (!options.excludeChildren) {
          return json.tasks;
        }
        const composedName = json.tasks.reduce((p, c) => {
          if (c.composed) {
            p.push(`${c.name}-`);
          }
          return p;
        }, []);

        const tasks = json.tasks.filter(item => {
          return !composedName.find(name => item.name.startsWith(name));
        });
        return tasks;
      }),
      mergeMap(
        val => {
          const tasks$ = val.map(item => {
            return this.tasksService
              .createDefinition({ name: item.name, definition: item.dslText, description: item.description })
              .pipe(
                map(() => {
                  return {
                    created: true,
                    name: item.name,
                    dslText: item.dslText,
                  };
                }),
                catchError((error: HttpErrorResponse) => {
                  return of({
                    created: false,
                    name: item.name,
                    dslText: item.dslText,
                    error: error,
                    message: error.message
                  });
                })
              );
          });
          return combineLatest(tasks$);
        }
      ),
    );
  }


}
