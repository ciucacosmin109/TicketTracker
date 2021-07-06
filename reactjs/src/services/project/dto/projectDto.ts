import {AuditedEntityDto} from '../../dto/auditedEntityDto';

export class ProjectDto extends AuditedEntityDto {
    name!: string;
    description?: string;
    isPublic!: boolean;
}