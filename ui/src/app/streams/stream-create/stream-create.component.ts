import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Flo } from 'spring-flo';

@Component({
  selector: 'app-stream-create',
  templateUrl: './stream-create.component.html',
  styleUrls: [ './flo.css' ],
  encapsulation: ViewEncapsulation.None

})
export class StreamCreateComponent implements OnInit {

  dsl : string;

  private editorContext : Flo.EditorContext;
  private metamodel = new Metamodel();

  paletteSize = 170;

  constructor() { }

  ngOnInit() {
  }

}

export class Metamodel implements Flo.Metamodel {

  constructor() {
  }

  textToGraph(flo: Flo.EditorContext, dsl : string) {
  }

  graphToText(flo: Flo.EditorContext) {
    console.log('Graph -> Text');
    return Promise.resolve('');
  }

  load(): Promise < Map < string, Map < string, Flo.ElementMetadata >>> {
    let data = new Map();
    return Promise.resolve(data);
  }

  groups(): Array < string > {
    return [];
  }

}
