import { action, observable } from "mobx"; 
import { GetAllProjectsInput } from '../services/project/dto/getAllProjectsInput';
import projectService from '../services/project/projectService'; 
import { ProjectWithRolesDto } from "../services/project/dto/projectWithRolesDto";
import { ProjectDto } from "../services/project/dto/projectDto"; 
import { EntityDto } from "../services/dto/entityDto"; 
import { PagedResultDto } from "../services/dto/pagedResultDto";

export default class ProjectStore {
    @observable project!: ProjectDto;  

    @observable publicProjects!: PagedResultDto<ProjectWithRolesDto>; 
    @observable assignedProjects!: PagedResultDto<ProjectWithRolesDto>; 
 
    @action
    async getProject(id : number) {
        this.project = await projectService.get({id: id} as EntityDto); 
    }

    @action
    async getAll() {
        this.publicProjects = await projectService.getAllIncludingRoles({isPublic: true} as GetAllProjectsInput); 
        this.assignedProjects = await projectService.getAllIncludingRoles({isAssigned: true} as GetAllProjectsInput); 
    }  
}