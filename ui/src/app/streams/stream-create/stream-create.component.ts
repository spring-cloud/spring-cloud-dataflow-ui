import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Flo } from 'spring-flo';
import { MetamodelService } from '../flo/metamodel.service';

@Component({
  selector: 'app-stream-create',
  templateUrl: './stream-create.component.html',
  styleUrls: [ '../flo/flo.css' ],
  encapsulation: ViewEncapsulation.None

})
export class StreamCreateComponent implements OnInit {

  dsl: string;

  editorContext: Flo.EditorContext;

  paletteSize = 170;

  constructor(public metamodel : MetamodelService) {
    console.log('Building');
  }

  ngOnInit() {
  }

}
