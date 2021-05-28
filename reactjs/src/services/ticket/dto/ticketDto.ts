import { AuditedEntityDto } from "../../dto/auditedEntityDto";
import {TicketPriority} from './ticketPriority';
import {TicketType} from './ticketType';
import {SimpleStatusDto} from '../../status/dto/simpleStatusDto';
import {SimpleActivityDto} from '../../activity/dto/simpleActivityDto';
import {SimpleWorkDto} from '../../work/dto/simpleWorkDto';
import { SimpleComponentDto } from "../../component/dto/simpleComponentDto";
import { SimpleProjectDto } from "../../project/dto/simpleProjectDto";

export class TicketDto extends AuditedEntityDto { 
    title!: string; 
    description?: string; 
    priority!: TicketPriority;
    type!: TicketType;

    component!: SimpleComponentDto;
    project!: SimpleProjectDto;

    status?: SimpleStatusDto;
    activity?: SimpleActivityDto;
    works?: SimpleWorkDto[];
}