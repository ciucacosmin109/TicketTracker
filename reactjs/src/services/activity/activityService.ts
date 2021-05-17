import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto'; 
import { ActivityDto } from './dto/activityDto';
import http from '../httpService';
import { PagedAndSortedRequestDto } from '../dto/pagedAndSortedRequestDto';

class ActivityService { 
    public async get(entityDto: EntityDto) : Promise<ActivityDto> { 
        let result = await http.get('api/services/app/Activity/Get', { params: entityDto });
        return result.data.result;
    } 
    public async getAll(input: PagedAndSortedRequestDto) : Promise<PagedResultDto<ActivityDto>> { 
        let result = await http.get('api/services/app/Activity/GetAll', { params: input });
        return result.data.result;
    }
}
 
export default new ActivityService();