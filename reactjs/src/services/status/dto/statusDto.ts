import { EntityDto } from "../../dto/entityDto";

export class StatusDto extends EntityDto {
    name!: string;
    isStatic!: boolean;
}