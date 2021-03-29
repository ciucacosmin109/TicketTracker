import { action, observable } from "mobx";
import { ProjectDto } from '../services/project/dto/projectDto';
import { GetAllProjectsInput } from '../services/project/dto/getAllProjectsInput';
import projectService from '../services/project/projectService';
import { PagedResult } from '../services/dto/pagedResult';

export default class ProjectStore {
    @observable projects!: PagedResult<ProjectDto>;
    @observable projectsWithRoles!: PagedResult<ProjectDto>;
    @observable projectsWithRolesPermissions!: PagedResult<ProjectDto>;
 
    @action
    async getAll(input: GetAllProjectsInput) {
        this.projects = await projectService.getAll(input); 
    }
    @action
    async getAllIncludingRoles(input: GetAllProjectsInput) {
        this.projectsWithRoles = await projectService.getAllIncludingRoles(input); 
    }
    @action
    async getAllIncludingRolesAndPermissions(input: GetAllProjectsInput) {
        this.projectsWithRolesPermissions = await projectService.getAllIncludingRolesAndPermissions(input); 
    }
}