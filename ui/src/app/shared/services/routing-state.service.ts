import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * This service provides a way to navigate into the history
 *
 * @author Damien Vitrac
 */
@Injectable()
export class RoutingStateService {

  /**
   * History array
   * @type {Array}
   */
  private history = [];

  /**
   * Constructor
   *
   * @param {Router} router
   */
  constructor(private router: Router) {
  }

  /**
   * Start to watch and store the route changes
   */
  public watchRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        this.history = [...this.history, { time: new Date().getTime(), url: urlAfterRedirects }];
      });
  }

  /**
   * Return the store history
   * @returns {string[]}
   */
  public getHistory(): string[] {
    return this.history.map((history) => history.url);
  }

  /**
   * Performs a back action
   * Update the history variable
   *
   * @param {string} defaultUrl Redirect to this URL if the history is not available
   * @param {RegExp} isNotRegex Negative regex
   */
  public back(defaultUrl: string, isNotRegex?: RegExp) {
    let url = defaultUrl;
    if (this.history.length > 1) {
      const item = this.history.slice(0, this.history.length - 1)
        .reverse()
        .find((history) => {
          return !isNotRegex || !(isNotRegex.test(history.url));
        });
      if (item) {
        this.history = this.history.slice(0, this.history.indexOf(item));
        url = item.url;
      }
    }
    this.router.navigate([url]);
  }

}
