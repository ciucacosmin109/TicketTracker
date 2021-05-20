import { EntityDto } from "../../dto/entityDto";

export class SimpleUserDto extends EntityDto{ 
    userName!: string;
    name!: string;
    surname!: string;
    fullName!: string;
    isActive!: boolean;
}