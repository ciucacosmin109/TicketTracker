import { action, observable } from "mobx"; 
import { GetAllProjectsInput } from '../services/project/dto/getAllProjectsInput';
import projectService from '../services/project/projectService';
import { PagedResult } from '../services/dto/pagedResult';
import { ProjectWithRolesDto } from "../services/project/dto/projectWithRolesDto";

export default class ProjectStore {
    @observable publicProjects!: PagedResult<ProjectWithRolesDto>; 
    @observable assignedProjects!: PagedResult<ProjectWithRolesDto>; 
 
    @action
    async getAll() {
        this.publicProjects = await projectService.getAllIncludingRoles({isPublic: true} as GetAllProjectsInput); 
        this.assignedProjects = await projectService.getAllIncludingRoles({isAssigned: true} as GetAllProjectsInput); 
    }  
}