export class PagedResultDto<T> {
    totalCount!: number;
    items!: T[]; 
}