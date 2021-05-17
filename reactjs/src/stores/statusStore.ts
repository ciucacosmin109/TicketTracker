import { action, observable } from "mobx"; 
import { PagedResultDto } from "../services/dto/pagedResultDto";
import { StatusDto } from '../services/status/dto/statusDto';
import statusService from '../services/status/statusService';

export default class StatusStore { 
    @observable statuses!: PagedResultDto<StatusDto>; 

    @action
    async getAll() {
        this.statuses = await statusService.getAll({});
    }  
}