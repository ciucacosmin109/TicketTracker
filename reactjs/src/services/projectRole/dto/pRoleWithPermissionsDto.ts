import { PRoleDto } from "./pRoleDto";

export class PRoleWithPermissionsDto extends PRoleDto { 
    permissionNames?: string[];
}