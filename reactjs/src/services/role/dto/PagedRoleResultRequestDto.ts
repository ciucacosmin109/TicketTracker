import { PagedAndSortedRequest } from '../../dto/pagedAndSortedRequest';

export interface PagedRoleResultRequestDto extends PagedAndSortedRequest  {
    keyword: string
}
