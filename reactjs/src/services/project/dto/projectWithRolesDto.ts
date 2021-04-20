import { ProjectDto } from "./projectDto";
import { PRoleDto } from "../../projectRole/dto/pRoleDto";

export class ProjectWithRolesDto extends ProjectDto {
    roles?: PRoleDto[]; 
}