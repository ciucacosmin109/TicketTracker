import { action, observable } from "mobx"; 
import projectRoleService from '../services/projectRole/projectRoleService'; 
import { ListResultDto } from '../services/dto/listResultDto'; 
import { PRoleWithPermissionsDto } from "../services/projectRole/dto/pRoleWithPermissionsDto";

export default class ProjectRoleStore { 
    @observable loading: boolean = false;

    @observable rolesWithPermissions!: ListResultDto<PRoleWithPermissionsDto>; 
 
    @action
    async getAllWithPermissions() : Promise<ListResultDto<PRoleWithPermissionsDto>> {
        if(this.rolesWithPermissions == null){
            this.loading = true;
            this.rolesWithPermissions = await projectRoleService.getAllWithPermissions(); 
        }
        this.loading = false;
        return this.rolesWithPermissions;
    }  
}