import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';
import { StreamsUtilsService } from '../streams-utils.service';
import { NotificationService } from '../../../shared/services/notification.service';

/**
 * Streams Import
 * The user can import a JSON file. The file has to be correctly formatted.
 * Each line will call the REST endpoint for stream creation.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-streams-import',
  styleUrls: ['./../styles.scss'],
  templateUrl: './streams-import.component.html'
})
export class StreamsImportComponent {

  /**
   * Current file
   */
  file: any;

  /**
   * View (file, result, loading)
   */
  view = 'file';

  /**
   * Result of an import
   * Contains the success/error items and info
   */
  result = {
    success: [],
    error: [],
    duration: 0
  };

  /**
   * Import options
   */
  options = {
    optimize: false
  };

  /**
   * Constructor
   *
   * @param streamsUtilsService
   * @param blockerService
   * @param notificationService
   * @param router
   */
  constructor(private streamsUtilsService: StreamsUtilsService,
              private blockerService: BlockerService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  /**
   * Handle file change
   * @param event
   */
  fileChanged(event) {
    try {
      this.file = event.target.files[0];
    } catch (e) {
      this.file = null;
    }
  }

  /**
   * Submit action
   * Parse the file, import all the lines
   * The import action returns a list of results if the file is correctly parsed
   */
  submit() {
    if (!this.file) {
      this.notificationService.error('Please, select a file.');
      return;
    }
    const date = new Date().getTime();
    this.blockerService.lock();
    this.changeView('loading');

    this.streamsUtilsService.importStreams(this.file, this.options)
      .subscribe((result) => {
          this.result = {
            success: result.filter(item => item.created),
            error: result.filter(item => !item.created),
            duration: Math.round((new Date().getTime() - date) / 1000)
          };
          this.changeView('result');
          this.blockerService.unlock();
        },
        () => {
          this.blockerService.unlock();
          this.changeView('file');
          this.notificationService.error('The file is not valid.');
        });
  }

  /**
   * Reset to first step
   */
  newImport() {
    this.file = null;
    this.result = {
      success: [],
      error: [],
      duration: 0
    };
    this.view = 'file';
  }

  /**
   * Change View
   * @param view
   */
  changeView(view: string) {
    this.view = view;
  }

  /**
   * Navigate to the applications list
   */
  cancel() {
    this.router.navigate(['streams']);
  }
}
