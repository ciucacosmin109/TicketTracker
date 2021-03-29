import { EntityDto } from '../../dto/entityDto';

export class UpdateProjectInput extends EntityDto { 
    name!: string;
    description?: string;
    isPublic?: boolean;
}