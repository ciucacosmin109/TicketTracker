import { EntityDto } from "../../dto/entityDto";

export class ProjectUserDto extends EntityDto {
    userId!: number;
    projectId!: number;
}