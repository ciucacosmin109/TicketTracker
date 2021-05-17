import { action, observable } from "mobx";  
import { PagedResultDto } from '../services/dto/pagedResultDto';   
import { EntityDto } from "../services/dto/entityDto";
import { CommentDto } from "../services/comment/dto/commentDto";
import commentService from "../services/comment/commentService";
import { GetAllCommentsInput } from "../services/comment/dto/getAllCommentsInput";
import { CreateCommentInput } from "../services/comment/dto/createCommentInput";
import { UpdateCommentInput } from "../services/comment/dto/updateCommentInput";

export default class CommentStore { 
    @observable comments!: PagedResultDto<CommentDto>; 
    ticketId!: number;
  
    @action
    async getAll(ticketId : number) {
        this.ticketId = ticketId;
        this.comments = await commentService.getAll({ticketId} as GetAllCommentsInput);  
    }  
    
    @action
    async create(input : CreateCommentInput) {
        const newC = await commentService.create(input);  

        if(input.parentId != null && this.comments != null && this.comments.items.length > 0){
            // parcurg graful si inserez
            let coada = [] as CommentDto[];
            coada.push(...this.comments.items);
            while(coada.length > 0){
                let x = coada.shift();
                if(x?.id === input.parentId){ 
                    if(x.children == null){
                        x.children = [input as CommentDto];
                    }else{
                        x.children.push(input as CommentDto)
                    }
                    break;
                }
                if(x?.children != null){
                    coada.push(...(x?.children));
                }
            } 
        }else if(input.ticketId != null){
            if(this.comments != null && input.ticketId === this.ticketId){
                this.comments.totalCount++;
                this.comments.items.push(newC); 
                this.comments.items = [...this.comments.items]
            }else if(this.comments == null){ 
                this.comments = { 
                    items: [newC], 
                    totalCount: 1 
                } as PagedResultDto<CommentDto>; 
            }else {
                this.getAll(input.ticketId);
            }
        } 
    }  
    @action
    async update(input : UpdateCommentInput) {
        const newComment = await commentService.update(input); 
        
        if(this.comments != null && this.comments.items.length > 0){
            // parcurg graful si fac update
            let coada = [] as CommentDto[];
            coada.push(...this.comments.items);
            while(coada.length > 0){
                let x = coada.shift();
                if(x?.id === input.id){ 
                    x.content = newComment.content;
                    break;
                }
                if(x?.children != null){
                    coada.push(...(x?.children));
                }
            } 
        }
    }  
    @action
    async delete(input : EntityDto) {
        await commentService.delete(input); 

        if(this.comments == null || this.comments.items.length === 0)
            return;

        const oldIdx = this.comments.items.findIndex(x => x.id === input.id);
        if(oldIdx != null && oldIdx !== -1){
            this.comments.totalCount--;
            this.comments.items.splice(oldIdx, 1); 
            this.comments.items = [...this.comments.items]
        }else {
            // parcurg graful si sterg
            let coada = [] as CommentDto[];
            coada.push(...this.comments.items);
            while(coada.length > 0){
                let x = coada.shift(); 
                if(x?.children != null){
                    const idx = x?.children.findIndex(c => c.id === input.id);
                    if(idx != null && idx !== -1){ 
                        x.children.splice(idx, 1); 
                        x.children = [...(x?.children)];

                        break;
                    }else coada.push(...(x.children));
                }
            } 
        } 
    }  
}