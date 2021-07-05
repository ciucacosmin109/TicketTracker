import {PagedRequestDto} from '../../dto/pagedRequestDto';

export class GetAllProjectUsersInput extends PagedRequestDto { 
    projectId?: number;
    componentId?: number;
    ticketId?: number;
}