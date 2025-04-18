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
    const l = new PagedList<U>();
    l.paging = {} as Pager;
    l.paging.offset = parseInt(offset.toString());
    l.paging.limit = parseInt(limit.toString());
    l.paging.total = items.length;
    l.paging.page = 0;

    l.paging.pageCount = Math.ceil(items.length / l.paging.limit);
    l.paging.page = (offset == 0 ? 0 : l.paging.offset / l.paging.limit) + 1;
    const end: number = l.paging.offset + l.paging.limit;
    l.items = [];
    for (let i = offset; i < end; i++) {
      l.items.push(items[i]);
    }
    return l;
  }
}
