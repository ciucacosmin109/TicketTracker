import { action, observable } from "mobx";   
import projectUserService from "../services/projectUser/projectUserService";
import { GetAllProjectUsersInput } from "../services/projectUser/dto/getAllProjectUsersInput"; 
import { ProjectUserDto } from "../services/projectUser/dto/projectUserDto";

export default class ProjectUserStore { 
    @observable projectUsers!: ProjectUserDto[];

    projectId?: number;
    ticketId?: number;
 
    @action
    async getAll(projectId : number) { 
        let puRes = await projectUserService.getAll({projectId} as GetAllProjectUsersInput); 
        this.projectUsers = puRes.items;
        this.projectId = projectId;
        this.ticketId = undefined;
    }
    @action
    async getAllByTicketId(ticketId : number) { 
        let puRes = await projectUserService.getAll({ticketId} as GetAllProjectUsersInput); 
        this.projectUsers = puRes.items;
        this.projectId = undefined;
        this.ticketId = ticketId;
    }
 
}