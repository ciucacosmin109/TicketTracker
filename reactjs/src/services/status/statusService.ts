import { EntityDto } from '../dto/entityDto';
import { PagedAndSortedRequestDto } from '../dto/pagedAndSortedRequestDto';
import { PagedResultDto } from '../dto/pagedResultDto'; 
import { StatusDto } from './dto/statusDto';
import http from '../httpService';

class StatusService { 
    public async get(entityDto: EntityDto) : Promise<StatusDto> { 
        let result = await http.get('api/services/app/Status/Get', { params: entityDto });
        return result.data.result;
    } 
    public async getAll(input: PagedAndSortedRequestDto) : Promise<PagedResultDto<StatusDto>> { 
        let result = await http.get('api/services/app/Status/GetAll', { params: input });
        return result.data.result;
    }
}
 
export default new StatusService();