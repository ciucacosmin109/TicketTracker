import { CommentDto } from './dto/commentDto';
import { CreateCommentInput } from './dto/createCommentInput';
import { UpdateCommentInput } from './dto/updateCommentInput';
import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import { GetAllCommentsInput } from './dto/getAllCommentsInput';
import http from '../httpService';

class CommentService { 
    public async get(entityDto: EntityDto) : Promise<CommentDto> { 
        let result = await http.get('api/services/app/Comment/Get', { params: entityDto });
        return result.data.result;
    } 
    public async getAll(input: GetAllCommentsInput) : Promise<PagedResultDto<CommentDto>> { 
        let result = await http.get('api/services/app/Comment/GetAll', { params: input });
        return result.data.result;
    } 
 
    public async create(input: CreateCommentInput) : Promise<CommentDto> { 
        let result = await http.post('api/services/app/Comment/Create', input);
        return result.data.result;
    }
    public async update(input: UpdateCommentInput) : Promise<CommentDto> { 
        let result = await http.put('api/services/app/Comment/Update', input);
        return result.data.result;
    }
    
    public async delete(input: EntityDto) { 
        let result = await http.delete('api/services/app/Comment/Delete', { params: input });
        return result.data;
    }
}
 
export default new CommentService();