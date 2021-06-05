import {PagedRequestDto} from '../../dto/pagedRequestDto';

export class GetAllProjectUsersInput extends PagedRequestDto { 
    projectId?: number;
    ticketId?: number;
}