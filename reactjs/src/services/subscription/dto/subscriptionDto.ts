import {AuditedEntityDto} from '../../dto/auditedEntityDto';
import {SimpleUserDto} from '../../user/dto/simpleUserDto';
import {SimpleTicketDto} from '../../ticket/dto/simpleTicketDto';

export class SubscriptionDto extends AuditedEntityDto {
    userId!: number;
    ticketId!: number;

    user?: SimpleUserDto;
    ticket?: SimpleTicketDto;
}