export class Page<T> { 
    totalPages: number;
    totalElements: number;
    pageNumber: number;
    pageSize: number = 10;
    items: T[];
}