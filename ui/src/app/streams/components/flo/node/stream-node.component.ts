import { Component, ViewEncapsulation } from '@angular/core';
import { NodeComponent } from '../../../../shared/flo/support/node-component';
import { DocService } from '../../../../shared/services/doc.service';

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-flo-node',
  templateUrl: 'stream-node.component.html',
  styleUrls: ['./stream-node.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StreamNodeComponent extends NodeComponent {

  constructor(docService: DocService) {
    super(docService);
  }

}

