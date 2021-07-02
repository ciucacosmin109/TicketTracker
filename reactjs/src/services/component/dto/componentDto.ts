import {AuditedEntityDto} from '../../dto/auditedEntityDto';
import { SimpleProjectDto } from '../../project/dto/simpleProjectDto';

export class ComponentDto extends AuditedEntityDto<number> {
    name!: string;
    description?: string;
    
    project!: SimpleProjectDto;
}