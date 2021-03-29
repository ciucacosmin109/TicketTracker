import { PagedAndSortedRequest } from '../../dto/pagedAndSortedRequest';

export interface PagedUserResultRequestDto extends PagedAndSortedRequest  {
    keyword: string
}
