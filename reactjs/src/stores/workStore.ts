import { action, observable } from "mobx";  
import { PagedResultDto } from '../services/dto/pagedResultDto';   
import { EntityDto } from "../services/dto/entityDto"; 
import workService from "../services/work/workService"; 
import { WorkDto } from "../services/work/dto/workDto";
import { CreateWorkInput } from "../services/work/dto/createWorkInput";
import { GetAllWorksInput } from "../services/work/dto/getAllWorksInput";
import { UpdateWorkInput } from "../services/work/dto/updateWorkInput";
import { UpdateIsWorkingInput } from "../services/work/dto/updateIsWorkingInput";

export default class WorkStore {
    @observable loading: boolean = false;

    @observable assignedWork?: WorkDto; 
    @observable works!: PagedResultDto<WorkDto>;

    ticketId!: number;
 
    @action
    async getAssigned(ticketId : number) { 
        if(Number.isNaN(ticketId)){
            return;
        }
        this.loading = true; 
        this.assignedWork = await workService.getWorking({ticketId});
        this.loading = false;
    }  
    @action
    async getAll(ticketId : number) {
        if(Number.isNaN(ticketId)){
            return;
        }
        this.loading = true; 
        this.ticketId = ticketId;
        this.works = await workService.getAll({ticketId} as GetAllWorksInput);
        this.loading = false;
    }  
    
    @action
    async create(input : CreateWorkInput) {
        this.loading = true;
        const tc = await workService.create(input); 
        
        this.works?.items?.forEach(e => {
            e.isWorking = false;
        });
        
        if(this.works != null && input.ticketId === this.ticketId){
            this.works.totalCount++;
            this.works.items.push(tc); 
            this.works.items = [...this.works.items]
        }else if(this.assignedWork != null &&  input.ticketId === this.ticketId){
            this.works = {
                totalCount: 1,
                items: [this.assignedWork]
            } as PagedResultDto<WorkDto>; 
        }
        
        this.assignedWork = tc;
        this.loading = false;
    }  
    @action
    async update(input : UpdateWorkInput) {
        this.loading = true;
        const newW = await workService.update(input); 
        if(input.id === this.assignedWork?.id){
            this.assignedWork = newW;
        }

        const oldIdx = this.works?.items.findIndex(x => x.id === input.id);
        if(oldIdx != null && oldIdx !== -1){
            this.works.items.splice(oldIdx, 1, newW); 
            this.works.items = [...this.works.items]
        } 
        this.loading = false;
    } 
    @action
    async updateIsWorking(input: UpdateIsWorkingInput) { 
        this.loading = true;
        await workService.updateIsWorking(input); 

        this.works?.items?.forEach(e => {
            e.isWorking = false;
        });
        
        if(input.workId != null){
            let w = this.works?.items.find(x => x.id === input.workId);
            if(w != null){
                w.isWorking = true;
                this.assignedWork = w;
            }else{
                await this.getAll(input.ticketId);
                await this.getAssigned(input.ticketId);
            }
        }else{
            this.assignedWork = undefined;
        }
        this.loading = false;
    }   
    @action
    async delete(input : EntityDto) {
        this.loading = true;
        await workService.delete(input); 

        if(input.id === this.assignedWork?.id){
            this.assignedWork = undefined;
        }

        const oldIdx = this.works.items.findIndex(x => x.id === input.id);
        if(oldIdx != null && oldIdx !== -1){
            this.works.totalCount--;
            this.works.items.splice(oldIdx, 1); 
            this.works.items = [...this.works.items]
        }
        this.loading = false;
    }  
}