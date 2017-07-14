import { PaginationInstance } from 'ngx-pagination'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

/**
 * Central class for pagination support. Holds typed collections that can be
 * paginated over.
 *
 * @author Gunnar Hillert
 */
export class Page<T> {
  totalPages: number;
  totalElements: number;

  /**
   * The page number is 0-index-based.
   */
  pageNumber: number = 0;
  pageSize: number = 10;
  items: T[];
  filter: string = '';
  paginationId: 'pagination-instance';

  /**
   * Helper method for ngx-pagination. Allows for passing in
   * pagination meta information directly to ngx-pagination
   * by conforming to the {@link PaginationInstance} interface.
   *
   * If using multiple pagination controls on the page,
   * you may need to set the {@link Page#paginationId} to a different
   * value.
   *
   * One important fact is that the returned currentPage number
   * for {@link PaginationInstance} is 1-index-based. The conversion
   * is done implicitly.
   */
  public getPaginationInstance(): PaginationInstance {
    return {
      id: this.paginationId,
      itemsPerPage: this.pageSize,
      currentPage: this.pageNumber+1,
      totalItems: this.totalElements
    };
  }

  public getItemsAsObservable(): Observable<T[]> {
    return Observable.of(this.items);
  }
}
