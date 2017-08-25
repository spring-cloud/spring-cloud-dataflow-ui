import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Flo } from 'spring-flo';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';
import { EditorService } from '../flo/editor.service';

@Component({
  selector: 'app-stream-create',
  templateUrl: './stream-create.component.html',
  styleUrls: [ '../flo/flo.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class StreamCreateComponent implements OnInit {

  dsl: string;

  editorContext: Flo.EditorContext;

  paletteSize = 170;

  constructor(public metamodelService : MetamodelService,
              public renderService : RenderService,
              public editorService : EditorService) {
    console.log('Building');
  }

  ngOnInit() {
  }

}
