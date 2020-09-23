import { Component, ViewChild } from '@angular/core';
import { ClrWizard } from '@clr/angular';
import { StreamService } from '../../../shared/api/stream.service';
import { delay, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../../../shared/service/notification.service';

const STREAM_DESCRIPTION = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque '
  + 'laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta '
  + 'sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur '
  + 'magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor '
  + 'sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam '
  + 'aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit '
  + 'laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate '
  + 'velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
  + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore '
  + 'magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo '
  + 'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. '
  + 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

@Component({
  selector: 'app-dev-stream-create',
  templateUrl: './stream-create.component.html',
  styleUrls: ['./../dashboard.component.scss']
})
export class StreamCreateComponent {
  isOpen = false;
  processing = false;
  @ViewChild('wizard') wizard: ClrWizard;
  step = 0;

  predefineDsl = '';

  model = {
    names: {
      value: 'foo::VAR',
      min: 10,
      max: 20
    },
    descriptions: {
      min: 10,
      max: 50
    },
    dsl: {
      value: 'file | log'
    },
    options: {
      count: 20,
      delay: 0,
      deploy: false
    }
  };

  constructor(private streamService: StreamService,
              private notificationService: NotificationService) {
  }

  open() {
    this.wizard.reset();
    this.model = {
      names: {
        value: 'foo::VAR',
        min: 10,
        max: 20
      },
      descriptions: {
        min: 10,
        max: 50
      },
      dsl: {
        value: 'file | log'
      },
      options: {
        count: 20,
        delay: 0,
        deploy: false
      }
    };
    this.processing = false;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  generateStreamName(pattern: string, min: number, max: number) {
    let random = min;
    if (min < max) {
      random = Math.floor(Math.random() * (max - min + 1) + min);
    }
    const dummy = Array(random).fill(0).map(x => Math.random().toString(36).charAt(2)).join('');
    return pattern.replace('::VAR', dummy);
  }

  generateStreamDescription(min: number, max: number) {
    let random = min;
    if (min < max) {
      random = Math.floor(Math.random() * (max - min + 1) + min);
    }
    if (random < STREAM_DESCRIPTION.length) {
      return STREAM_DESCRIPTION.substr(0, random);
    }
    return STREAM_DESCRIPTION;
  }

  submit() {
    this.step = 0;
    this.processing = true;
    const observables = Array.from({ length: this.model.options.count }).map(() => {
      const name = this.generateStreamName(this.model.names.value, this.model.names.min, this.model.names.max);
      const description = this.generateStreamDescription(this.model.descriptions.min, this.model.descriptions.max);
      return this.streamService
        .createStream(name, this.model.dsl.value, description)
        .pipe(
          mergeMap(() => {
            if (this.model.options.deploy) {
              return this.streamService.deployStream(name)
                .pipe(delay(2000));
            }
            return of(name);
          }),
          map((result) => {
            this.step += 1;
            return result;
          })
        );
    });
    this.execute([...observables]);
  }

  execute(operations: Array<Observable<any>>) {
    if (!operations || operations.length === 0) {
      this.notificationService.success('Creation success', 'The streams have been created.');
      this.isOpen = false;
      return;
    }
    const operation = operations.shift();
    operation
      .pipe(
        delay(Math.max(this.model.options.delay * 1000, 50))
      )
      .subscribe(() => {
        this.execute(operations);
      }, () => {
        // ERROR
        this.execute(operations);
      });
  }

  get progress() {
    if (this.step > 0) {
      return Math.round(this.step / this.model.options.count * 100);
    }
    return 0;
  }

  loadDsl() {
    switch (this.predefineDsl) {
      case '1':
        this.model.dsl.value = 'log | file';
        break;
      case '2':
        this.model.dsl.value = `time=time: time | log
minutes=:time.time > transform --expression=payload.substring(2,4) | log
seconds=:time.time > transform --expression=payload.substring(4) | log`;
        break;
      case '3':
        this.model.dsl.value = `STREAM-1=time | scriptable-transform --script="return ""#{payload.tr('^A-Za-z0-9', '')}""" --language=ruby | log
:STREAM-1.time > scriptable-transform --script="function double(p) { return p + '--' + p; }\\ndouble(payload);" --language=javascript | log
:STREAM-1.time > scriptable-transform --script="return payload + '::' + payload" --language=groovy | log`;
        break;
    }
    setTimeout(() => {
      this.predefineDsl = '';
    });
  }

}
