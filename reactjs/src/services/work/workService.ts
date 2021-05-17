import { WorkDto } from './dto/workDto';
import { CreateWorkInput } from './dto/createWorkInput';
import { UpdateWorkInput } from './dto/updateWorkInput';
import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import { GetAllWorksInput } from './dto/getAllWorksInput';
import { GetWorkingInput } from './dto/getWorkingInput';
import { UpdateIsWorkingInput } from './dto/updateIsWorkingInput';
import http from '../httpService';

class WorkService { 
    public async get(entityDto: EntityDto) : Promise<WorkDto> { 
        let result = await http.get('api/services/app/Work/Get', { params: entityDto });
        return result.data.result;
    } 
    public async getWorking(input: GetWorkingInput) : Promise<WorkDto> { 
        let result = await http.get('api/services/app/Work/GetWorking', { params: input });
        return result.data.result;
    } 
    public async getAll(input: GetAllWorksInput) : Promise<PagedResultDto<WorkDto>> { 
        let result = await http.get('api/services/app/Work/GetAll', { params: input });
        return result.data.result;
    } 
 
    public async create(input: CreateWorkInput) : Promise<WorkDto> { 
        let result = await http.post('api/services/app/Work/Create', input);
        return result.data.result;
    }
    public async update(input: UpdateWorkInput) : Promise<WorkDto> { 
        let result = await http.put('api/services/app/Work/Update', input);
        return result.data.result;
    }
    public async updateIsWorking(input: UpdateIsWorkingInput) { 
        let result = await http.put('api/services/app/Work/UpdateIsWorking', input);
        return result.data;
    }
    
    public async delete(input: EntityDto) { 
        let result = await http.delete('api/services/app/Work/Delete', { params: input });
        return result.data;
    }
}
 
export default new WorkService();