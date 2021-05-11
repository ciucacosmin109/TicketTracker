import { EntityDto } from "../../dto/entityDto";
import {TicketPriority} from './ticketPriority';
import {TicketType} from './ticketType';

export class SimpleTicketDto extends EntityDto { 
    title!: string; 
    priority!: TicketPriority;
    type!: TicketType;
}