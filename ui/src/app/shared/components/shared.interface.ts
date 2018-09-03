
export class OrderParams {
  static ASC = 'ASC';
  static DESC = 'DESC';
}

export interface SortParams {
  order: string;
  sort: string;
}

export interface PaginationParams {
  page: number;
  size: number;
}

export interface ListParams extends SortParams, PaginationParams {
  page: number;
  size: number;
  sort: string;
  order: string;
}

export interface ListDefaultParams extends SortParams, PaginationParams {
  q: string;
  page: number;
  size: number;
  sort: string;
  order: string;
}
