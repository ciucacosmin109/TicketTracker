import { EntityDto } from "../../../dto/entityDto";

export class PRoleWithPermissionsDto extends EntityDto {
    name!: string;
    permissionNames?: string[];
}