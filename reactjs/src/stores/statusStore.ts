import { action, observable } from "mobx"; 
import { PagedResultDto } from "../services/dto/pagedResultDto";
import { StatusDto } from '../services/status/dto/statusDto';
import statusService from '../services/status/statusService';

export default class StatusStore { 
    @observable loading: boolean = false;
    
    @observable statuses!: PagedResultDto<StatusDto>; 

    @action
    async getAll() : Promise<PagedResultDto<StatusDto>> {
        if(this.statuses == null){
            this.loading = true;
            this.statuses = await statusService.getAll({});
        }
        this.loading = false;
        return this.statuses;
    }  
}