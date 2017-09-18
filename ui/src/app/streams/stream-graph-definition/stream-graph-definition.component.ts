import { Component, ViewEncapsulation, Input } from '@angular/core';
import { Flo } from 'spring-flo';
import { StreamDefinition } from '../model/stream-definition';
import { StreamMetrics } from '../model/stream-metrics';

@Component({
  selector: 'app-stream-graph-definition',
  templateUrl: './stream-graph-definition.component.html',
  styleUrls: [ '../flo/flo.scss', './stream-graph-definition.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class StreamGraphDefinitionComponent {

  @Input()
  stream: StreamDefinition;

  @Input()
  metrics: StreamMetrics;

  flo: Flo.EditorContext;

  constructor() {}

  get dsl(): string {
    return this.stream ? this.stream.dslText.toString() : undefined;
  }

  get status(): string[] {
    return this.stream ? [ this.stream.status.toString() ] : [];
  }

  setEditorContext(editorContext: Flo.EditorContext) {
    this.flo = editorContext;
  }

}
