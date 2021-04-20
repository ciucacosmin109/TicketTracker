import { PagedAndSortedRequestDto } from '../../dto/pagedAndSortedRequestDto';

export class SearchAccountsInput extends PagedAndSortedRequestDto {
    keyword!: string;
}