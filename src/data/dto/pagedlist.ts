export interface Pager {
  offset: number;
  limit: number;
  total: number;
  page: number;
  pageCount: number;
}

export class PagedList<T> {
  paging: Pager;
  items: T[];

  static fromArray<U>(items: U[], offset: number, limit: number): PagedList<U> {
    let l = new PagedList<U>();
    let pagesize = limit - offset;
    l.paging.offset = offset;
    l.paging.limit = limit;
    l.paging.total = items.lemgth;
    l.paging.page = 0;
    l.paging.pageCount = Math.ceil(items.length / pagesize);
    l.paging.page = (offset == 0 ? 0 : offset / pagesize) + 1;
    let end = offset + limit > items.length ? items.length : offset + limit;
    l.items = items.slice(offset, total);
    return l;
  }
}
