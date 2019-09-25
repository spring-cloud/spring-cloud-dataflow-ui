import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, Subscriber } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { saveAs } from 'file-saver/FileSaver';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { StreamDefinition } from '../model/stream-definition';
import { Parser } from '../../shared/services/parser';
import { StreamsService } from '../streams.service';

@Injectable()
export class StreamsUtilsService {

  constructor(private streamsService: StreamsService) {
  }

  createFile(streams: StreamDefinition[]) {
    const json = JSON.stringify({
      date: new Date().getTime(),
      streams: streams
    });
    const date = DateTime.local().toFormat('yyyy-MM-HHmmss');
    const filename = `streams-export_${date}.json`;
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, filename);
    return true;
  }

  importStreams(file: Blob, options: any): Observable<any> {
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
            const parser = Parser.parse(line.dslText as string, 'stream');
            let parent = '';
            const apps = parser.lines[0].nodes
              .map((node) => {
                if (node['sourceChannelName'] && node['sourceChannelName'].startsWith(`tap:`)) {
                  parent = node['sourceChannelName']
                    .replace('tap:', '')
                    .split('.')[0];
                }
                return {
                  origin: node['name'],
                  name: node['label'] || node['name'],
                  type: node.type.toString()
                };
              });
            return {
              name: line.name,
              dsl: line.originalDslText,
              description: line.description,
              application: apps,
              parent: parent
            };
          }
        );
        if (options.optimize) {
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
            return this.streamsService
              .createDefinition(item.name, item.dsl, item.description)
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
                    error: error,
                    message: error.message
                  });
                })
              );
          });
          return combineLatest(streams$);
        }
      ),
    );
  }


}
