import {TicketPriority} from './ticketPriority';
import {TicketType} from './ticketType';

export class CreateTicketInput {
    title!: string;
    description?: string;
    priority!: TicketPriority;
    type!: TicketType;

    componentId!: number;
    statusId!: number;
    activityId?: number; 
}