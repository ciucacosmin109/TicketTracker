import { AuditedEntityDto } from "../../dto/auditedEntityDto";
import {TicketPriority} from './ticketPriority';
import {TicketType} from './ticketType';
import {SimpleStatusDto} from '../../status/dto/simpleStatusDto';
import {SimpleActivityDto} from '../../activity/dto/simpleActivityDto';
import {SimpleWorkDto} from '../../work/dto/simpleWorkDto';

export class TicketDto extends AuditedEntityDto { 
    title!: string; 
    description?: string; 
    priority!: TicketPriority;
    type!: TicketType;

    componentId!: number;

    status?: SimpleStatusDto;
    activity?: SimpleActivityDto;
    works?: SimpleWorkDto[];
}