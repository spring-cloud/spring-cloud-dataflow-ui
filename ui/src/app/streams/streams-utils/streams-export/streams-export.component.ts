import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StreamsService } from '../../streams.service';
import { OrderParams } from '../../../shared/components/shared.interface';
import { map } from 'rxjs/operators';
import { StreamDefinition } from '../../model/stream-definition';
import { Page } from '../../../shared/model';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';
import { StreamsUtilsService } from '../streams-utils.service';
import { NotificationService } from '../../../shared/services/notification.service';

/**
 * Streams Export
 * The user can selected the streams to export (by default, all streams are selected).
 * The action will create a JSON file and force the download.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-streams-export',
  styleUrls: ['./../styles.scss'],
  templateUrl: './streams-export.component.html'
})
export class StreamsExportComponent implements OnInit {

  /**
   * Streams observable
   */
  streams$: Observable<any>;

  /**
   * Count selected streams
   */
  selected = 0;

  /**
   * Checkbox state
   */
  form = {
    checkboxes: []
  };

  /**
   * Constructor
   *
   * @param streamsService
   * @param blockerService
   * @param streamsUtilsService
   * @param notificationService
   * @param router
   */
  constructor(private streamsService: StreamsService,
              private blockerService: BlockerService,
              private streamsUtilsService: StreamsUtilsService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  /**
   * Retrieve streams metrics (total count)
   */
  ngOnInit() {
    this.streams$ = this.streamsService.getDefinitions({
      q: '',
      page: 0,
      size: 10000,
      sort: 'name',
      order: OrderParams.ASC,
    }).pipe(
      map((page: Page<StreamDefinition>) => {
        this.form.checkboxes = page.items.map(() => true);
        this.changeCheckboxes();
        return page;
      })
    );
  }

  /**
   * Handler change for checkbox
   * Update the selected state
   */
  changeCheckboxes() {
    this.selected = this.form.checkboxes.filter(item => !!item).length;
  }


  /**
   * Run the export streams
   */
  exportStreams(streams) {
    const streamsSelected = streams.filter((item, index) => !!this.form.checkboxes[index]);
    if (streamsSelected.length > 0) {
      this.blockerService.lock();
      this.streamsUtilsService.createFile(streamsSelected);
      this.blockerService.unlock();
    } else {
      this.notificationService.error('Please, select streams to export.');
    }
  }

  /**
   * Navigate to the streams list
   */
  cancel() {
    this.router.navigate(['streams']);
  }

}
