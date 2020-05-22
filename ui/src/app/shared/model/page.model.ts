export class Page<T> {
  pages = 0;
  total = 0;
  page = 1;
  size = 20;
  items: T[] = [];

  public static fromJSON<T>(input): Page<T> {
    const page = new Page<T>();
    if (input && input.page) {
      page.page = input.page.number;
      page.size = input.page.size;
      page.total = input.page.totalElements;
      page.pages = input.page.totalPages;
    }
    return page;
  }
}
