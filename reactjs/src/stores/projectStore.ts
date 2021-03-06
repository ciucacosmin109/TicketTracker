import { action, observable } from "mobx"; 
import { GetAllProjectsInput } from '../services/project/dto/getAllProjectsInput';
import projectService from '../services/project/projectService'; 
import { ProjectWithRolesDto } from "../services/project/dto/projectWithRolesDto"; 
import { EntityDto } from "../services/dto/entityDto"; 
import { PagedResultDto } from "../services/dto/pagedResultDto";

export default class ProjectStore {
    @observable loading: boolean = false;

    @observable project!: ProjectWithRolesDto;   
    @observable publicProjects!: PagedResultDto<ProjectWithRolesDto>; 
    @observable assignedProjects!: PagedResultDto<ProjectWithRolesDto>; 
 
    @action
    async getProject(id : number) {
        if(Number.isNaN(id)){
            return;
        }
        this.loading = true;
        this.project = await projectService.getIncludingRoles({id: id} as EntityDto); 
        this.loading = false;
    } 
    @action
    async getAll() {
        this.loading = true;
        this.publicProjects = await projectService.getAllIncludingRoles({isPublic: true} as GetAllProjectsInput); 
        this.assignedProjects = await projectService.getAllIncludingRoles({isAssigned: true} as GetAllProjectsInput); 
        this.loading = false;
    }  
}