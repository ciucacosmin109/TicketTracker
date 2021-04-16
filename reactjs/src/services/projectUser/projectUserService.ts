import {GetProjectUsersInput} from './dto/getProjectUsersInput';
import {GetProjectUsersOutput} from './dto/getProjectUsersOutput';
import {CreateProjectUserInput} from './dto/createProjectUserInput';
import {ProjectUserDto} from './dto/projectUserDto';
import {DeleteProjectUserInput} from './dto/deleteProjectUserInput';
import {GetRolesOfUserInput} from './dto/getRolesOfUserInput';
import {RolesOfUserDto} from './dto/rolesOfUserDto';
import {UpdateRolesOfUserInput} from './dto/updateRolesOfUserInput'; 
import http from '../httpService';

class ProjectUserService { 
    public async getUsersOfProject(input: GetProjectUsersInput) : Promise<GetProjectUsersOutput> { 
        let result = await http.get('api​/services​/app​/ProjectUser​/GetUsersOfProject', { params: input });
        return result.data.result;
    } 
    public async addUserToProject(input: CreateProjectUserInput) : Promise<ProjectUserDto> { 
        let result = await http.post('/api/services/app/ProjectUser/AddUserToProject', input);
        return result.data.result;
    }
    public async removeUserFromProject(input: DeleteProjectUserInput) { 
        let result = await http.get('/api/services/app/ProjectUser/RemoveUserFromProject', { params: input });
        return result.data.result;
    }

    public async getRolesOfUserOfProject(input: GetRolesOfUserInput) : Promise<RolesOfUserDto> { 
        let result = await http.get('api/services/app/ProjectUser/GetRolesOfUserOfProject', { params: input });
        return result.data.result;
    }
    public async UpdateRolesOfUserOfProject(input: UpdateRolesOfUserInput) : Promise<RolesOfUserDto> { 
        let result = await http.put('api/services/app/ProjectUser/UpdateRolesOfUserOfProject', input);
        return result.data.result;
    } 
}
 
export default new ProjectUserService();