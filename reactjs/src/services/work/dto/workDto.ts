import {AuditedEntityDto} from '../../dto/auditedEntityDto';
import {SimpleUserDto} from '../../user/dto/simpleUserDto';
import {SimpleTicketDto} from '../../ticket/dto/simpleTicketDto';

export class WorkDto extends AuditedEntityDto {
    user?: SimpleUserDto;
    ticket?: SimpleTicketDto;

    isWorking!: boolean;
    workedTime?: number;
    estimatedTime?: number; 
}