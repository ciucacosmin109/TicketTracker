import {AuditedEntityDto} from '../../dto/auditedEntityDto';

export class ComponentDto extends AuditedEntityDto<number> {
    name!: string;
    description?: string;
    projectId!: number;
}