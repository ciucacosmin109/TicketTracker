import {GetProjectUserInput} from './dto/getProjectUserInput';
import {GetAllProjectUsersInput} from './dto/getAllProjectUsersInput'; 
import {CreateProjectUserInput} from './dto/createProjectUserInput';
import {ProjectUserDto} from './dto/projectUserDto';
import {DeleteProjectUserInput} from './dto/deleteProjectUserInput'; 
import {UpdateProjectUserInput} from './dto/updateProjectUserInput'; 
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';

class ProjectUserService { 
    public async get(input: GetProjectUserInput) : Promise<ProjectUserDto> { 
        let result = await http.get('api/services/app/ProjectUser/Get', { params: input });
        return result.data.result;
    } 
    public async getAll(input: GetAllProjectUsersInput) : Promise<PagedResultDto<ProjectUserDto>> { 
        let result = await http.get('api/services/app/ProjectUser/GetAll', { params: input });
        return result.data.result;
    } 
    public async create(input: CreateProjectUserInput) : Promise<ProjectUserDto> { 
        let result = await http.post('api/services/app/ProjectUser/Create', input);
        return result.data.result;
    }
    public async update(input: UpdateProjectUserInput) : Promise<ProjectUserDto> { 
        let result = await http.put('api/services/app/ProjectUser/Update', input);
        return result.data.result;
    } 
    public async delete(input: DeleteProjectUserInput) { 
        let result = await http.get('api/services/app/ProjectUser/Delete', { params: input });
        return result.data.result;
    } 
}
 
export default new ProjectUserService();