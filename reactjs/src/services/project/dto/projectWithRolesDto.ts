import { ProjectDto } from "./projectDto";
import { PRoleDto } from "./roleDto/pRoleDto";

export class ProjectWithRolesDto extends ProjectDto {
    roles?: PRoleDto[]; 
}