import { EntityDto } from '../../dto/entityDto';
import { MinimalUserWithPRolesDto } from './roleDto/minimalUserWithPRolesDto';

export class UpdateProjectInput extends EntityDto { 
    name!: string;
    description?: string;
    isPublic?: boolean;
    
    users?: MinimalUserWithPRolesDto[];
}