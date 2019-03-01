import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PropertiesGroupModel } from '../support/properties-group-model';
import { Properties } from 'spring-flo';
import PropertiesSource = Properties.PropertiesSource;

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-properties-dialog-content',
  templateUrl: 'properties-dialog.component.html',
  styleUrls: [ 'properties-dialog.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class PropertiesDialogComponent implements OnInit {

  public title: string;

  propertiesGroupModel: PropertiesGroupModel;

  propertiesFormGroup: FormGroup;

  showProperties = false;

  constructor(private bsModalRef: BsModalRef
  ) {
    this.propertiesFormGroup = new FormGroup({});
  }

  handleOk() {
    this.propertiesGroupModel.applyChanges();
    this.bsModalRef.hide();
  }

  handleCancel() {
    this.bsModalRef.hide();
  }

  get okDisabled() {
    return !this.propertiesGroupModel
      || !this.propertiesFormGroup
      || this.propertiesFormGroup.invalid
      || !this.propertiesFormGroup.dirty;
  }

  ngOnInit() {
  }

  setData(propertiesSource: PropertiesSource) {
    this.propertiesGroupModel = new PropertiesGroupModel(propertiesSource);
    this.propertiesGroupModel.load();
    this.propertiesGroupModel.loadedSubject.subscribe();
  }

}
