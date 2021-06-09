import { action, observable } from "mobx";  
import { PagedResultDto } from '../services/dto/pagedResultDto';   
import { EntityDto } from "../services/dto/entityDto";
import { TicketDto } from "../services/ticket/dto/ticketDto";
import ticketService from "../services/ticket/ticketService";
import { GetAllTicketsInput } from "../services/ticket/dto/getAllTicketsInput";
import { CreateTicketInput } from "../services/ticket/dto/createTicketInput";
import { UpdateTicketInput } from "../services/ticket/dto/updateTicketInput";

export default class TicketStore {
    @observable loading: boolean = false;

    @observable ticket!: TicketDto;
    @observable componentTickets!: PagedResultDto<TicketDto>; 
    @observable projectTickets!: PagedResultDto<TicketDto>; 
    @observable userTickets!: PagedResultDto<TicketDto>; 

    componentId?: number;
    projectId?: number;
    assignedUserId?: number;
 
    @action
    async get(id : number) {
        if(Number.isNaN(id)){
            return;
        }
        this.loading = true; 
        this.ticket = await ticketService.get({id});
        this.loading = false;
    }  
    @action
    async getAllByComponentId(componentId : number) { 
        if(Number.isNaN(componentId)){
            return;
        }
        this.loading = true; 
        this.componentTickets = await ticketService.getAll({componentId} as GetAllTicketsInput);
        this.componentId = componentId; 
        this.loading = false;
    }  
    @action
    async getAllByProjectId(projectId : number) { 
        if(Number.isNaN(projectId)){
            return;
        }
        this.loading = true; 
        this.projectTickets = await ticketService.getAll({projectId} as GetAllTicketsInput);
        this.projectId = projectId; 
        this.loading = false;
    }  
    @action
    async getAllByAssignedUserId(assignedUserId : number) { 
        if(Number.isNaN(assignedUserId)){
            return;
        }
        this.loading = true; 
        this.userTickets = await ticketService.getAll({assignedUserId} as GetAllTicketsInput);
        this.assignedUserId = assignedUserId;
        this.loading = false;
    }  
    
    @action
    async create(input : CreateTicketInput) : Promise<TicketDto> {
        this.loading = true;
        const tc = await ticketService.create(input); 
        if(this.componentTickets != null && input.componentId === this.componentId){
            this.componentTickets.totalCount++;
            this.componentTickets.items.push(tc); 
            this.componentTickets.items = [...this.componentTickets.items]
        }
        this.loading = false;
        return tc;
    }  
    @action
    async update(input : UpdateTicketInput) {
        this.loading = true;
        const newTicket = await ticketService.update(input); 
        if(input.id === this.ticket.id){
            this.ticket = newTicket;
        }

        const oldIdx = this.componentTickets?.items.findIndex(x => x.id === input.id);
        if(oldIdx != null && oldIdx !== -1){
            this.componentTickets.items.splice(oldIdx, 1, newTicket); 
            this.componentTickets.items = [...this.componentTickets.items]
        } 
        this.loading = false;
    }  
    @action
    async delete(input : EntityDto) {
        this.loading = true;
        await ticketService.delete(input); 

        const oldIdx = this.componentTickets.items.findIndex(x => x.id === input.id);
        if(oldIdx != null && oldIdx !== -1){
            this.componentTickets.totalCount--;
            this.componentTickets.items.splice(oldIdx, 1); 
            this.componentTickets.items = [...this.componentTickets.items]
        }
        this.loading = false;
    }  
}