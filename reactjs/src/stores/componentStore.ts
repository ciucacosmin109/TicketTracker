import { action, observable } from "mobx"; 
import { ComponentDto } from '../services/component/dto/componentDto';
import { GetAllComponentsInput } from '../services/component/dto/getAllComponentsInput';
import componentService from '../services/component/componentService';
import { PagedResultDto } from '../services/dto/pagedResultDto';  
import { CreateComponentInput } from "../services/component/dto/createComponentInput";
import { UpdateComponentInput } from "../services/component/dto/updateComponentInput";
import { EntityDto } from "../services/dto/entityDto";

export default class ComponentStore {
    @observable components!: PagedResultDto<ComponentDto>;
    
    projectId!: number;
 
    @action
    async getAll(projectId : number) {
        this.projectId = projectId;
        this.components = await componentService.getAll({projectId: projectId} as GetAllComponentsInput);  
    }  
    
    @action
    async create(input : CreateComponentInput) {
        const comp = await componentService.create(input); 
        this.components.totalCount++;
        this.components.items.push(comp); 
        this.components.items = [...this.components.items]
    }  
    @action
    async update(input : UpdateComponentInput) {
        const newComp = await componentService.update(input); 
        const oldCompIndex = this.components.items.findIndex(x => x.id === input.id);
        if(oldCompIndex !== -1){
            this.components.items.splice(oldCompIndex, 1, newComp); 
        }else{
            this.components.totalCount++;
            this.components.items.push(newComp); 
        }
        this.components.items = [...this.components.items]
    }  
    @action
    async delete(input : EntityDto) {
        const oldCompIndex = this.components.items.findIndex(x => x.id === input.id);
        if(oldCompIndex !== -1){
            this.components.totalCount--;
            this.components.items.splice(oldCompIndex, 1); 
        }
        this.components.items = [...this.components.items]
    }  
}