import {PagedAndSortedRequestDto} from '../../dto/pagedAndSortedRequestDto';

export class GetAllProjectsInput extends PagedAndSortedRequestDto {
    isPublic?: boolean; 
}