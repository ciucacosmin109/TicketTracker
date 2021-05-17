import { EntityDto } from "../../dto/entityDto";
import { CommentUserDto } from "./others/commentUserDto";

export class CommentDto extends EntityDto {
    content?: string;
    ticketId?: number;
    parentId?: number;

    creatorUser?: CommentUserDto;
    creationTime!: Date;

    children?: CommentDto[];
}