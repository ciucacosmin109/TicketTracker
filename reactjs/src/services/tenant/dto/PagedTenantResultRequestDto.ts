import { PagedAndSortedRequest } from '../../dto/pagedAndSortedRequest';

export interface PagedTenantResultRequestDto extends PagedAndSortedRequest  {
    keyword: string
}
