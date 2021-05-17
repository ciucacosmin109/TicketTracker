import {PagedAndSortedRequestDto} from '../../dto/pagedAndSortedRequestDto';

export class GetAllCommentsInput extends PagedAndSortedRequestDto {
    ticketId!: number;
}