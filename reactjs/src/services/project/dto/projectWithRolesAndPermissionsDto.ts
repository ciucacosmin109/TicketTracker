import { ProjectDto } from "./projectDto";
import { PRoleWithPermissionsDto } from '../../projectRole/dto/pRoleWithPermissionsDto'

export class ProjectWithRolesAndPermissionsDto extends ProjectDto {
    roles?: PRoleWithPermissionsDto[]; 
}