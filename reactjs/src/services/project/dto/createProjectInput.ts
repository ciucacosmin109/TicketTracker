import {MinimalUserWithPRolesDto} from './roleDto/minimalUserWithPRolesDto';

export class CreateProjectInput {
    name!: string;
    description?: string;
    isPublic?: boolean; 

    users?: MinimalUserWithPRolesDto[];
}
  