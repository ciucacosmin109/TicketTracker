import { EntityDto } from "../../dto/entityDto";

export class ActivityDto extends EntityDto {
    name!: string;
    isStatic!: boolean;
}