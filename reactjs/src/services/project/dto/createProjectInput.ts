import {UserWithPRolesDto} from './roleDto/userWithPRolesDto';

export class CreateProjectInput {
    name!: string;
    description?: string;
    isPublic?: boolean; 

    users?: UserWithPRolesDto[];
}
  