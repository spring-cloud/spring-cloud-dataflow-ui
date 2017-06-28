export class Page<T> { 
    totalPages: number;
    totalElements: number;
    pageNumber: number = 1;
    pageSize: number = 10;
    items: T[];
    filter: string = '';
}