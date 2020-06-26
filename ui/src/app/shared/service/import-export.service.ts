import { Injectable } from '@angular/core';
import { Stream } from '../model/stream.model';
import { DateTime } from 'luxon';
import { saveAs } from 'file-saver';
import { Task } from '../model/task.model';
import { combineLatest, Observable, of, Subscriber } from 'rxjs';
import get from 'lodash.get';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { StreamService } from '../api/stream.service';
import { TaskService } from '../api/task.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ParserService } from '../../flo/shared/service/parser.service';

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {

  constructor(private streamService: StreamService,
              private taskService: TaskService,
              private parserService: ParserService) {
  }

  streamsExport(streams: Stream[]): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      const json = JSON.stringify({
        date: new Date().getTime(),
        streams
      });
      const date = DateTime.local().toFormat('yyyy-MM-HHmmss');
      const filename = `streams-export_${date}.json`;
      const blob = new Blob([json], { type: 'application/json' });
      saveAs(blob, filename);
      subscriber.next(true);
      subscriber.complete();
    });
  }

  tasksExport(tasks: Task[]): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      const json = JSON.stringify({
        date: new Date().getTime(),
        tasks
      });
      const date = DateTime.local().toFormat('yyyy-MM-HHmmss');
      const filename = `tasks-export_${date}.json`;
      const blob = new Blob([json], { type: 'application/json' });
      saveAs(blob, filename);
      subscriber.next(true);
      subscriber.complete();
    });
  }

  streamsImport(file: Blob, optimize: boolean): Observable<any> {
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
        let streams = json.streams.map(
          line => {
            const parser = this.parserService.parseDsl(line.dslText as string, 'stream');
            let parent = '';
            const apps = parser.lines[0].nodes
              .map((node) => {
                if (get(node, 'sourceChannelName') && get(node, 'sourceChannelName').startsWith(`tap:`)) {
                  parent = get(node, 'sourceChannelName')
                    .replace('tap:', '')
                    .split('.')[0];
                }
                return {
                  origin: node.name,
                  name: get(node, 'label') || get(node, 'name'),
                  type: node.type.toString()
                };
              });
            return {
              name: line.name,
              dsl: line.originalDslText,
              description: line.description,
              application: apps,
              parent
            };
          }
        );
        if (optimize) {
          streams = streams.sort((a, b) => {
            if (a.name === b.parent) {
              return -1;
            }
            return 1;
          });
        }
        return streams;
      }),
      mergeMap(
        val => {
          const streams$ = val.map(item => {
            return this.streamService
              .createStream(item.name, item.dsl, item.description)
              .pipe(
                map((response: HttpResponse<any>) => {
                  return {
                    created: true,
                    name: response.body.name,
                    dslText: response.body.dslText,
                  };
                }),
                catchError((error: HttpErrorResponse) => {
                  return of({
                    created: false,
                    name: item.name,
                    dslText: item.dsl,
                    error,
                    message: error.message
                  });
                })
              );
          });
          /* tslint:disable-next-line */
          return combineLatest(streams$);
        }
      ),
    );
  }

  tasksImport(file: Blob, excludeChildren: boolean): Observable<any> {
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
        if (!excludeChildren) {
          return json.tasks;
        }
        const composedName = json.tasks.reduce((p, c) => {
          if (c.composed) {
            p.push(`${c.name}-`);
          }
          return p;
        }, []);

        return json.tasks.filter(item => {
          return !composedName.find(name => item.name.startsWith(name));
        });
      }),
      mergeMap(
        val => {
          const tasks$ = val.map(item => {
            return this.taskService
              .createTask(item.name, item.dslText, item.description)
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
                    error,
                    message: error.message
                  });
                })
              );
          });
          /* tslint:disable-next-line */
          return combineLatest(tasks$);
        }
      ),
    );
  }

}
