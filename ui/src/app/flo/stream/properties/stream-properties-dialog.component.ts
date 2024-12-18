import {Component, ViewEncapsulation} from '@angular/core';
import {Properties} from 'spring-flo';
import {Validators} from '@angular/forms';
import {StreamAppPropertiesSource} from './stream-properties-source';
import {PropertiesGroupModel} from '../../shared/support/properties-group-model';
import {StreamService} from '../../../shared/api/stream.service';
import {Observable} from 'rxjs';
import {AppUiProperty} from '../../shared/support/app-ui-property';
import {PropertiesDialogComponent} from '../../shared/properties/properties-dialog.component';

// CM extension necessary for snippet support syntax highlighting
// Lint support
import 'codemirror/addon/lint/javascript-lint';
// Supported languages until dynamic loading
import 'codemirror/mode/groovy/groovy';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/python/python';
import {TranslateService} from '@ngx-translate/core';

/**
 * Utility class for working with Properties.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
export class StreamPropertiesGroupModel extends PropertiesGroupModel {
  constructor(
    propertiesSource: StreamAppPropertiesSource,
    private streamService: StreamService,
    private translate: TranslateService
  ) {
    super(propertiesSource);
  }

  protected createControlModel(property: AppUiProperty): Properties.ControlModel<any> {
    const inputType = Properties.InputType.TEXT;
    let validation: Properties.Validation;
    if (property.isSemantic) {
      return super.createControlModel(property);
    } else {
      // Notational properties
      if (property.id === 'label') {
        validation = {
          validator: Validators.pattern(/^[\w_]+[\w_-]*$/),
          errorData: [{id: 'pattern', message: this.translate.instant('flo.stream.invalidAppLabel')}]
        };
      } else if (property.id === 'stream-name') {
        validation = {
          validator: [
            Validators.pattern(/^[\w_]+[\w_-]*$/),
            Properties.Validators.noneOf(
              (this.propertiesSource as StreamAppPropertiesSource).getStreamHead().presentStreamNames
            )
          ],
          asyncValidator: Properties.Validators.uniqueResource(value => this.isUniqueStreamName(value), 500),
          errorData: [
            {id: 'pattern', message: this.translate.instant('flo.stream.invalidStreamName')},
            {id: 'uniqueResource', message: this.translate.instant('flo.stream.uniqueStreamName')},
            {id: 'noneOf', message: this.translate.instant('flo.stream.noneOfStreamName')}
          ]
        };
      }
    }
    return new Properties.GenericControlModel(property, inputType, validation);
  }

  isUniqueStreamName(name: string): Observable<boolean> {
    return new Observable<boolean>(obs => {
      if (name) {
        this.streamService.getStream(name).subscribe(
          def => {
            if (def) {
              obs.next(false);
            } else {
              obs.next(true);
            }
            obs.complete();
          },
          () => {
            obs.next(true);
            obs.complete();
          }
        );
      } else {
        obs.next(true);
        obs.complete();
      }
    });
  }
}

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-stream-properties-dialog-content',
  templateUrl: '../../shared/properties/properties-dialog.component.html',
  styleUrls: ['../../shared/properties/properties-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StreamPropertiesDialogComponent extends PropertiesDialogComponent {
  public title: string;

  constructor(
    private streamsService: StreamService,
    private translate: TranslateService
  ) {
    super();
  }

  setData(propertiesSource: StreamAppPropertiesSource): void {
    this.propertiesGroupModel = new StreamPropertiesGroupModel(propertiesSource, this.streamsService, this.translate);
    this.propertiesGroupModel.load();
    this.propertiesGroupModel.loadedSubject.subscribe(() => {
      this.setGroupedProperties();
    });
  }
}
