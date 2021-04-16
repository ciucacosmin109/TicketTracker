import {SimpleUserWithRolesDto} from './simpleUserWithRolesDto';

export class GetProjectUsersOutput { 
    projectId!: number;
    users!: SimpleUserWithRolesDto[];
}