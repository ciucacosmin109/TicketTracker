import { action, observable } from "mobx"; 
import projectRoleService from '../services/projectRole/projectRoleService'; 
import { ListResultDto } from '../services/dto/listResultDto'; 
import { PRoleWithPermissionsDto } from "../services/projectRole/dto/pRoleWithPermissionsDto";

export default class ProjectRoleStore { 
    @observable rolesWithPermissions!: ListResultDto<PRoleWithPermissionsDto>; 
 
    @action
    async getAllWithPermissions() : Promise<ListResultDto<PRoleWithPermissionsDto>> {
        if(this.rolesWithPermissions == null){
            this.rolesWithPermissions = await projectRoleService.getAllWithPermissions(); 
        }
        return this.rolesWithPermissions;
    }  
}