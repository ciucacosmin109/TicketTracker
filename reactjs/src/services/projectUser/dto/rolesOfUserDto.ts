import { EntityDto } from "../../dto/entityDto";

export class RolesOfUserDto extends EntityDto {
    userId!: number;
    projectId!: number;

    roleNames?: string[];
}