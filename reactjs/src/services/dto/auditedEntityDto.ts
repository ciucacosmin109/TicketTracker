import {CreationAuditedEntityDto} from './creationAuditedEntityDto';

export class AuditedEntityDto<T = number> extends CreationAuditedEntityDto<T> {
    lastModificationTime?: Date;
    lastModifierUserId?: T;
}
  