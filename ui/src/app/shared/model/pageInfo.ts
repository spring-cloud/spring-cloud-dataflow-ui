import { PaginationInstance } from 'ngx-pagination'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class PageInfo {
  pageNumber: number = 0;
  pageSize: number = 10;
}
