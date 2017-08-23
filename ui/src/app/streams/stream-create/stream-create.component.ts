import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Flo } from 'spring-flo';


export class Metamodel implements Flo.Metamodel {

  constructor() {
  }

  textToGraph(flo: Flo.EditorContext, dsl: string) {
  }

  graphToText(flo: Flo.EditorContext) {
    console.log('Graph -> Text');
    return Promise.resolve('');
  }

  load(): Promise < Map < string, Map < string, Flo.ElementMetadata >>> {
    const data = new Map();
    return Promise.resolve(data);
  }

  groups(): Array < string > {
    return [];
  }

}

@Component({
  selector: 'app-stream-create',
  templateUrl: './stream-create.component.html',
  styleUrls: [ './flo.css' ],
  encapsulation: ViewEncapsulation.None

})
export class StreamCreateComponent implements OnInit {

  dsl: string;

  editorContext: Flo.EditorContext;

  metamodel = new Metamodel();

  paletteSize = 170;

  constructor() { }

  ngOnInit() {
  }

}
