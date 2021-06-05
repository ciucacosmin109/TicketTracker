import { EntityDto } from "../../dto/entityDto";
import { PRoleWithPermissionsDto } from "../../projectRole/dto/pRoleWithPermissionsDto";
import { SimpleUserDto } from "../../user/dto/simpleUserDto";

export class ProjectUserDto extends EntityDto { 
    projectId!: number;
    user!: SimpleUserDto;
    roles?: PRoleWithPermissionsDto[];
}