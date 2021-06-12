import {CreationAuditedEntityDto} from "../../dto/creationAuditedEntityDto";

export class FileDto extends CreationAuditedEntityDto<number> {
    name!: string;
    size!: number;
    ticketId!: number;
}