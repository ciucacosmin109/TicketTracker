import { ProjectDto } from "./projectDto";
import { PRoleWithPermissionsDto } from './roleDto/pRoleWithPermissionsDto'

export class ProjectWithRolesAndPermissionsDto extends ProjectDto {
    roles?: PRoleWithPermissionsDto[]; 
}