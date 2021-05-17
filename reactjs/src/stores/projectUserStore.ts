import { action, observable } from "mobx";  
import { SimpleUserWithRolesDto } from "../services/projectUser/dto/simpleUserWithRolesDto"; 
import projectUserService from "../services/projectUser/projectUserService";
import { GetProjectUsersInput } from "../services/projectUser/dto/getProjectUsersInput"; 

export default class ProjectUserStore { 
    @observable projectUsers!: SimpleUserWithRolesDto[];

    projectId!: number;
 
    @action
    async getAll(projectId : number) { 
        let puRes = await projectUserService.getUsersOfProject({projectId} as GetProjectUsersInput); 
        this.projectUsers = puRes.users;
        this.projectId = puRes.projectId;
    }
    @action
    async getAllByTicketId(ticketId : number) { 
        let puRes = await projectUserService.getUsersOfProject({ticketId} as GetProjectUsersInput); 
        this.projectUsers = puRes.users;
        this.projectId = puRes.projectId;
    }
 
}