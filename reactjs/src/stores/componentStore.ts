import { action, observable } from "mobx"; 
import { ComponentDto } from '../services/component/dto/componentDto';
import { GetAllComponentsInput } from '../services/component/dto/getAllComponentsInput';
import componentService from '../services/component/componentService';
import { PagedResultDto } from '../services/dto/pagedResultDto';  
import { CreateComponentInput } from "../services/component/dto/createComponentInput";
import { UpdateComponentInput } from "../services/component/dto/updateComponentInput";
import { EntityDto } from "../services/dto/entityDto";

export default class ComponentStore {
    @observable component!: ComponentDto;

    @observable components!: PagedResultDto<ComponentDto>; 
    projectId!: number;
 
    @action
    async get(id : number) { 
        this.component = await componentService.get({id});  
    }  
    @action
    async getAll(projectId : number) {
        this.projectId = projectId;
        this.components = await componentService.getAll({projectId: projectId} as GetAllComponentsInput);  
    }  
    
    @action
    async create(input : CreateComponentInput) {
        const comp = await componentService.create(input); 
        if(this.components != null && input.projectId === this.projectId){
            this.components.totalCount++; 
            this.components.items = [comp, ...this.components.items]
        }
    }  
    @action
    async update(input : UpdateComponentInput) { 
        const newComp = await componentService.update(input); 
        if(input.id === this.component.id){
            this.component = newComp;
        }

        const oldCompIndex = this.components?.items.findIndex(x => x.id === input.id);
        if(oldCompIndex != null && oldCompIndex !== -1){
            this.components.items.splice(oldCompIndex, 1, newComp); 
            this.components.items = [...this.components.items]
        } 
    }  
    @action
    async delete(input : EntityDto) { 
        await componentService.delete(input); 

        const oldCompIndex = this.components?.items.findIndex(x => x.id === input.id);
        if(oldCompIndex != null && oldCompIndex !== -1){
            this.components.totalCount--;
            this.components.items.splice(oldCompIndex, 1); 
            this.components.items = [...this.components.items]
        }
    }  
}