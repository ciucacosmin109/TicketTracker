import { EntityDto } from "../../dto/entityDto";

export class UpdateComponentInput extends EntityDto<number> {
    name!: string;
    description?: string;
}