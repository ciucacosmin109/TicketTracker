import { action, observable } from "mobx"; 
import { PagedResultDto } from "../services/dto/pagedResultDto";
import { ActivityDto } from '../services/activity/dto/activityDto';
import activityService from '../services/activity/activityService';

export default class ActivityStore { 
    @observable loading: boolean = false;
    
    @observable activities!: PagedResultDto<ActivityDto>; 

    @action
    async getAll() : Promise<PagedResultDto<ActivityDto>> {
        if(this.activities == null){
            this.loading = true;
            this.activities = await activityService.getAll({});
        }
        this.loading = false;
        return this.activities;
    }  
}