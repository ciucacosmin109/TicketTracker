import { TicketDto } from './dto/ticketDto';
import { CreateTicketInput } from './dto/createTicketInput';
import { UpdateTicketInput } from './dto/updateTicketInput';
import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import { GetAllTicketsInput } from './dto/getAllTicketsInput';
import http from '../httpService';

class TicketService { 
    public async get(entityDto: EntityDto) : Promise<TicketDto> { 
        let result = await http.get('api/services/app/Ticket/Get', { params: entityDto });
        return result.data.result;
    } 
    public async getAll(input: GetAllTicketsInput) : Promise<PagedResultDto<TicketDto>> { 
        let result = await http.get('api/services/app/Ticket/GetAll', { params: input });
        return result.data.result;
    } 
 
    public async create(input: CreateTicketInput) : Promise<TicketDto> { 
        let result = await http.post('api/services/app/Ticket/Create', input);
        return result.data.result;
    }
    public async update(input: UpdateTicketInput) : Promise<TicketDto> { 
        let result = await http.put('api/services/app/Ticket/Update', input);
        return result.data.result;
    }
    
    public async delete(input: EntityDto) { 
        let result = await http.delete('api/services/app/Ticket/Delete', { params: input });
        return result.data;
    }
}
 
export default new TicketService();