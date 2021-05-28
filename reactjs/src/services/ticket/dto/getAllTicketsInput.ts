import { PagedAndSortedRequestDto } from "../../dto/pagedAndSortedRequestDto";

export class GetAllTicketsInput extends PagedAndSortedRequestDto {
    componentId?: number;
    projectId?: number;
}