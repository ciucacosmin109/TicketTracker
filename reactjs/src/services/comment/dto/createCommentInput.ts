export class CreateCommentInput {
    content!: string;

    ticketId?: number;
    parentId?: number;
}