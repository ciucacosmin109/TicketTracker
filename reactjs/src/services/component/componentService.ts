import { ComponentDto } from './dto/componentDto';
import { CreateComponentInput } from './dto/createComponentInput';
import { UpdateComponentInput } from './dto/updateComponentInput';
import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import { GetAllComponentsInput } from './dto/getAllComponentsInput';
import http from '../httpService';

class ComponentService { 
    public async get(entityDto: EntityDto) : Promise<ComponentDto> { 
        let result = await http.get('api/services/app/Component/Get', { params: entityDto });
        return result.data.result;
    } 
    public async getAll(input: GetAllComponentsInput) : Promise<PagedResultDto<ComponentDto>> { 
        let result = await http.get('api/services/app/Component/GetAll', { params: input });
        return result.data.result;
    } 
 
    public async create(input: CreateComponentInput) : Promise<ComponentDto> { 
        let result = await http.post('api/services/app/Component/Create', input);
        return result.data.result;
    }
    public async update(input: UpdateComponentInput) : Promise<ComponentDto> { 
        let result = await http.put('api/services/app/Component/Update', input);
        return result.data.result;
    }
    
    public async delete(input: EntityDto) { 
        let result = await http.delete('api/services/app/Component/Delete', { params: input });
        return result.data;
    }
}
 
export default new ComponentService();