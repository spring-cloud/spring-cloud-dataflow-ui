import { PaginationInstance } from 'ngx-pagination';
import { Observable, of } from 'rxjs';

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
  pageNumber = 0;
  pageSize = 10;
  items: T[] = [];
  filter = {};
  sort = {};
  paginationId: 'pagination-instance';

  public static fromJSON<T>(input): Page<T> {
    const page = new Page<T>();
    if (input && input.page) {
      page.pageNumber = input.page.number;
      page.pageSize = input.page.size;
      page.totalElements = input.page.totalElements;
      page.totalPages = input.page.totalPages;
    }
    return page;
  }

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
      currentPage: this.pageNumber + 1,
      totalItems: this.totalElements
    };
  }

  public getItemsAsObservable(): Observable<T[]> {
    return of(this.items);
  }

  public update(page: Page<T> ) {
    this.items.length = 0;
    this.items.push(...page.items);
    this.pageNumber = page.pageNumber;
    this.pageSize = page.pageSize;
    this.totalElements = page.totalElements;
    this.totalPages = page.totalPages;
  }

}
