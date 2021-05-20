import { EntityDto } from "../../dto/entityDto";
import { SimpleUserDto } from "../../user/dto/simpleUserDto"; 

export class CommentDto extends EntityDto {
    content?: string;
    ticketId?: number;
    parentId?: number;

    creatorUser?: SimpleUserDto; 
    creationTime!: Date;

    children?: CommentDto[];
}