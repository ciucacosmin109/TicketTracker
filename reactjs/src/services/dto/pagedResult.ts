export interface PagedResult<T> {
  totalCount: number;
  items: T[];
}
