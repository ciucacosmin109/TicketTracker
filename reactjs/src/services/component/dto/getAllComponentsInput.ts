import {PagedAndSortedRequestDto} from '../../dto/pagedAndSortedRequestDto'

export class GetAllComponentsInput extends PagedAndSortedRequestDto {
    projectId!: number;
}