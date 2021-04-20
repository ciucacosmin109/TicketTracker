import {ListResultDto} from '../dto/listResultDto';
import {PRoleDto} from './dto/pRoleDto';
import {PRoleWithPermissionsDto} from './dto/pRoleWithPermissionsDto';
import http from '../httpService';

class ProjectRoleService { 
    public async getAll() : Promise<ListResultDto<PRoleDto>> { 
        let result = await http.get('api​/services​/app​/ProjectRoles​/GetAll');
        return result.data.result;
    }
    public async getAllWithPermissions() : Promise<ListResultDto<PRoleWithPermissionsDto>> { 
        let result = await http.get('api/services/app/ProjectRoles/GetAllWithPermissions');
        return result.data.result;
    }
}
 
export default new ProjectRoleService();