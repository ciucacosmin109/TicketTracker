import { action, observable } from "mobx"; 
import { ComponentDto } from '../services/component/dto/componentDto';
import { GetAllComponentsInput } from '../services/component/dto/getAllComponentsInput';
import componentService from '../services/component/componentService';
import { PagedResultDto } from '../services/dto/pagedResultDto';  
import { CreateComponentInput } from "../services/component/dto/createComponentInput";
import { UpdateComponentInput } from "../services/component/dto/updateComponentInput";
import { EntityDto } from "../services/dto/entityDto";

export default class ComponentStore {
    @observable loading: boolean = false;

    @observable component!: ComponentDto; 
    @observable components!: PagedResultDto<ComponentDto>;

    projectId!: number;
 
    @action
    async get(id : number) { 
        if(Number.isNaN(id)){
            return;
        }
        this.loading = true;
        this.component = await componentService.get({id});
        this.loading = false;
    }  
    @action
    async getAll(projectId : number) {
        if(Number.isNaN(projectId)){
            return;
        }
        this.loading = true;
        this.projectId = projectId;
        this.components = await componentService.getAll({projectId: projectId} as GetAllComponentsInput);  
        this.loading = false;
    }  
    
    @action
    async create(input : CreateComponentInput) {
        this.loading = true;
        const comp = await componentService.create(input); 
        if(this.components != null && input.projectId === this.projectId){
            this.components.totalCount++; 
            this.components.items = [...this.components.items, comp]
        }
        this.loading = false;
    }  
    @action
    async update(input : UpdateComponentInput) {
        this.loading = true;
        const newComp = await componentService.update(input); 
        if(input.id === this.component.id){
            this.component = newComp;
        }

        const oldCompIndex = this.components?.items.findIndex(x => x.id === input.id);
        if(oldCompIndex != null && oldCompIndex !== -1){
            this.components.items.splice(oldCompIndex, 1, newComp); 
            this.components.items = [...this.components.items]
        } 
        this.loading = false;
    }  
    @action
    async delete(input : EntityDto) { 
        this.loading = true;
        await componentService.delete(input); 

        const oldCompIndex = this.components?.items.findIndex(x => x.id === input.id);
        if(oldCompIndex != null && oldCompIndex !== -1){
            this.components.totalCount--;
            this.components.items.splice(oldCompIndex, 1); 
            this.components.items = [...this.components.items]
        }
        this.loading = false;
    }  
}