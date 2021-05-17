import { action, observable } from "mobx";  
import { PagedResultDto } from '../services/dto/pagedResultDto';   
import { EntityDto } from "../services/dto/entityDto";
import { TicketDto } from "../services/ticket/dto/ticketDto";
import ticketService from "../services/ticket/ticketService";
import { GetAllTicketsInput } from "../services/ticket/dto/getAllTicketsInput";
import { CreateTicketInput } from "../services/ticket/dto/createTicketInput";
import { UpdateTicketInput } from "../services/ticket/dto/updateTicketInput";

export default class TicketStore {
    @observable ticket!: TicketDto;

    @observable tickets!: PagedResultDto<TicketDto>; 
    componentId!: number;
 
    @action
    async get(id : number) { 
        this.ticket = await ticketService.get({id});  
    }  
    @action
    async getAll(componentId : number) {
        this.componentId = componentId;
        this.tickets = await ticketService.getAll({componentId} as GetAllTicketsInput);  
    }  
    
    @action
    async create(input : CreateTicketInput) {
        const tc = await ticketService.create(input); 
        if(this.tickets != null && input.componentId === this.componentId){
            this.tickets.totalCount++;
            this.tickets.items.push(tc); 
            this.tickets.items = [...this.tickets.items]
        }
    }  
    @action
    async update(input : UpdateTicketInput) {
        const newTicket = await ticketService.update(input); 
        if(input.id === this.ticket.id){
            this.ticket = newTicket;
        }

        const oldIdx = this.tickets?.items.findIndex(x => x.id === input.id);
        if(oldIdx != null && oldIdx !== -1){
            this.tickets.items.splice(oldIdx, 1, newTicket); 
            this.tickets.items = [...this.tickets.items]
        } 
    }  
    @action
    async delete(input : EntityDto) {
        await ticketService.delete(input); 

        const oldIdx = this.tickets.items.findIndex(x => x.id === input.id);
        if(oldIdx != null && oldIdx !== -1){
            this.tickets.totalCount--;
            this.tickets.items.splice(oldIdx, 1); 
            this.tickets.items = [...this.tickets.items]
        }
    }  
}