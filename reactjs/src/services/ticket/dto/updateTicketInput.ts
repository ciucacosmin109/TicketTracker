import { EntityDto } from "../../dto/entityDto";
import {TicketPriority} from './ticketPriority';
import {TicketType} from './ticketType';

export class UpdateTicketInput extends EntityDto { 
    title!: string; 
    description?: string; 
    priority!: TicketPriority;
    type!: TicketType;

    componentId!: number;
    statusId!: number;
    activityId?: number; 
}