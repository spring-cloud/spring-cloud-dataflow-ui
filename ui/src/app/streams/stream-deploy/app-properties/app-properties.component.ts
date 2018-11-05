import { Component, EventEmitter, ViewEncapsulation } from '@angular/core';
import { PropertiesDialogComponent } from '../../../shared/flo/properties/properties-dialog.component';
import { BsModalRef } from 'ngx-bootstrap';
import { StreamsService } from '../../streams.service';
import { StreamAppPropertiesSource, StreamHead } from '../../components/flo/properties/stream-properties-source';
import { StreamPropertiesGroupModel } from '../../components/flo/properties/stream-properties-dialog.component';
import { Properties } from 'spring-flo';
import { of } from 'rxjs';

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-deploy-app-properties',
  templateUrl: '../../../shared/flo/properties/properties-dialog.component.html',
  styleUrls: ['../../../shared/flo/properties/properties-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StreamDeployAppPropertiesComponent extends PropertiesDialogComponent {

  public title: string;

  constructor(bsModalRef: BsModalRef,
              private streamService: StreamsService) {

    super(bsModalRef);
  }

  setData(propertiesSource: StreamAppPropertiesSource) {
    this.propertiesGroupModel = new StreamPropertiesGroupModel(
      propertiesSource,
      this.streamService);
    this.propertiesGroupModel.load();
  }

}

export class AppPropertiesSource implements StreamAppPropertiesSource {

  private options: Array<any>;
  public confirm = new EventEmitter();

  constructor(options: Array<any>) {
    this.options = options;
  }

  getStreamHead(): StreamHead {
    return {presentStreamNames: []};
  }

  getProperties(): Promise<Properties.Property[]> {
    return of(this.options).toPromise();
  }

  applyChanges(properties: Properties.Property[]): void {
    this.confirm.emit(properties);
  }

}
