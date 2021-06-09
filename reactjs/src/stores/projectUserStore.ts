import { action, observable } from "mobx";   
import projectUserService from "../services/projectUser/projectUserService";
import { GetAllProjectUsersInput } from "../services/projectUser/dto/getAllProjectUsersInput"; 
import { ProjectUserDto } from "../services/projectUser/dto/projectUserDto";
import { GetProjectUserInput } from "../services/projectUser/dto/getProjectUserInput";

export default class ProjectUserStore { 
    @observable loading: boolean = false;

    @observable projectUser!: ProjectUserDto;
    @observable projectUsers!: ProjectUserDto[];
    @observable ticketUsers!: ProjectUserDto[];
 
    projectId?: number;
    ticketId?: number;
 
    @action
    async get(userId: number | undefined, projectId: number | undefined) { 
        if(userId == null || projectId == null || Number.isNaN(userId) || Number.isNaN(projectId)){
            return;
        }
        
        this.loading = true;
        let puRes = await projectUserService.get({userId, projectId} as GetProjectUserInput); 
        this.projectUser = puRes;
        this.loading = false;
    }
    getMyRoles(userId: number | undefined): string[] {
        return this.projectUsers
            ?.find(x => x.user.id === userId)
            ?.roles?.map(x => x.name) ?? [];
    }
    hasPermission(userId: number | undefined, projectId: number | undefined, permission : string): boolean {
        let projectUser;
        if(this.projectUser == null){
            if(projectId !== this.projectId){
                return false;
            }

            const pu = this.projectUsers?.find(x => x.user.id === userId);
            if(pu != null){
                projectUser = pu;
            }else{
                return false;
            }
        }else if(this.projectUser.user.id === userId && this.projectUser.projectId === projectId){
            projectUser = this.projectUser;
        }else{
            this.get(userId, projectId);
            return false;
        }
 
        const permissionArrays = projectUser.roles?.map(x => x.permissionNames ?? []) ?? [];
        const permissions = ([] as string[]).concat.apply([], permissionArrays);
        return permissions.includes(permission);  
    }

    @action
    async getAll(projectId : number) { 
        if(Number.isNaN(projectId)){
            return;
        }
        this.loading = true;
        let puRes = await projectUserService.getAll({projectId} as GetAllProjectUsersInput); 
        this.projectUsers = puRes.items;
        this.projectId = projectId;
        this.loading = false;
    }
    @action
    async getAllByTicketId(ticketId : number) { 
        if(Number.isNaN(ticketId)){
            return;
        }
        this.loading = true;
        let puRes = await projectUserService.getAll({ticketId} as GetAllProjectUsersInput); 
        this.ticketUsers = puRes.items; 
        this.ticketId = ticketId;
        this.loading = false;
    } 
 
}