import { ProjectDto } from './dto/projectDto';
import { ProjectWithRolesDto } from './dto/projectWithRolesDto'; 
import { CreateProjectInput } from './dto/createProjectInput';
import { UpdateProjectInput } from './dto/updateProjectInput';
import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import { GetAllProjectsInput } from './dto/getAllProjectsInput';
import http from '../httpService';

class ProjectService { 
    public async get(entityDto: EntityDto) : Promise<ProjectDto> { 
        let result = await http.get('api/services/app/Project/Get', { params: entityDto });
        return result.data.result;
    }
    public async getIncludingRoles(entityDto: EntityDto) : Promise<ProjectWithRolesDto> { 
        let result = await http.get('api/services/app/Project/GetIncludingRoles', { params: entityDto });
        return result.data.result;
    } 

    public async getAll(input: GetAllProjectsInput) : Promise<PagedResultDto<ProjectDto>> { 
        let result = await http.get('api/services/app/Project/GetAll', { params: input });
        return result.data.result;
    }
    public async getAllIncludingRoles(input: GetAllProjectsInput) : Promise<PagedResultDto<ProjectWithRolesDto>> { 
        let result = await http.get('api/services/app/Project/GetAllIncludingRoles', { params: input });
        return result.data.result;
    } 
 
    public async create(input: CreateProjectInput) : Promise<ProjectDto> { 
        let result = await http.post('api/services/app/Project/Create', input);
        return result.data.result;
    }
    public async update(input: UpdateProjectInput) : Promise<ProjectDto> { 
        let result = await http.put('api/services/app/Project/Update', input);
        return result.data.result;
    }
    
    public async delete(input: EntityDto) { 
        let result = await http.delete('api/services/app/Project/Delete', { params: input });
        return result.data;
    }
}
 
export default new ProjectService();