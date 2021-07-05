import { action, observable } from "mobx";   
import projectUserService from "../services/projectUser/projectUserService";
import { GetAllProjectUsersInput } from "../services/projectUser/dto/getAllProjectUsersInput"; 
import { ProjectUserDto } from "../services/projectUser/dto/projectUserDto";
import { GetProjectUserInput } from "../services/projectUser/dto/getProjectUserInput";

export default class ProjectUserStore { 
    @observable loadingUser: boolean = false;
    @observable loadingUsers: boolean = false;

    @observable projectUser!: ProjectUserDto; 
    @observable projectUsers!: ProjectUserDto[];
    @observable componentUsers!: ProjectUserDto[];
    @observable ticketUsers!: ProjectUserDto[];

    @action
    async getByProject(userId: number, projectId: number) {  
        this.loadingUser = true;

        let puRes = await projectUserService.get({userId, projectId} as GetProjectUserInput); 
        this.projectUser = puRes;

        this.loadingUser = false;
    }
    @action
    async getByComponent(userId: number, componentId: number) {  
        this.loadingUser = true;

        let puRes = await projectUserService.get({userId, componentId} as GetProjectUserInput); 
        this.projectUser = puRes;

        this.loadingUser = false;
    }
    @action
    async getByTicket(userId: number, ticketId: number) {  
        this.loadingUser = true;

        let puRes = await projectUserService.get({userId, ticketId} as GetProjectUserInput); 
        this.projectUser = puRes;

        this.loadingUser = false;
    }

    getMyRoles(userId: number | undefined): string[] {
        return this.projectUsers
            ?.find(x => x.user.id === userId)
            ?.roles?.map(x => x.name) ?? [];
    }
    hasPermission(userId: number | undefined, permission : string): boolean {
        let projectUser;
        if(this.projectUser == null){  
            const pu = this.projectUsers?.find(x => x.user.id === userId);
            if(pu != null){
                projectUser = pu;
            }else{
                return false;
            }
        }else if(this.projectUser.user.id === userId){
            projectUser = this.projectUser;
        }else{ 
            return false;
        }
 
        const permissionArrays = projectUser.roles?.map(x => x.permissionNames ?? []) ?? [];
        const permissions = ([] as string[]).concat.apply([], permissionArrays);
        return permissions.includes(permission);  
    }

    @action
    async getAllByProject(projectId : number) { 
        if(Number.isNaN(projectId)){
            return;
        }
        this.loadingUsers = true;
        let puRes = await projectUserService.getAll({projectId} as GetAllProjectUsersInput); 
        this.projectUsers = puRes.items; 
        this.loadingUsers = false;
    }
    @action
    async getAllByComponent(componentId : number) { 
        if(Number.isNaN(componentId)){
            return;
        }
        this.loadingUsers = true;
        let puRes = await projectUserService.getAll({componentId} as GetAllProjectUsersInput); 
        this.componentUsers = puRes.items; 
        this.loadingUsers = false;
    }
    @action
    async getAllByTicket(ticketId : number) { 
        if(Number.isNaN(ticketId)){
            return;
        }
        this.loadingUsers = true;
        let puRes = await projectUserService.getAll({ticketId} as GetAllProjectUsersInput); 
        this.ticketUsers = puRes.items;
        this.loadingUsers = false;
    } 
 
}