import {EntityDto} from './entityDto';

export class CreationAuditedEntityDto<T = number> extends EntityDto<T> {
    creationTime?: Date;
    creatorUserId?: T;
}
  