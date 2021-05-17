import { action, observable } from "mobx"; 
import { PagedResultDto } from "../services/dto/pagedResultDto";
import { ActivityDto } from '../services/activity/dto/activityDto';
import activityService from '../services/activity/activityService';

export default class ActivityStore { 
    @observable activities!: PagedResultDto<ActivityDto>; 

    @action
    async getAll() {
        this.activities = await activityService.getAll({});
    }  
}